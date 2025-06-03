import { useState, useRef, useEffect } from "react";
import { useUser } from "../services/users/useUser";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
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
      <nav className="fixed top-0 left-0 w-full z-50 shadow-lg bg-[#f5f5f5]">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Botón hamburguesa para móviles */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-3xl text-[#AD03CB]"
              aria-label="Abrir o cerrar menú"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#AD03CB]"
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
                // Ícono de hamburguesa
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#AD03CB]"
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
              className="text-xl font-bold transition duration-300 hover:scale-115 hover:text-[#AD03CB]">
              🐶 Protectora
            </Link>

            {/* Menú de escritorio */}
            <div className="hidden md:flex items-center space-x-9">
              <Link
                to="/animales"
                className="transition duration-300 text-[#AD03CB] hover:text-purple-500 font-medium hover:scale-105"
              >
                🐈 Mascotas
              </Link>
              <div className="w-px h-5 bg-[#AD03CB]/40" />
              <Link
                to="/contacto"
                className="transition duration-300 text-[#AD03CB] hover:text-purple-500 font-medium hover:scale-105"
              >
                📋 Contacto
              </Link>
              <div className="w-px h-5 bg-[#AD03CB]/40" />
              <Link
                to="/donate"
                className="transition duration-300 text-[#AD03CB] hover:text-purple-500 font-medium hover:scale-105"
              >
                🐾 Donar
              </Link>
            </div>

            {/* Panel Admin + Perfil */}
            <div className="flex items-center">
              {user && user.role === "ADMIN" && (
                <Link
                  to="/adminU"
                  className="hidden md:inline-block px-3 py-1 rounded transition duration-300 hover:scale-107 hover:-rotate-2 mr-4"
                  style={{
                    color: "#f5f5f5",
                    backgroundColor: "#AD03CB",
                  }}
                >
                  🛠️ Panel Admin
                </Link>
              )}
              {user ? (
                <div
                  className="hidden md:flex items-center space-x-3 relative"
                  ref={profileMenuRef}
                >
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
                          className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition duration-300 hover:scale-110 border-[#AD03CB]"
                        />
                      ) : (
                        <div
                          className="w-10 h-10 rounded-full text-l flex items-center justify-center mb-4 object-cover cursor-pointer border-2 transition duration-300 hover:scale-115"
                          style={{
                            backgroundColor: base,
                            color: complementary,
                            borderColor: complementary,
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
                          to="#"
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
              ) : (
                <div className="hidden md:flex space-x-2">
                  <Link to="/login">
                    <button className="text-sm font-bold transition duration-300 hover:scale-105 text-[#AD03CB]">
                      Iniciar sesión
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="text-sm font-bold transition duration-300 hover:scale-105 text-[#AD03CB]">
                      Registrarse
                    </button>
                  </Link>
                </div>
              )}
            </div>
            {/* Icono de usuario en versión móvil */}
            {user && (
              <Link
                to="/profile"
                className="md:hidden ml-4 w-10 h-10 rounded-full overflow-hidden border-2 border-[#AD03CB] flex-shrink-0"
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
                      color: complementary,
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
            className="md:hidden fixed top-0 left-0 w-full h-screen px-6 pt-24 pb-16 space-y-4 bg-[#f5f5f5]/90 z-40 text-left text-2xl backdrop-blur-md"
          >
            <Link
              to="/animales"
              className="block text-[#AD03CB] font-bold hover:text-purple-500"
            >
              🐈 Mascotas
            </Link>
            <Link
              to="/contacto"
              className="block text-[#AD03CB] font-bold hover:text-purple-500"
            >
              📋 Contacto
            </Link>
            <Link
              to="/donate"
              className="block text-[#AD03CB] font-bold hover:text-purple-500"
            >
              🐾 Donar
            </Link>
            {user && user.role === "ADMIN" && (
              <Link
                to="/adminU"
                className="block text-[#AD03CB] font-bold hover:text-purple-500"
              >
                🛠️ Panel Admin
              </Link>
            )}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="block text-[#AD03CB] font-bold hover:text-purple-500"
                >
                  👤 Mi perfil
                </Link>
                <Link
                  to="#"
                  className="block text-[#AD03CB] font-bold hover:text-purple-500"
                >
                  ⚙️ Configuración
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-[#AD03CB] font-bold hover:text-purple-500"
                >
                  🚪 Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-[#AD03CB] font-medium hover:text-purple-500"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="block text-[#AD03CB] font-medium hover:text-purple-500"
                >
                  Registrarse
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
