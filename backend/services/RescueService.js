// backend/services/RescueService.js
const prisma = require("../prisma/prismaClient");

/**
 * Service for core Rescue module logic
 */
class RescueService {
  /**
   * Calculate haversine distance between two coordinates in km
   */
  getDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371; // km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Find nearby volunteers within a radius (in km)
   */
  async findNearbyVolunteers(lat, lng, radiusKM = 10) {
    const volunteers = await prisma.volunteerProfile.findMany({
      where: { availability: true },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            phone: true,
            latitude: true,
            longitude: true,
          },
        },
      },
    });

    const nearby = volunteers
      .map((v) => {
        const vLat = v.lastLat ?? v.user?.latitude;
        const vLng = v.lastLng ?? v.user?.longitude;
        return {
          ...v,
          distance: this.getDistance(lat, lng, vLat, vLng),
        };
      })
      .filter((v) => {
        const cap = v.radiusKM || radiusKM;
        return v.distance <= cap && v.distance !== Infinity;
      })
      .sort((a, b) => a.distance - b.distance);

    return nearby;
  }

  /**
   * Find nearby clinics (Vets) within a radius (in km)
   */
  async findNearbyClinics(lat, lng, radiusKM = 15) {
    const clinics = await prisma.user.findMany({
      where: { role: "vet", status: "active" },
      select: { id: true, fullName: true, phone: true, address: true, latitude: true, longitude: true }
    });

    const nearby = clinics
      .map((c) => ({
        ...c,
        distance: this.getDistance(lat, lng, c.latitude || 0, c.longitude || 0),
      }))
      .filter((c) => c.distance <= radiusKM)
      .sort((a, b) => a.distance - b.distance);

    return nearby;
  }

  /**
   * Calculate duplicate score for a new request
   */
  /**
   * Placeholder perceptual similarity: boosts duplicate score when photos may match.
   * Replace with real pHash/ML similarity in production.
   */
  stubImageSimilarityScore(photoUrlA, photoUrlB) {
    if (!photoUrlA || !photoUrlB) return 0;
    const a = String(photoUrlA).split("/").pop() || "";
    const b = String(photoUrlB).split("/").pop() || "";
    if (a && a === b) return 0.35;
    const lenDiff = Math.abs(a.length - b.length);
    if (lenDiff <= 4 && a.length > 8 && b.length > 8) return 0.12;
    return 0.04;
  }

  async detectDuplicates(newRequest) {
    const { incidentLat, incidentLng, problemType, photoUrl } = newRequest;
    if (incidentLat == null || incidentLng == null) {
      return { isDuplicate: false, score: 0, mainRequestId: null };
    }

    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const candidates = await prisma.rescueRequest.findMany({
      where: {
        createdAt: { gte: threeHoursAgo },
        status: { not: "CANCELLED" },
      },
    });

    let bestScore = 0;
    let mainRequestId = null;

    for (const req of candidates) {
      const distance = this.getDistance(
        incidentLat,
        incidentLng,
        req.incidentLat,
        req.incidentLng
      );
      if (distance > 0.5) continue;

      let score = 0;
      score += (0.5 - distance) * 0.8;

      if (req.problemType === problemType) score += 0.3;

      const timeDiff = Math.abs(Date.now() - new Date(req.createdAt).getTime());
      score += (1 - timeDiff / (3 * 60 * 60 * 1000)) * 0.3;

      score += this.stubImageSimilarityScore(photoUrl, req.photoUrl);

      if (score > bestScore) {
        bestScore = score;
        mainRequestId = req.id;
      }
    }

    return {
      isDuplicate: bestScore > 0.7,
      score: Math.min(bestScore, 1),
      mainRequestId,
    };
  }

  /**
   * Calculate ETA in minutes based on distance (assumes 40km/h avg speed)
   */
  calculateETA(distanceKM) {
    if (!distanceKM || distanceKM === Infinity) return null;
    const avgSpeed = 40; // km/h
    const timeHr = distanceKM / avgSpeed;
    return Math.round(timeHr * 60) + 5; // adds 5 mins prep time
  }

  /**
   * Create assignment retry cycle (Assignment logic)
   */
  async assignNextVolunteer(rescueId, excludeVolunteerIds = []) {
    const rescue = await prisma.rescueRequest.findUnique({ 
      where: { id: rescueId },
      include: { assignments: true }
    });
    if (!rescue) return null;

    // Get IDs of volunteers already tried
    const alreadyTried = rescue.assignments.map(a => a.volunteerId);
    const combinedExcluded = [...new Set([...alreadyTried, ...excludeVolunteerIds])];

    const nearby = await this.findNearbyVolunteers(
      rescue.incidentLat,
      rescue.incidentLng
    );

    const candidate = nearby.find((v) => !combinedExcluded.includes(v.userId));

    if (candidate) {
      // 1. Mark existing PENDING assignments as EXPIRED
      await prisma.rescueAssignment.updateMany({
        where: { rescueId, status: "PENDING" },
        data: { status: "EXPIRED" }
      });

      // 2. Create new assignment
      const assignment = await prisma.rescueAssignment.create({
        data: {
          rescueId,
          volunteerId: candidate.userId,
          status: "PENDING",
        },
      });

      // 3. Update RescueRequest status to ASSIGNED if it was PENDING
      await prisma.rescueRequest.update({
        where: { id: rescueId },
        data: { status: "ASSIGNED", assignedVolunteerId: candidate.userId }
      });

      return assignment;
    }

    return null;
  }
}

module.exports = new RescueService();
