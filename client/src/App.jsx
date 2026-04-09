import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import EventAttendees from "./pages/EventAttendees.jsx";

function App() {
  return (

    <Router>
      <Navbar />
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id/attendees"
          element={
            <ProtectedRoute role="organizer">
              <EventAttendees />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>

  );
}

export default App;
