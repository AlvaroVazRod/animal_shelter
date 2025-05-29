import { useState, useRef, useEffect } from "react";
import { useUser } from "../services/users/useUser";

export const Navbar = () => {
  const { user, logout } = useUser();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  //Obetener color y color complementario para el user en base a su nombre
  const getComplementaryColorsFromUsername = (username: string) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const baseHue = Math.abs(hash % 360);

    return {
      base: `hsl(${baseHue}, 70%, 50%)`,
      complementary: `hsl(${(baseHue + 180) % 360}, 70%, 50%)`, // color complementario
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
    <nav
      className="fixed top-0 left-0 w-full z-50 shadow-lg bg-[#f5f5f5]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between h-16 whitespace-nowrap">
          <a
            href="/"
            className="text-xl font-bold px-3 py-1 transition duration-300 hover:scale-115 hover:text-[#AD03CB]">
            🐶 Protectora
          </a>

          <div className="hidden md:flex items-center space-x-9">
            <a
              href="/animales"
              className="transition duration-300 text-[#AD03CB] hover:text-purple-500 font-medium hover:scale-105"
            >
              Mascotas
            </a>

            <div className="w-px h-5 bg-[#AD03CB]/40" />

            <a
              href="/contacto"
              className="transition duration-300 text-[#AD03CB] hover:text-purple-500 font-medium hover:scale-105"
            >
              Contacto
            </a>

            <div className="w-px h-5 bg-[#AD03CB]/40" />

            <a
              href="/donate"
              className="transition duration-300 text-[#AD03CB] hover:text-purple-500 font-medium hover:scale-105"
            >
              🐾 Donar
            </a>
          </div>

          <div className="flex items-center">
            {user && user.role === "ADMIN" && (
              <a
                href="/adminU"
                className="hidden md:inline-block px-3 py-1 rounded transition duration-300 hover:scale-107 hover:-rotate-2 mr-4"
                style={{ color: "#f5f5f5", backgroundColor: "#AD03CB" }}
              >
                🛠️ Panel Admin
              </a>
            )}
            {user ? (
              <div
                className="flex items-center space-x-3 relative"
                ref={profileMenuRef}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: "#AD03CB" }}
                >
                  {user.username}
                </span>
                <div className="relative">
                  <div className="flex justify-center">
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
                  </div>

                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1"
                      style={{
                        backgroundColor: "#F2DCB3",
                        border: "1px solidrgb(208, 0, 187)",
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
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
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
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
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
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
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
                    className="group relative px-4 py-1  text-sm font-bold transition duration-300 hover:scale-105 overflow-hidden mr-2"
                    style={{ color: "#AD03CB"}}
                  >
                    <span className="relative z-10">Iniciar sesión</span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </a>
                <a href="/register">
                  <button
                    className="group relative px-4 py-1 text-sm font-bold transition duration-300 hover:scale-105 overflow-hidden"
                    style={{ color: "#AD03CB"}}
                  >
                    <span className="relative z-10">Registrarse</span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
