import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/MainPage/Home";
import AdminDashboard from "./pages/MainPage/AdminDashboard";
import { UserContext } from "./services/users/UserContext";
import { useContext, type JSX } from "react";

const ProtectedRoute = ({ children, role }: { children: JSX.Element; role: string }) => {
  const { user } = useContext(UserContext)!;

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
