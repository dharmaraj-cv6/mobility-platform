import { Routes, Route } from "react-router-dom";


import Home2 from "../pages/Home/Home2";
import HomeZoneLp from "../pages/ZoneLp/HomeZoneLp";



import NotFound from "../pages/Errors/NotFound";
import BookingPage from "../pages/Booking/BookingPage";
import BookingDetails from "../pages/DetailView/BookingDetails";
import BookingConfirmationDetails from "../pages/BookingConfirmation/BookingConfirmationDetails";
import DriverOnBoarding from "../pages/Register/DriverOnboarding"
import DriverLogin from "../pages/Login/DriverLogin"
import PassengerLogin from "../pages/Login/Passengerlogin"
import DriverDashboard from "../pages/dashboard/DriverDashboard";
import SuperAdmin from "../pages/dashboard/SuperAdmin"
import SuperAdminLogin from "../pages/Login/SuperAdminLogin"

export default function AppRoutes() {
  return (
    <Routes>

      {/* Routes with Main Layout */}     
      <Route path="/" element={<HomeZoneLp />} />
      <Route path="/home2" element={<Home2 />} /> 
      <Route path="/booking" element={<BookingPage />} />           
      <Route path="/bookingconfirmation" element={<BookingDetails />} />
      <Route path="/bookingconfirmationdetails" element={<BookingConfirmationDetails />} />

    

     


      {/* Routes without Main Layout */}      
     
      <Route path="/DriverOnboarding" element={<DriverOnBoarding />} />

      
      <Route path="/login" element={<DriverLogin />} />
      <Route path="/userlogin" element={<PassengerLogin />} />
      <Route path="/superadminlogin" element={<SuperAdminLogin />} />

      <Route path="/drivardashboard" element={<DriverDashboard />} />
      <Route path="/superadmindashboard" element={<SuperAdmin />} />

        
      

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}