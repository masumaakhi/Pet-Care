# Postman Testing Instructions - Phase 1: Pet CRUD

Follow these steps to verify the Pet CRUD APIs.

### Prerequisites
1. Ensure the backend is running (`node server.js` or `npm start`).
2. Login to get a valid JWT token from `/api/auth/login`.
3. Add the token to Postman's **Authorization** tab as **Bearer Token**.

---

### 1. Create Pet
- **Method**: `POST`
- **URL**: `http://localhost:5250/api/pets`
- **Body** (JSON):
```json
{
  "name": "Milo",
  "species": "Cat",
  "breed": "Mixed",
  "age_months": 24,
  "gender": "Male",
  "weight_kg": 4.5,
  "description": "A very friendly cat who loves to play."
}
```
- **Expected**: `251 Created` with the pet object.

### 2. Get All Pets
- **Method**: `GET`
- **URL**: `http://localhost:5250/api/pets`
- **Expected**: `200 OK` with an array of pets owned by you.

### 3. Get Single Pet
- **Method**: `GET`
- **URL**: `http://localhost:5250/api/pets/:id` (Replace `:id` with a real pet ID)
- **Expected**: `200 OK` with the pet details.

### 4. Update Pet
- **Method**: `PATCH`
- **URL**: `http://localhost:5250/api/pets/:id`
- **Body** (JSON):
```json
{
  "weight_kg": 4.8,
  "description": "Updated description: Still loves to play, but eats more now!"
}
```
- **Expected**: `200 OK` with updated pet details.

### 5. Delete Pet
- **Method**: `DELETE`
- **URL**: `http://localhost:5250/api/pets/:id`
- **Expected**: `200 OK` with success message.

---

### Security Check (Ownership)
1. Login with **User A**, create a pet, and get its ID.
2. Login with **User B**, try to `GET /api/pets/:id` using User A's pet ID.
3. **Expected**: `403 Forbidden` (Not authorized to access this pet).

---

# Phase 2: Schedule & Weight

### 6. Create Schedule
- **Method**: `POST`
- **URL**: `http://localhost:5250/api/pets/:id/schedules`
- **Body** (JSON):
```json
{
  "type": "Feeding",
  "title": "Morning Kibble",
  "scheduled_date": "2026-04-04T00:00:00.000Z",
  "scheduled_time": "08:00 AM",
  "frequency": "Daily",
  "notes": "Give 1/2 cup of dry food."
}
```
- **Expected**: `201 Created`.

### 7. Get Pet Schedules
- **Method**: `GET`
- **URL**: `http://localhost:5250/api/pets/:id/schedules`
- **Expected**: `200 OK` with list of schedules.

### 8. Create Weight Log
- **Method**: `POST`
- **URL**: `http://localhost:5250/api/pets/:id/weights`
- **Body** (JSON):
```json
{
  "weight_kg": 4.7,
  "date": "2026-04-04T10:00:00.000Z",
  "note": "Slight increase after breakfast."
}
```
- **Expected**: `201 Created`.

### 9. Get Weight Logs
- **Method**: `GET`
- **URL**: `http://localhost:5250/api/pets/:id/weights`
- **Expected**: `200 OK` with list of weight entries.
