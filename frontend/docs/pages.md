# 📑 Pages Inventory – Pet Care Platform

This document will track all the project pages, routes, roles, statuses, and required APIs.

---

## 🔐 Authentication

| Page Name        | Route             | Role | Status  | API Needed              | Notes |
|------------------|-------------------|------|---------|-------------------------|-------|
| Sign In          | /login            | All  | UI Done | POST /auth/login        | JWT later |
| Sign Up          | /register         | All  | UI Done | POST /auth/register     | Email/OTP later |
| Forgot Password  | /forgot-password  | All  | UI Done | POST /auth/forgot       | Reset flow |

---

## 👤 User Profile

| Page Name     | Route     | Role  | Status  | API Needed        | Notes |
|---------------|-----------|-------|---------|-------------------|-------|
| User Profile  | /profile  | User  | UI Done | GET /users/me     | Edit profile later |

---

## 🐾 Pet Profile & Care

| Page Name              | Route               | Role  | Status  | API Needed                 | Notes |
|------------------------|---------------------|-------|---------|----------------------------|-------|
| Pet List               | /pets               | Owner | UI Done | GET /pets                  | Dashboard |
| Add Pet                | /pets/add           | Owner | UI Done | POST /pets                 | Image upload later |
| Pet Details (Tabs)     | /pets/:id           | Owner | UI Done | GET /pets/:id              | Vaccines, Medical, Gallery |
| Care Schedule List     | /pets/schedule      | Owner | UI Done | GET /pets/:id/schedules    | Reminders later |
| Weight Log             | /pets/weight        | Owner | UI Done | GET /pets/:id/weights      | Charts |
| Vaccination Records    | /pets/vaccines      | Owner | UI Done | GET /pets/:id/vaccines     | Add/Edit later |
| Medical History        | /pets/medical       | Owner | UI Done | GET /pets/:id/medical      | Vet notes |
| Prescriptions          | /pets/prescriptions | Owner | UI Done | GET /pets/:id/prescriptions| PDF upload later |
| Pet Gallery            | /pets/gallery       | Owner | UI Done | GET /pets/:id/gallery      | Cloudinary later |
| Care Calendar          | /pets/calendar      | Owner | UI Done | GET /pets/:id/calendar     | Sync Google Calendar |

---

## 🏠 Adoption

| Page Name           | Route     | Role     | Status  | API Needed            | Notes |
|---------------------|-----------|----------|---------|-----------------------|-------|
| Adoption Listing    | /adopt    | All      | UI Done | GET /adoptions        | Filters later |
| Adoption Details    | /adopt/:id| All      | Todo    | GET /adoptions/:id   |       |
| Adoption Request    | /adopt/apply/:id | User | Todo | POST /adoptions/apply| Approval flow |

---

## 🚨 Rescue

| Page Name             | Route            | Role       | Status | API Needed              | Notes |
|-----------------------|------------------|------------|--------|-------------------------|-------|
| Submit Rescue Request | /rescue          | User       | Todo   | POST /rescues           | Map picker |
| Rescue Map            | /rescue/map      | Volunteer  | Todo   | GET /rescues/nearby     | Live map |
| Rescue Tracking       | /rescue/:id      | Volunteer  | Todo   | GET /rescues/:id        | Status timeline |

---

## 💰 Donations

| Page Name       | Route        | Role | Status | API Needed        | Notes |
|-----------------|--------------|------|--------|-------------------|-------|
| Donate Page     | /donate      | All  | Todo   | POST /donations   | Payment gateway |
| Donation History| /donations   | User | Todo   | GET /donations/me | Receipts |

---

## 🧑‍🤝‍🧑 Community (Future)

| Page Name     | Route        | Role | Status | API Needed     | Notes |
|---------------|--------------|------|--------|----------------|-------|
| Community Feed| /community   | All  | Future | GET /posts     | Like/Comment |
| Post Details  | /posts/:id   | All  | Future | GET /posts/:id |       |

---

## 🛡️ Admin Panel

| Page Name            | Route             | Role  | Status  | API Needed               | Notes |
|----------------------|-------------------|-------|---------|--------------------------|-------|
| Admin Dashboard      | /admin            | Admin | UI Done | GET /admin/metrics      | Charts |
| User Management      | /admin/users      | Admin | Todo    | GET /admin/users        | Block/Verify |
| Pet Moderation       | /admin/pets       | Admin | Todo    | GET /admin/pets         | Approve listings |
| Adoption Requests    | /admin/adoptions  | Admin | Todo    | GET /admin/adoptions    | Approve/Reject |
| Rescue Management    | /admin/rescues    | Admin | Todo    | GET /admin/rescues      | Emergency view |
| Donations Overview   | /admin/donations  | Admin | Todo    | GET /admin/donations    | Finance |
| Reports & Analytics  | /admin/reports    | Admin | Todo    | GET /admin/reports      | CSV export |
| Alerts & Flags       | /admin/alerts     | Admin | Todo    | GET /admin/alerts       | Abuse cases |
| Admin Settings       | /admin/settings   | Admin | Todo    | GET /admin/settings     | Roles & config |

---

## 📌 Status Legend

- UI Done ✅ = Frontend UI complete  
- Todo ⏳ = Planned  
- Future 🚀 = Phase 2/3  