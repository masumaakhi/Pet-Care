# Pet-Care Platform Architecture & Module Documentation

This document provides a comprehensive technical overview of the Pet-Care platform, following the structured modular architecture (Mohul standard).

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React / Next.js (App Router pattern)
- **Styling**: Tailwind CSS (Premium Glassmorphism)
- **State Management**: React Hooks (useMemo, useEffect)
- **Animations**: Framer Motion
- **Visualization**: Recharts (Analytics & Trends)
- **Icons**: Lucide React

### Backend
- **Framework**: Node.js / Express
- **ORM**: Prisma (Type-safe database access)
- **Authentication**: JWT & Bcrypt (OTP-ready logic)
- **Real-time**: Socket.io (Rescue tracking & Notifications)

### Database
- **Provider**: PostgreSQL
- **Schema**: Modular schema handling Users, Pets, Medical, Rescues, Adoptions, and Donations.

---

## 🎨 Design System

### Typography
- **Primary Font**: Li Ador Norrit
- **Text Color**: `#2F3E2C` (Deep Emerald Dark)

### Colors
| Element | Hex Code | Visual Description |
| :--- | :--- | :--- |
| **Background** | `#F6EFE6` | Light Cream / Bone |
| **Primary Base** | `#5F7D5A` | Moss Green |
| **Secondary Base** | `#7FA37A` | Emerald Green |
| **Primary Button**| `#146C4A` | Dark Forest Green |
| **Accent / Wood** | `#8B6B4C` | Earthy Brown |
| **Button Text** | `#F4F1E8` | Off-white |

### Button Styles
- **Primary**: Solid Emerald Gradient → Hover Lift.
- **Ghost**: Blurred Glass border → Lighter Green Fill on hover.
- **Action**: Rounded-XL, 3D shadow depth.

---

## 1. User-Side Modules

### 1.1 Public Website Module
- **Home Page**: Hero Section, Featured Pets, Service Highlights.
- **Adopt Listing**: Filterable scroll of available pets.
- **Pet Details**: Comprehensive pet profile, medical history summary.
*   **Action Content**: "Adopt Now", "Sponsor Pet", "Add to Watchlist".

### 1.2 Health & Medical Module
- **Health Dashboard**: Vaccination status tracker, medical timeline.
- **Prescription Manager**: Upload and view vet prescriptions.
- **Pet Selector**: Quick-switch between owner's pets for specific records.

### 1.3 Rescue & Emergency Module
- **Rescue Reporting**: Image upload + Google Maps GPS Pin drop.
- **Live Tracking**: Real-time map view of the assigned rescuer's movement.
- **Status Timeline**: Pending → Assigned → In Progress → Sheltered.

### 1.4 Donation & Support Module
- **General Fund**: Monthly or one-time donations.
- **Pet Sponsorship**: Specific recurring support for high-need pets.
- **Transparency Hub**: Real-time spending breakdown (Medical/Food/Shelter).

---

## 2. Admin-Side Modules

### 2.1 Dashboard & Analytics Module
- **Main Content**: ROI Metrics, User Growth, Adoption Success Rate.
- **Sub-content**: Time-range toggles (7d/30d), Regional heatmaps.
- **Action Content**: Download CSV reports, Refresh analytics.

### 2.2 Global Data Management (CRUD Hub)
**This is the central engine for platform-wide information control.**
- **Modules Managed**: Users, Pets, Adoptions, Rescues, Donations, Community.
- **Total Modules**: 8 Dedicated Sub-modules.
- **Total Pages**: 2 Unified Management Interfaces.

#### Core Management Engine:
- **Main Content**: Dynamic Data Table with Image Thumbnails.
- **Sub-content**: Smart Search, Pagination Controls, Multi-filters.
- **Action Content**: "Add Record", "Edit Field", "Secure Delete", "View Full Image".

---

## 3. Page Structure Details (Admin Data Management)

### 3.1 Data Hub Overview
- **Main Content**: 
    - Premium Dashboard Cards with module-specific icons (Lucide).
    - Status badges for data health.
- **Sub-content**: 
    - Navigation Breadcrumbs.
    - User quick-profile access.

### 3.2 Dynamic Search & Edit
- **Main Content**: 
    - Glassmorphism Table viewing up to 50 records per page.
    - **Image Integration**: Direct thumbnail previews for Profile Pictures, Pet Photos, and Rescue Proofs.
- **Action Content**: 
    - **Add Modal**: Dynamic form that adapts to the model (e.g., adds species for Pets, role for Users).
    - **Edit Modal**: Pre-filled fields for rapid administrative updates.
    - **Delete Confirm**: Safety-first themed confirmation dialog.

---

## 4. Image Handling Documentation

The frontend utilizes a robust image processing logic for consistency:

1.  **Import Logic**: Images are fetched via direct URLs (External) or relative paths (Local Uploads).
2.  **Mapping**:
    - `User`: `profilePicture` field.
    - `Pet`: `photos[0].url` (First photo in array).
    - `Rescue`: `photoUrl` field.
    - `Donation`: `image` field.
3.  **Display Logic**: 
    - **Thumbnail Component**: Forced aspect-ratio (1:1), rounded-lg corners, border stroke.
    - **Fallback**: "https://via.placeholder.com" defaults for missing assets to prevent UI breakage.
4.  **Backend Integration**: The `adminDataController` uses Prisma's `include` to fetch image-related entities (like `PetPhoto`) during management queries.
