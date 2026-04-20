# Pet-Care Platform: Comprehensive Page Structure Manifest

This document provides a exhaustive audit of every page in the Pet-Care platform, detailing the Main Content, Sub-content, and Action Content according to the Mohul documentation standard.

---

## 🔐 Module 1: Identity & Authentication

### 1.1 Sign Up Page (`/register`)
- **Main Content**: User registration form (Full Name, Email, Password, Role Selector).
- **Sub-content**: "Already have an account?" link, social login orientation.
- **Action Content**: Register button, Google Login button.

### 1.2 Sign In Page (`/login`)
- **Main Content**: Authentication form (Email, Password).
- **Sub-content**: "Forgot Password?" link, "New user? Sign up" toggle.
- **Action Content**: Login button, Google Auth button.

### 1.3 Forgot Password Page (`/forgot-password`)
- **Main Content**: Email submission form for recovery.
- **Action Content**: "Send Reset Link" button.

---

## 🏠 Module 2: Discovery & Public Browsing

### 2.1 Home Page (`/`)
- **Main Content**: Hero Banner (Brand Message), Statistics Cards (Lives Saved, Volunteers Active), Recent Rescue Alerts (Live Widget).
- **Sub-content**: Global Navbar, Interactive Footer, "How it works" section.
- **Action Content**: "Get Involved" CTA, "Report Emergency" quick-trigger.

### 2.2 Adoption Landing (`/adopt`)
- **Main Content**: Adoption mission statement, Featured Pets Carousel.
- **Sub-content**: Resource links (Adoption process FAQ).
- **Action Content**: "Browse All Pets" button.

### 2.3 Adoption Listing Page (`/adopt/listing`)
- **Main Content**: Multi-grid display of pets available for adoption with status badges and thumbnails.
- **Sub-content**: Advanced filters (Species, Gender, Size, Age).
- **Action Content**: Search bar, "View Details" on each pet card.

### 2.4 Adoption Details Page (`/adopt/listing/:id`)
- **Main Content**: High-resolution Pet Gallery, Detailed Bio (Story, Personality, Medical Clearance).
- **Sub-content**: Owner information summary, Safety disclaimer.
- **Action Content**: "Adopt Now" button (triggers flow), "Share Profile".

---

## 🐕 Module 3: Personal Pet Portfolio (Owner)

### 3.1 My Pets List Page (`/pets`)
- **Main Content**: Grid of owned pets with health summary snippets.
- **Sub-content**: "Total Pets" counter, Add Pet shortcut.
- **Action Content**: "Add New Pet" button, "Manage" button for each pet.

### 3.2 Add Pet Page (`/pets/add`)
- **Main Content**: Multi-field form (Name, Species, Breed, Age, Weight, Description).
- **Sub-content**: Image uploader for primary profile picture.
- **Action Content**: "Save Pet" button, "Mark for Adoption" toggle.

### 3.3 Pet Details Hub (`/pets/:id`)
- **Main Content**: Central dashboard for a specific pet. Includes quick-view health score and recent logs.
- **Sub-content**: Sidebar navigation for (Weight, Schedule, Gallery, Medical).
- **Action Content**: "Edit Profile", "Remove Pet".

### 3.4 Care Schedule Page (`/pets/schedule`)
- **Main Content**: List of upcoming care tasks (Feeding, Grooming, Walking).
- **Sub-content**: Task frequency filter.
- **Action Content**: "Add New Schedule", "Mark as Done".

### 3.5 Weight Tracking Page (`/pets/weight`)
- **Main Content**: Interactive Line Chart showing weight trends over time.
- **Sub-content**: Tabular log of historical weight entries.
- **Action Content**: "Log New Weight" button.

---

## 🏥 Module 4: Health & Medical

### 4.1 Health Dashboard (`/health`)
- **Main Content**: Selection of pet to view medical records.
- **Sub-content**: Global vaccination summary.
- **Action Content**: Select Pet Card to enter specific records.

### 4.2 Vaccination Records (`/vaccines`)
- **Main Content**: Detailed timeline of shots given (Date, Type, Next Due Date).
- **Action Content**: "Upload Certificate", "Add Record".

### 4.3 Medical History Page (`/medical`)
- **Main Content**: List of past illnesses, surgeries, or vet visits.
- **Action Content**: "Add Medical Entry".

### 4.4 Prescription Archive (`/prescriptions`)
- **Main Content**: Document viewer for uploaded vet prescriptions.
- **Action Content**: "Upload New RX", "Download PDF".

---

## 🚨 Module 5: Rescue & Emergency

### 5.1 Report Emergency Page (`/rescue`)
- **Main Content**: **Interactive Google Map** for GPS location picking, Condition Form (Problem type, Priority, Photos).
- **Sub-content**: Safety instructions for the reporter.
- **Action Content**: "Pin Current Location", "Submit Rescue Request".

### 5.2 My Rescue Requests (`/rescue/my-requests`)
- **Main Content**: List of all rescues reported by the user with real-time status (Assigned, In Progress).
- **Action Content**: "Track Rescuer" button.

### 5.3 Rescue Tracking Hub (`/rescue/tracking/:id`)
- **Main Content**: **Live Map** showing the rescuer's real-time position vs the incident location.
- **Sub-content**: Assigned volunteer profile and contact info, Estimated Time of Arrival (ETA).
- **Action Content**: "Call Volunteer", "Cancel Report".

---

## 💎 Module 6: Donations & Charity

### 6.1 Donation Page (`/donate`)
- **Main Content**: Active campaign grid (Medical funds, Food drives), General donation portal.
- **Sub-content**: "Where your money goes" transparency chart.
- **Action Content**: "Donate Now", "Start Sponsorship".

### 6.2 Campaign Details (`/donations/campaign/:id`)
- **Main Content**: Target goal vs Current progress bar, Campaign story and impact photos.
- **Action Content**: "Support this Case".

---

## 🛠️ Module 7: Admin Control Center

### 7.1 Admin Dashboard (`/admin`)
- **Main Content**: Platform-wide metrics (Charts for Rescue success, User growth, Financial trends).
- **Sub-content**: Quick Action panels, System health alerts.

### 7.2 Admin Data Hub (`/admin/data`)
- **Main Content**: Unified Menu for all system models (Users, Pets, Adoptions, Rescues, etc.).
- **Sub-content**: Total record counts for each category.
- **Action Content**: Select Module to Manage.

### 7.3 Global Data Manager (`/admin/data/:model`)
- **Main Content**: Dynamic table displaying all records with Image Previews.
- **Sub-content**: Multi-column sorting, Pagination (1-50), Advanced Search.
- **Action Content**: "Add New", "Edit Record", "Delete", "Export Data".
