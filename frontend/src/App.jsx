// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import SearchDonor from "./pages/SearchDonor";
import Chat from "./pages/Chat";
import Donate from "./pages/Donate";
import AboutUs from "./pages/AboutUs";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute"; // NEW
import Inbox from "./pages/Inbox"; // NEW

function App() {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
  {/* PUBLIC ROUTES */}
  <Route path="/" element={<Home />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/aboutus" element={<AboutUs />} />
  <Route path="/donate" element={<Donate />} />
  <Route path="/search" element={<SearchDonor />} />

  {/* PROTECTED CHAT ONLY */}
  <Route
    path="/chat/:id"
    element={
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    }
  />
  <Route
  path="/messages"
  element={
    <ProtectedRoute>
      <Inbox />
    </ProtectedRoute>
  }
/>
</Routes>




      <Footer />
    </BrowserRouter>
  );
}

export default App;
