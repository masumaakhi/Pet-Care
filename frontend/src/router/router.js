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
import PetDetails from "../pages/PetDetails";
import CareScheduleList from "../pages/CareScheduleList";
import WeightLog from "../pages/WeightLog";
import VaccinationRecords from "../pages/VaccinationRecords";
import MedicalHistory from "../pages/MedicalHistory";
import Prescriptions from "../pages/Prescriptions";
import PetGallery from "../pages/PetGallery";
import CareCalendar from "../pages/CareCalendar";
import HealthAndMedical from "../pages/HealthAndMedical";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminLayout from "../pages/admin/AdminLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", index: true, element: <Home /> },
      { path: "/adopt", element: <Adopt /> },
      { path: "/health", element: <HealthAndMedical /> },
      { path: "/register", element: <Signup /> },
      { path: "/login", element: <Signin /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
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

      // ✅ Admin inside App (so Nav/Footer/bg stays)
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [{ index: true, element: <AdminDashboard /> }],
      },
    ],
  },
]);