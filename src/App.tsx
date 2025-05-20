import { Routes, Route, Navigate, Outlet } from "react-router-dom"; // Añade Outlet aquí
import Home from "./pages/MainPage/Home";
import AdminDashboard from "./pages/MainPage/AdminDashboard";
import { UserContext } from "./services/users/UserContext";
import { useContext, type JSX } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Login from "./components/Login";
import Register from "./components/Register";
import AnimalsPage from "./components/AnimalsPage";
import NotFound from "./components/NotFound";

const ProtectedRoute = ({
  children,
  role,
}: {
  children: JSX.Element;
  role: string;
}) => {
  const { user } = useContext(UserContext)!;

  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;

  return children;
};

// Componente de layout con Navbar
const WithNavbar = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet /> {/* Esto renderizará las rutas hijas */}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* Rutas sin Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas con Navbar */}
      <Route element={<WithNavbar />}>
        <Route path="/" element={<Home />} />
        <Route path="/main" element={<Main />} />
        <Route path="/AnimalsPage" element={<AnimalsPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Ruta 404 - debe ir al final */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
