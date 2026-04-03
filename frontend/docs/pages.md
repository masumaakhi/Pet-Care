# 📑 Pages Inventory – Pet Care Platform

This document tracks all project pages, routes, roles, statuses, and required APIs.


---

## 🌐 Public Pages

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| Home | / | All | UI Done ✅ | — | Landing page |
| Adopt (Landing) | /adopt | All | UI Done ✅ | — | Entry page |
| Adoption Listing | /adopt/listing | All | UI Done ✅ | GET /adoptions | |
| Adoption Details | /adopt/listing/:id | All | UI Done ✅ | GET /adoptions/:id | |
| Adoption Flow | /adopt/flow/:id | User | UI Done ✅ | POST /adoptions/apply | |
| Health Hub | /health | Owner/User | UI Done ✅ | — | |

---

## 🛠 Services Module

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| Services | /services | All | UI Done ✅ | GET /services | |
| Service Details | /services/:id | All | UI Done ✅ | GET /services/:id | |
| My Bookings | /services/my-bookings | User | UI Done ✅ | GET /bookings/me | |
| Booking Details | /services/bookings/:id | User | UI Done ✅ | GET /bookings/:id | |

---

## 🔐 Authentication

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| Sign In | /login | All | UI Done ✅ | POST /auth/login | |
| Sign Up | /register | All | UI Done ✅ | POST /auth/register | |
| Forgot Password | /forgot-password | All | UI Done ✅ | POST /auth/forgot | |

---

## 👤 User Profile

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| User Profile | /profile | User | UI Done ✅ | GET /users/me | |

---

## 🐾 Pet Profile & Care

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| Pet List | /pets | Owner | UI Done ✅ | GET /pets | |
| Add Pet | /pets/add | Owner | UI Done ✅ | POST /pets | |
| Pet Details | /pets/:id | Owner | UI Done ✅ | GET /pets/:id | |
| Care Schedule | /pets/schedule | Owner | UI Done ✅ | GET /pets/:id/schedules | |
| Weight Log | /pets/weight | Owner | UI Done ✅ | GET /pets/:id/weights | |
| Pet Gallery | /pets/gallery | Owner | UI Done ✅ | GET /pets/:id/gallery | |
| Care Calendar | /pets/calendar | Owner | UI Done ✅ | GET /pets/:id/calendar | |

---

## 🏥 Health & Medical Module

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| Vaccination Records | /vaccines | Owner | UI Done ✅ | GET /pets/:id/vaccines | |
| Medical History | /medical | Owner | UI Done ✅ | GET /pets/:id/medical | |
| Prescriptions | /prescriptions | Owner | UI Done ✅ | GET /pets/:id/prescriptions | |
| Deworming Schedule | (inside Vaccines) | Owner | Todo ⏳ | GET /pets/:id/deworming | |
| Medication Tracker | (inside Prescriptions) | Owner | Todo ⏳ | GET /pets/:id/medications | |
| Vet Visit Records | (inside Medical) | Owner | Todo ⏳ | GET /pets/:id/visits | |
| Health Risk Score | /health/risk | Owner | Todo ⏳ | GET /pets/:id/risk-score | Not in router |
| Special Care Notes | /health/notes | Owner | Todo ⏳ | GET /pets/:id/notes | Not in router |

---

## 🏠 Adoption

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| Adoption Listing | /adopt/listing | All | UI Done ✅ | GET /adoptions | |
| Adoption Details | /adopt/listing/:id | All | UI Done ✅ | GET /adoptions/:id | |
| Adoption Flow | /adopt/flow/:id | User | UI Done ✅ | POST /adoptions/apply | |

---

## 🚨 Rescue

### 👤 User

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| Submit Rescue | /rescue | User | UI Done ✅ | POST /rescues | |
| My Requests | /rescue/my-requests | User | UI Done ✅ | GET /rescues/me | |
| Rescue Tracking | /rescue/tracking/:id | User | UI Done ✅ | GET /rescues/:id | |

---

### 🦸 Volunteer

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| Nearby Requests | /rescue/nearby | Volunteer | UI Done ✅ | GET /rescues/nearby | |
| Assigned Rescue | /rescue/assigned/:id | Volunteer | UI Done ✅ | GET /rescues/:id | |
| Rescue History | /rescue/history | Volunteer | UI Done ✅ | GET /rescues/history | |

---

### 🛡 Admin (Rescue)

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| Rescue List | /admin/rescues | Admin | UI Done ✅ | GET /admin/rescues | |
| Rescue Details | /admin/rescues/:id | Admin | UI Done ✅ | GET /admin/rescues/:id | |
| Rescue Map | /admin/rescues/map | Admin | UI Done ✅ | GET /admin/rescues/map | |
| Rescue Analytics | /admin/rescues/analytics | Admin | UI Done ✅ | GET /admin/rescues/analytics | |
| Duplicate Rescues | /admin/rescues/duplicates | Admin | UI Done ✅ | GET /admin/rescues/duplicates | |
| Notifications | /admin/rescues/notifications | Admin | UI Done ✅ | GET /admin/rescues/notifications | |

---

## 💰 Donations

### 👤 User

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| Donate Page | /donate | All | UI Done ✅ | POST /donations | |
| My Donations | /donations | User | UI Done ✅ | GET /donations/me | |
| Campaign Details | /donations/campaign/:id | All | UI Done ✅ | GET /campaigns/:id | |

---

### 🛡 Admin

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| Donations | /admin/donations | Admin | UI Done ✅ | GET /admin/donations | |
| Donation Reports | /admin/donations/reports | Admin | UI Done ✅ | GET /admin/donations/reports | |

---

## 👥 Community

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| Community Feed | /community | All | UI Done ✅ | GET /posts | |
| Post Details | /posts/:id | All | Todo ⏳ | GET /posts/:id | Not in router |

---

## 🛡️ Admin Panel (General)

| Page Name | Route | Role | Status | API Needed | Notes |
|---|---|---|---|---|---|
| Admin Dashboard | /admin | Admin | UI Done ✅ | GET /admin/metrics | |
| User Management | /admin/users | Admin | UI Done ✅ | GET /admin/users | |
| View User | /admin/users/view/:id | Admin | UI Done ✅ | GET /admin/users/:id | |
| Edit User | /admin/users/edit/:id | Admin | UI Done ✅ | PUT /admin/users/:id | |
| Pet Moderation | /admin/pets | Admin | Todo ⏳ | GET /admin/pets | Not in router |
| Adoption Requests | /admin/adoptions | Admin | Todo ⏳ | GET /admin/adoptions | Not in router |
| Reports & Analytics | /admin/reports | Admin | Todo ⏳ | GET /admin/reports | Not in router |
| Alerts & Flags | /admin/alerts | Admin | Todo ⏳ | GET /admin/alerts | Not in router |
| Admin Settings | /admin/settings | Admin | Todo ⏳ | GET /admin/settings | Not in router |

---

## 📌 Status Legend

- UI Done ✅ = Frontend UI complete  
- Todo ⏳ = Planned / Backend pending  
- Future 🚀 = Phase 2/3  
- Planned 🧩 = Tab/section inside existing pages  

## 📌 Status Legend

- UI Done ✅ = Frontend UI complete  
- Todo ⏳ = Planned  
- Future 🚀 = Phase 2/3  
- Planned 🧩 = Tab/section inside existing pages