// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
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
import ProtectedRoute from "./components/ProtectedRoute";
import Inbox from "./pages/Inbox";
import SplashScreen from "./components/SplashScreen";
import ChatBot from "./components/ChatBot";
import BloodRequests from "./pages/BloodRequests";

function App() {
  const [splash, setSplash] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 900, once: true, easing: "ease-in-out" });
  }, []);

  if (splash) return <SplashScreen onDone={() => setSplash(false)} />;

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
  <Route path="/requests" element={<BloodRequests />} />

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
      <ChatBot />
    </BrowserRouter>
  );
}

export default App;
