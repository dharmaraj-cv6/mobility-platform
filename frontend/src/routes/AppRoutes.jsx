import { Routes, Route } from "react-router-dom";


import Home from "../pages/Home/Homepage";
import HomeZoneLp from "../pages/ZoneLp/HomeZoneLp";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import NotFound from "../pages/Errors/NotFound";
import BookingPage from "../pages/Booking/BookingPage";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Routes with Main Layout */}     
      <Route path="/" element={<HomeZoneLp />} />
      <Route path="/home" element={<Home />} /> 
      <Route path="/instantride" element={<BookingPage />} />          

     


      {/* Routes without Main Layout */}      
      <Route path="../pages/Login/Login.jsx" element={<Login />} />
      <Route path="../pages/Register/Register.jsx" element={<Register />} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}