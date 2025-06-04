import { useState, useRef, useEffect } from "react";
import { useUser } from "../services/users/useUser";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const AdminNavbar = () => {
  const { user, logout } = useUser();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const getComplementaryColorsFromUsername = (username: string) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const baseHue = Math.abs(hash % 360);
    return {
      base: `hsl(${baseHue}, 70%, 50%)`,
      complementary: `hsl(${(baseHue + 180) % 360}, 70%, 50%)`,
    };
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { base, complementary } = getComplementaryColorsFromUsername(
    user?.username || ""
  );

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 shadow-lg" style={{ backgroundColor: "#2D2A32" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Botón hamburguesa para móviles */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-3xl"
              style={{ color: "#AD03CB" }}
              aria-label="Abrir o cerrar menú"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="text-white text-xl font-bold transition duration-300 hover:scale-115 hover:text-[#ad03cb] min-w-36"
            >
              🐶 Protectora
            </Link>

            {/* Menú de escritorio - Paneles de Admin */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/adminW"
                className="text-center transition duration-300 text-[#c27aff] hover:text-[#AD03CB] font-medium hover:scale-105"
              >
                Panel Transacciones
              </Link>
              <div className="w-px h-5 bg-purple-500" />

              <Link
                to="/adminU"
                className="text-center transition duration-300 text-[#c27aff] hover:text-[#AD03CB] font-medium hover:scale-105"
              >
                Panel Usuarios
              </Link>
              <div className="w-px h-5 bg-purple-500" />

              <Link
                to="/adminP"
                className="text-center transition duration-300 text-[#c27aff] hover:text-[#AD03CB] font-medium hover:scale-105"
              >
                Panel Mascotas
              </Link>
              <div className="w-px h-5 bg-purple-500" />

              <Link
                to="/adminT"
                className="text-center transition duration-300 text-[#c27aff] hover:text-[#AD03CB] font-medium hover:scale-105"
              >
                Panel Etiquetas
              </Link>
            </div>

            {/* Perfil de usuario */}
            {user && (
              <div
                className="hidden md:flex items-center space-x-3 relative"
                ref={profileMenuRef}
              >
                {/* <span className="text-sm font-medium" style={{ color: "#F5F5F5" }}>
                  {user.username}
                </span> */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="focus:outline-none"
                    aria-label="Menú de perfil"
                    aria-expanded={isProfileMenuOpen}
                  >
                    {user?.image ? (
                      <img
                        src={`http://localhost:8080/images/user/${user.image}`}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition duration-300 hover:scale-110"
                        style={{ borderColor: "#c27aff" }}
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full text-l flex items-center justify-center mb-4 object-cover cursor-pointer border-2 transition duration-300 hover:scale-115"
                        style={{
                          backgroundColor: base,
                          color: "#ad03cb",
                          borderColor: "#c27aff",
                          margin: "auto",
                        }}
                      >
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>
                  {isProfileMenuOpen && (
                    <div
                    className="absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1"
                    style={{
                      backgroundColor: "#FFE2FE",
                      border: "1px solid rgb(208, 0, 187)",
                    }}
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-[#40170E] hover:bg-[#FFBDFD]"
                    >
                      👤 Mi perfil
                    </Link>
                    <Link
                      to="/edit"
                      className="block px-4 py-2 text-sm text-[#40170E] hover:bg-[#FFBDFD]"
                    >
                      ⚙️ Configuración
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-[#40170E] hover:bg-[#FFBDFD]"
                    >
                      🚪 Cerrar sesión
                    </button>
                  </div>
                  )}
                </div>
              </div>
            )}

            {/* Icono de usuario en versión móvil */}
            {user && (
              <Link
                to="/profile"
                className="md:hidden ml-4 w-10 h-10 rounded-full overflow-hidden border-2 flex-shrink-0"
                style={{ borderColor: "#c27aff" }}
                aria-label="Perfil"
              >
                {user.image ? (
                  <img
                    src={`http://localhost:8080/images/user/${user.image}`}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: base,
                      color: "#AD03CB",
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Menú móvil desplegable a pantalla completa */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden fixed top-0 left-0 w-full h-screen px-6 pt-24 pb-16 space-y-4 z-40 text-left text-2xl"
            style={{ backgroundColor: "#2D2A32" }}
          >
            <Link
              to="/adminW"
              className="block font-bold"
              style={{ color: "#c27aff" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Panel Transacciones
            </Link>
            <div className="border-t" style={{ borderColor: "#c27aff" }}></div>
            
            <Link
              to="/adminU"
              className="block font-bold"
              style={{ color: "#c27aff" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Panel Usuarios
            </Link>
            <div className="border-t" style={{ borderColor: "#c27aff" }}></div>
            
            <Link
              to="/adminP"
              className="block font-bold"
              style={{ color: "#c27aff" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Panel Mascotas
            </Link>
            <div className="border-t" style={{ borderColor: "#c27aff" }}></div>
            
            <Link
              to="/adminT"
              className="block font-bold"
              style={{ color: "#c27aff" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Panel Etiquetas
            </Link>
            <div className="border-t" style={{ borderColor: "#c27aff" }}></div>
            
            <Link
              to="/profile"
              className="block font-bold"
              style={{ color: "#c27aff" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              👤 Mi perfil
            </Link>
            <div className="border-t" style={{ borderColor: "#c27aff" }}></div>
            
            <button
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className="block font-bold"
              style={{ color: "#c27aff" }}
            >
              🚪 Cerrar sesión
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminNavbar;