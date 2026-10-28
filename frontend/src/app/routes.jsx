import { Route, Routes } from "react-router-dom";

// =====================================================
// PUBLIC
// =====================================================

import LandingPage from "../features/landing/pages/LandingPage";
import HomePage from "../features/home/pages/HomePage";
import BookingPage from "../features/booking/pages/BookingPage";
import ConfirmationPage from "../features/confirmation/pages/ConfirmationPage";
import RideReadyPage from "../features/ride-ready/pages/RideReadyPage";
import TrackingPage from "../features/tracking/pages/TrackingPage";

// =====================================================
// AUTH
// =====================================================

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import OtpVerification from "../features/auth/pages/OtpVerification";


// =====================================================
// DRIVER
// =====================================================

import OnboardingProcess from "../features/driver/Onboarding/pages/OnboardingProcess.jsx";
import DriverProfilePage from "../features/driver/profile/page/DriverProfilePage";
import DriverDashboard from "../features/driver/dashboard/pages/DriverDashboard.jsx";
import VehiclePage from "../features/driver/vehicles/pages/VehiclePage.jsx";
import DriverFareSettings  from "../features/driver/fare/DriverFareSettings.jsx";
import DriverServiceableRides from "../features/driver/dashboard/pages/DriverServiceableRides.jsx";

// =====================================================
// ADMIN
// =====================================================

import AdminDashboard from "../features/AdminDashboard/pages/AdminDashboard";
import AdminLayout from "../features/AdminDashboard/components/AdminLayout";

import BusinessRequests from "../features/AdminDashboard/pages/BusinessRequests.jsx";
import BusinessRequestsDetails from "../features/AdminDashboard/pages/BusinessRequestsDetails.jsx";

import Users from "../features/AdminDashboard/pages/Users.jsx";
import UserDetails from "../features/AdminDashboard/pages/UserDetails.jsx";
import FareSettings from "../features/AdminDashboard/pages/FareSettings.jsx";
import DriverOffers from "../features/AdminDashboard/pages/DriverOffers.jsx";
import Zones from "../features/AdminDashboard/pages/Zones.jsx";
import InternalTeamFare from "../features/AdminDashboard/pages/InternalTeamFare.jsx";


// =====================================================
// GUARDS
// =====================================================

import ProtectedRoute from "./guards/ProtectedRoute.jsx";

// =====================================================
// ROUTES
// =====================================================

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================================================= */}
      {/* PUBLIC */}
      {/* ================================================= */}

      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/home"
        element={<HomePage />}
      />

      <Route
        path="/booking"
        element={<BookingPage />}
      />

      <Route
        path="/confirmation"
        element={<ConfirmationPage />}
      />

      <Route
        path="/booking/success"
        element={<RideReadyPage />}
      />

      <Route
        path="/tracking"
        element={<TrackingPage />}
      />

      {/* ================================================= */}
      {/* AUTH */}
      {/* ================================================= */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/verify-otp"
        element={<OtpVerification />}
      />

      {/* ================================================= */}
      {/* DRIVER ONBOARDING */}
      {/* ================================================= */}

      <Route
        path="/driver/onboarding"
        element={<OnboardingProcess />}
      />

      <Route
        path="/driver/vehicles"
        element={<VehiclePage />}
      />

      {/* ================================================= */}
      {/* DRIVER */}
      {/* ================================================= */}

      <Route
        element={
          <ProtectedRoute
            allowedRoles={["DRIVER"]}
          />
        }
      >

        <Route
          path="/driver/dashboard"
          element={<DriverDashboard />}
        />

        <Route
          path="/driver/fare-settings"
          element={<DriverFareSettings />}
        />


        <Route
          path="/driver/profile"
          element={<DriverProfilePage />}
        />

        <Route
          path="/driver/serviceable-rides"
          element={<DriverServiceableRides />}
        />

      </Route>
      

      {/* ================================================= */}
      {/* ADMIN */}
      {/* ================================================= */}

      <Route
  element={
    <ProtectedRoute
      allowedRoles={["ADMIN"]}
    />
  }
>
  <Route
    element={<AdminLayout />}
  >

    {/* OVERVIEW */}

    <Route
      path="/admin"
      element={
        <AdminDashboard />
      }
    />

    

    {/* BUSINESS REQUESTS */}

    <Route
      path="/admin/business-requests"
      element={
        <BusinessRequests />
      }
    />

        <Route
          path="/admin/business-requests/:id"
          element={
            <BusinessRequestsDetails />
          }
        />

        {/* USERS */}

        <Route
          path="/admin/users"
          element={
            <Users />
          }
        />

        <Route
          path="/admin/users/:id"
          element={
            <UserDetails />
          }
        />

         <Route
      path="/admin/fare-settings"
      element={
        <FareSettings />
      }
    />

    <Route
        path="/admin/driver-offers"
        element={
          <DriverOffers />
        }
      />

          <Route
          path="/admin/internal-team-fare"
          element={<InternalTeamFare />}
        />

        {/* ZONES */}

        <Route
          path="/admin/zones"
          element={
            <Zones />
          }
        />


      </Route>


    </Route>

    </Routes>
  );
}