//src/router/router.js
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import App from "../App";
import Home from "../pages/Home";
import Adopt from "../pages/Adopt";
import Signup from "../pages/Signup";
import Signin from "../pages/Signin";
import ForgotPassword from "../pages/ForgotPassword";
import UserProfile from "../pages/UserProfile";
import PetList from "../pages/PetList";
import AddPet from "../pages/AddPet";
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
import Services from "../pages/Services";
import ServiceDetails from "../pages/ServiceDetails";
import MyBookings from "../pages/MyBookings";
import BookingDetails from "../pages/BookingDetails";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminUserManagementPage from "../pages/admin/AdminUserManagementPage";

// Rescue User Pages
import RescueRequestPage from '../pages/rescue/RescueRequestPage';
import MyRescueRequestsPage from '../pages/rescue/MyRescueRequestsPage';
import RescueTrackingPage from '../pages/rescue/RescueTrackingPage';

// Rescue Volunteer Pages
import NearbyRescueRequestsPage from '../pages/rescue/NearbyRescueRequestsPage';
import AssignedRescueDetailsPage from '../pages/rescue/AssignedRescueDetailsPage';
import VolunteerRescueHistoryPage from '../pages/rescue/VolunteerRescueHistoryPage';

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

// Donation Admin Pages
import AdminDonationsPage from '../pages/admin/AdminDonationsPage';
import AdminDonationReportsPage from '../pages/admin/AdminDonationReportsPage';
import AdminUserProfilePage from "../pages/admin/AdminUserProfilePage";
import AdminEditUserPage from "../pages/admin/AdminEditUserPage";


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
      { path: "/health", element: <HealthAndMedical /> },
      { path: "/register", element: <Signup /> },
      { path: "/login", element: <Signin /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/rescue", element: <RescueRequestPage /> },
      { path: "/donate", element: <DonatePage /> },
      // Secure User Routes
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/profile", element: <UserProfile /> },
          { path: "/pets", element: <PetList /> },
          { path: "/pets/add", element: <AddPet /> },
          { path: "/pets/:id", element: <PetDetails /> },
          { path: "/pets/schedule", element: <CareScheduleList /> },
          { path: "/pets/weight", element: <WeightLog /> },
          { path: "/vaccines", element: <VaccinationRecords /> },
          { path: "/medical", element: <MedicalHistory /> },
          { path: "/prescriptions", element: <Prescriptions /> },
          { path: "/pets/gallery", element: <PetGallery /> },
          { path: "/pets/calendar", element: <CareCalendar /> },

          // Rescue User Routes
          { path: "/rescue/my-requests", element: <MyRescueRequestsPage /> },

          // Donation Routes
          { path: "/donations", element: <MyDonationsPage /> },
        ]
      },

      // Rescue Volunteer Routes
      {
        element: <ProtectedRoute allowedRoles={["volunteer", "vet", "owner"]} />,
        children: [
          { path: "/rescue/nearby", element: <NearbyRescueRequestsPage /> },
          { path: "/rescue/assigned/:id", element: <AssignedRescueDetailsPage /> },
          { path: "/rescue/history", element: <VolunteerRescueHistoryPage /> },
        ]
      },

      // Admin inside App (so Nav/Footer/bg stays)
      {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={["owner"]} />, // Assuming owner is admin based on role list
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },
              { path: "users", element: <AdminUserManagementPage /> },
              { path: "users/view/:id", element: <AdminUserProfilePage /> },
              { path: "users/edit/:id", element: <AdminEditUserPage /> },
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
            ],
          }
        ]
      },
    ],
  },
]);