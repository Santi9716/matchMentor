import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import SearchMentor from "./pages/SearchMentor.jsx";
import MentorProfile from "./pages/MentorProfile.jsx";
import MentorDashboard from "./pages/MentorDashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import SessionsStudent from "./pages/SessionsStudent.jsx";
import Match from "./pages/Match.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx"; 
import Mentoring from "./pages/Mentoring.jsx";
import MentorAgenda from "./pages/MentorAgenda.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

const isAuthenticated = () => !!localStorage.getItem("authToken");
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
            <Route path="/mentor/dashboard" element={<ProtectedRoute><MentorDashboard /></ProtectedRoute>} />
            <Route path="/mentor/profile" element={<ProtectedRoute><MentorProfile /></ProtectedRoute>} />
            <Route path="/buscar-mentor" element={<ProtectedRoute><SearchMentor /></ProtectedRoute>} />
            <Route path="/mis-sesionesE" element={<ProtectedRoute><SessionsStudent /></ProtectedRoute>} />
            <Route path="/mentoring" element={<ProtectedRoute><Mentoring /></ProtectedRoute>} />
            <Route path="/agenda" element={<ProtectedRoute><MentorAgenda /></ProtectedRoute>} />
            <Route path="/match" element={<ProtectedRoute><Match /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </>
  );
}

export default App;

