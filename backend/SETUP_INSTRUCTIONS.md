# Authentication Backend Setup Instructions

Welcome to the Pet Care authentication backend! This handles all the secure login, registration, and Google OAuth functionality. Follow the steps below to configure your development environment.

## Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally or a cloud instance)
- A Google Cloud Project for OAuth Client ID.

## 1. Install Dependencies
Navigate to the `backend` directory and install the necessary dependencies including the newly added packages (`bcrypt`, `jsonwebtoken`, `google-auth-library`):

```bash
cd backend
npm install
```

## 2. Environment Variables Configuration
Copy the `.env.example` file to create your own configuration file:

```bash
cp .env.example .env
```

Open `.env` and fill the variables:
- `DATABASE_URL`: Set your PostgreSQL connection string. Ensure the database exists. Example: `postgresql://username:password@localhost:5432/petcare?schema=public`
- `JWT_SECRET`: A secure random string. (You can generate one using `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- `GOOGLE_CLIENT_ID`: Create OAuth 2.0 Credentials in [Google Cloud Console](https://console.cloud.google.com/) and paste the Client ID here.

## 3. Database Migration and Client Generation
Once your `.env` contains the correct `DATABASE_URL`, execute the Prisma commands to push the schema to your database and generate the Prisma client:

```bash
npx prisma generate
npx prisma db push
```

Alternatively, if you prefer using Prisma migrate for tracking schema changes:
```bash
npx prisma migrate dev --name init
```

## 4. Run the Server
For development (using nodemon):
```bash
npm run dev
```

For production:
```bash
npm start
```

The server should output: `Server is running on port 5000`.

---

# Sample Request Bodies for API Testing

Here are some sample JSON requests you can use to interact with the authentication API endpoints via Postman or your frontend app.

### 1. Register
**POST** `/api/auth/register`
```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "password": "Password123!",
  "role": "user"    // Supported roles: "user", "owner", "volunteer", "vet"
}
```

### 2. Login
**POST** `/api/auth/login`
```json
{
  "email": "jane@example.com",
  "password": "Password123!"
}
```

### 3. Google Login
**POST** `/api/auth/google`
```json
{
  "idToken": "eyJhbGciOiJUlzI1...<Omitted_for_brevity>" 
}
```
*(The `idToken` should be obtained from the Google Identity Services script on your frontend)*

### 4. Forgot Password
**POST** `/api/auth/forgot-password`
```json
{
  "email": "jane@example.com"
}
```

### 5. Reset Password
**POST** `/api/auth/reset-password`
```json
{
  "email": "jane@example.com",
  "newPassword": "NewStrongPassword456!"
}
```

### 6. Get Current User (Me)
**GET** `/api/auth/me`
**Headers:**
```
Authorization: Bearer <Your_JWT_Token>
```
*(No body required)*

### 7. Logout
**POST** `/api/auth/logout`
*(No body required. Frontend simply deletes the token and calls this endpoint)*

---

# Frontend Integration Notes

- **Tokens:** Store the incoming `token` from `Register`, `Login`, and `Google Login` responses inside `localStorage` or `sessionStorage` (e.g., `localStorage.setItem('token', response.data.token)`).
- **Headers:** Attach this token to authorization headers for protected routes (like the `/me` endpoint):
  `headers: { Authorization: \`Bearer ${localStorage.getItem('token')}\` }`
- **Logout Sequence:** Call the logout endpoint to clear any backend dependencies (though JWT is stateless here), and definitively remove your local token `localStorage.removeItem('token')`, subsequently updating your React state to redirect the user to login.
- **Role-Based Access:** Read the user's `role` either by decoding the JWT directly or saving the user's details globally utilizing state management after they successfully authenticate.
