//src/router/router.js
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Adopt from "../pages/Adopt";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import ForgotPassword from "../pages/ForgotPassword";
import UserProfile from "../pages/UserProfile";
import PetList from "../pages/PetList";
import AddPet from "../pages/AddPet";
import EditPet from "../pages/EditPet";
import PetDetails from "../pages/PetDetails";
import CareScheduleList from "../pages/CareScheduleList";
import WeightLog from "../pages/WeightLog";
import VaccinationRecords from "../pages/VaccinationRecords";
import MedicalHistory from "../pages/MedicalHistory";
import Prescriptions from "../pages/Prescriptions";
import PetGallery from "../pages/PetGallery";
import CareCalendar from "../pages/CareCalendar";
import HealthAndMedical from "../pages/HealthAndMedical";
import AdoptionListing from "../pages/AdoptionListing";
import AdoptionDetails from "../pages/AdoptionDetails";
import AdoptionFlow from "../pages/AdoptionFlow";
import MyAdoptionSubmissions from "../pages/MyAdoptionSubmissions";
import MyAdoptionRequests from "../pages/MyAdoptionRequests";
import Services from "../pages/Services";
import ServiceDetails from "../pages/ServiceDetails";
import MyBookings from "../pages/MyBookings";
import BookingDetails from "../pages/BookingDetails";
import Community from "../pages/Community";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminUserManagementPage from "../pages/admin/AdminUserManagementPage";
import AdminAdoptionManagementPage from "../pages/admin/AdminAdoptionManagementPage";
import AdminAdoptionDetailPage from "../pages/admin/AdminAdoptionDetailPage";
import AdminAddAdoptionListingPage from "../pages/admin/AdminAddAdoptionListingPage";
import AdminAdoptionRequestsPage from "../pages/admin/AdminAdoptionRequestsPage";
import AdminDataHub from "../pages/admin/data/AdminDataHub";
import ManageModelPage from "../pages/admin/data/ManageModelPage";

// Rescue User Pages
import RescueRequestPage from '../pages/rescue/RescueRequestPage';
import MyRescueRequestsPage from '../pages/rescue/MyRescueRequestsPage';
import RescueTrackingPage from '../pages/rescue/RescueTrackingPage';

// Rescue Volunteer Pages
import NearbyRescueRequestsPage from '../pages/rescue/NearbyRescueRequestsPage';
import AssignedRescueDetailsPage from '../pages/rescue/AssignedRescueDetailsPage';
import VolunteerRescueHistoryPage from '../pages/rescue/VolunteerRescueHistoryPage';
import RescueListingPage from '../pages/rescue/RescueListingPage';

// Rescue Admin Pages
import AdminRescueListPage from '../pages/rescue/AdminRescueListPage';
import AdminRescueDetailsPage from '../pages/rescue/AdminRescueDetailsPage';
import AdminRescueMapPage from '../pages/rescue/AdminRescueMapPage';
import AdminRescueAnalyticsPage from '../pages/rescue/AdminRescueAnalyticsPage';
import AdminDuplicateRescuePage from '../pages/rescue/AdminDuplicateRescuePage';
import AdminRescueNotificationsPage from '../pages/rescue/AdminRescueNotificationsPage';

// Donation User Pages
import DonatePage from '../pages/donations/DonatePage';
import DonationCampaignDetailsPage from '../pages/donations/DonationCampaignDetailsPage';
import MyDonationsPage from '../pages/donations/MyDonationsPage';
import SponsorPetDonatePage from '../pages/donations/SponsorPetDonatePage';

// Donation Admin Pages
import AdminDonationsPage from '../pages/admin/AdminDonationsPage';
import AdminDonationReportsPage from '../pages/admin/AdminDonationReportsPage';
import AdminPlatformReportsPage from '../pages/admin/AdminPlatformReportsPage';
import AdminPlatformAlertsPage from '../pages/admin/AdminPlatformAlertsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminUserProfilePage from "../pages/admin/AdminUserProfilePage";
import AdminEditUserPage from "../pages/admin/AdminEditUserPage";
import AdminPetsPage from "../pages/admin/AdminPetsPage";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", index: true, element: <Home /> },
      { path: "/adopt", element: <Adopt /> },
      { path: "/adopt/listing", element: <AdoptionListing /> },
      { path: "/adopt/listing/:id", element: <AdoptionDetails /> },
      { path: "/adopt/flow/:id", element: <AdoptionFlow /> },
      { path: "/services", element: <Services /> },
      { path: "/services/my-bookings", element: <MyBookings /> },
      { path: "/services/bookings/:id", element: <BookingDetails /> },
      { path: "/services/:id", element: <ServiceDetails /> },
      { path: "/community", element: <Community /> },
      { path: "/health", element: <HealthAndMedical /> },
      { path: "/register", element: <Signup /> },
      { path: "/login", element: <Signin /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      
      // User Profile & Pet Management Routes
      { path: "/profile", element: <UserProfile /> },
      { path: "/pets", element: <PetList /> },
      { path: "/pets/adoption-submissions", element: <MyAdoptionSubmissions /> },
      { path: "/adopt/my-requests", element: <MyAdoptionRequests /> },
      { path: "/pets/add", element: <AddPet /> },
      { path: "/pets/:id", element: <PetDetails /> },
      { path: "/pets/:id/edit", element: <EditPet /> },
      { path: "/pets/schedule", element: <CareScheduleList /> },
      { path: "/pets/weight", element: <WeightLog /> },
      { path: "/vaccines", element: <VaccinationRecords /> },
      { path: "/medical", element: <MedicalHistory /> },
      { path: "/prescriptions", element: <Prescriptions /> },
      { path: "/pets/gallery", element: <PetGallery /> },
      { path: "/pets/calendar", element: <CareCalendar /> },

      // Rescue User Routes
      { path: "/rescue", element: <RescueRequestPage /> },
      { path: "/rescue/my-requests", element: <MyRescueRequestsPage /> },
      { path: "/rescue/tracking/:id", element: <RescueTrackingPage /> },

      // Rescue Volunteer Routes
      { path: "/rescue/nearby", element: <NearbyRescueRequestsPage /> },
      { path: "/rescue/assigned/:id", element: <AssignedRescueDetailsPage /> },
      { path: "/rescue/history", element: <VolunteerRescueHistoryPage /> },
      { path: "/rescue/listing", element: <RescueListingPage /> },

      // Donation Routes
      { path: "/donate", element: <DonatePage /> },
      { path: "/donations", element: <MyDonationsPage /> },
      { path: "/donations/sponsor/:id", element: <SponsorPetDonatePage /> },
      { path: "/donations/campaign/:id", element: <DonationCampaignDetailsPage /> },

      // Admin inside App (so Nav/Footer/bg stays)
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "users", element: <AdminUserManagementPage /> },
          { path: "users/view/:id", element: <AdminUserProfilePage /> },
          { path: "users/edit/:id", element: <AdminEditUserPage /> },
          { path: "pets", element: <AdminPetsPage /> },
          // Rescue Admin Routes
          { path: "rescues", element: <AdminRescueListPage /> },
          { path: "rescues/map", element: <AdminRescueMapPage /> },
          { path: "rescues/analytics", element: <AdminRescueAnalyticsPage /> },
          { path: "rescues/duplicates", element: <AdminDuplicateRescuePage /> },
          { path: "rescues/notifications", element: <AdminRescueNotificationsPage /> },
          { path: "rescues/:id", element: <AdminRescueDetailsPage /> },
          // Donation Admin Routes
          { path: "donations", element: <AdminDonationsPage /> },
          { path: "donations/reports", element: <AdminDonationReportsPage /> },
          { path: "reports", element: <AdminPlatformReportsPage /> },
          { path: "alerts", element: <AdminPlatformAlertsPage /> },
          { path: "settings", element: <AdminSettingsPage /> },
          // Adoption Admin Routes (specific paths before :id)
          { path: "adoptions/add", element: <AdminAddAdoptionListingPage /> },
          { path: "adoptions/requests", element: <AdminAdoptionRequestsPage /> },
          { path: "adoptions", element: <AdminAdoptionManagementPage /> },
          { path: "adoptions/:id", element: <AdminAdoptionDetailPage /> },
          // Data Management Suite
          { path: "data", element: <AdminDataHub /> },
          { path: "data/:model", element: <ManageModelPage /> },
        ],
      },
    ],
  },
]);