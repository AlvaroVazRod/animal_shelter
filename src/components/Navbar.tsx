import { useState, useRef, useEffect } from "react";
import { useUser } from "../services/users/useUser";

export const Navbar = () => {
  const { user, logout } = useUser();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 shadow-lg"
      style={{ backgroundColor: "#A65638" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between h-16 whitespace-nowrap">
          <a
            href="/"
            className="text-xl font-bold px-3 py-1 rounded-lg shadow-md transition duration-300 hover:scale-115"
            style={{ color: "#F2DCB3", backgroundColor: "#D97236" }}
          >
            🐶 Protectora
          </a>

          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/animales"
              className="px-3 py-1 rounded transition duration-300 hover:scale-107 hover:-rotate-2"
              style={{ color: "#F2DCB3", backgroundColor: "#D97236" }}
            >
              Mascotas
            </a>
            <a
              href="/contacto"
              className="px-3 py-1 rounded transition duration-300 hover:scale-107 hover:-rotate-2"
              style={{ color: "#F2DCB3", backgroundColor: "#D97236" }}
            >
              Contacto
            </a>
            <button
              className="px-3 py-1 rounded transition duration-300 hover:scale-107 hover:rotate-2"
              style={{ color: "#F2DCB3", backgroundColor: "#e37739" }}
            >
              🐾 Donar
            </button>
          </div>

          <div className="flex items-center">
            {user ? (
              <div
                className="flex items-center space-x-3 relative"
                ref={profileMenuRef}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: "#F2DCB3" }}
                >
                  {user.username}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="focus:outline-none"
                    aria-label="Menú de perfil"
                    aria-expanded={isProfileMenuOpen}
                  >
                    <img
                      src={`http://localhost:8080/images/user/${user.image}`}
                      alt="Foto de perfil"
                      className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition duration-300 hover:scale-115"
                      style={{ borderColor: "#F2DCB3" }}
                    />
                  </button>

                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1"
                      style={{
                        backgroundColor: "#F2DCB3",
                        border: "1px solid #D97236",
                      }}
                    >
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm transition-colors duration-200"
                        style={{ color: "#40170E" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#D9AB73")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        👤 Mi perfil
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm transition-colors duration-200"
                        style={{ color: "#40170E" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#D9AB73")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        ⚙️ Configuración
                      </a>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm transition-colors duration-200"
                        style={{ color: "#40170E" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#D9AB73")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        🚪 Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <a href="/login">
                  <button
                    className="group relative px-4 py-1 rounded-full text-sm font-bold shadow-md transition duration-300 hover:scale-105 overflow-hidden mr-2"
                    style={{ color: "#40170E", backgroundColor: "#F2DCB3" }}
                  >
                    <span className="relative z-10">Iniciar sesión</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F2DCB3] via-[#F8E8C9] to-[#FFF4E0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </a>
                <a href="/register">
                  <button
                    className="group relative px-4 py-1 rounded-full text-sm font-bold shadow-md transition duration-300 hover:scale-105 overflow-hidden"
                    style={{ color: "#40170E", backgroundColor: "#F2DCB3" }}
                  >
                    <span className="relative z-10">Registrarse</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F2DCB3] via-[#F8E8C9] to-[#FFF4E0] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
