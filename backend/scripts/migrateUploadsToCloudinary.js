require("dotenv").config();
const path = require("path");
const fs = require("fs");
const prisma = require("../prisma/prismaClient");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");

const APPLY_CHANGES = process.argv.includes("--write");

const targets = [
  { model: "petPhoto", field: "url" },
  { model: "adoptionPet", field: "image" },
  { model: "rescueRequest", field: "photoUrl" },
  { model: "vaccination", field: "proofUrl" },
  { model: "medicalRecord", field: "reportUrl" },
  { model: "prescription", field: "fileUrl" },
];

const isRelativeUploadPath = (value) =>
  typeof value === "string" && value.startsWith("/uploads/");

const localPathFromRelative = (relativePath) =>
  path.join(__dirname, "..", relativePath.replace(/^\//, ""));

const folderFromRelative = (relativePath) => {
  const parts = relativePath.split("/");
  const sub = parts[2] || "others";
  return `pet-care/${sub}`;
};

async function migrateOne(model, field) {
  const rows = await prisma[model].findMany({
    where: {
      [field]: {
        startsWith: "/uploads/",
      },
    },
    select: { id: true, [field]: true },
  });

  console.log(`\n[${model}.${field}] Found ${rows.length} relative upload URLs`);

  let migrated = 0;
  let skipped = 0;
  let missing = 0;

  for (const row of rows) {
    const current = row[field];
    if (!isRelativeUploadPath(current)) {
      skipped += 1;
      continue;
    }

    const localFilePath = localPathFromRelative(current);
    if (!fs.existsSync(localFilePath)) {
      missing += 1;
      console.log(`- Missing file for ${model}:${row.id} -> ${current}`);
      continue;
    }

    const uploadResult = await cloudinary.uploader.upload(localFilePath, {
      folder: folderFromRelative(current),
      resource_type: "image",
    });

    if (APPLY_CHANGES) {
      await prisma[model].update({
        where: { id: row.id },
        data: { [field]: uploadResult.secure_url },
      });
      migrated += 1;
      console.log(`- Updated ${model}:${row.id}`);
    } else {
      migrated += 1;
      console.log(`- Dry-run would update ${model}:${row.id}`);
    }
  }

  return { migrated, skipped, missing, total: rows.length };
}

async function main() {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary is not configured. Set CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.");
  }

  console.log(APPLY_CHANGES
    ? "Running migration in WRITE mode"
    : "Running migration in DRY-RUN mode (use --write to apply)");

  const summary = [];
  for (const target of targets) {
    // eslint-disable-next-line no-await-in-loop
    const result = await migrateOne(target.model, target.field);
    summary.push({ ...target, ...result });
  }

  console.log("\n=== Migration Summary ===");
  for (const item of summary) {
    console.log(
      `${item.model}.${item.field}: total=${item.total}, migrated=${item.migrated}, missing=${item.missing}, skipped=${item.skipped}`
    );
  }
}

main()
  .catch((err) => {
    console.error("Migration failed:", err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
