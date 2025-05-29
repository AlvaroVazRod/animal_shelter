import { useState, useRef, useEffect } from "react";
import { useUser } from "../services/users/useUser";

export const AdminNavbar = () => {
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
      className="fixed top-0 left-0 w-full z-50 shadow-md"
      style={{ backgroundColor: "#2D2A32" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          <a
            href="/"
            className="text-xl font-bold px-3 py-1 rounded-lg transition duration-300 hover:scale-110"
            style={{ color: "#F5F5F5", backgroundColor: "#4ECCA3" }}
          >
            🐶 Protectora
          </a>

          <div className="flex items-center space-x-4">
            <a
              href="/adminU"
              className="px-4 py-1 rounded-md text-sm font-semibold transition duration-300 hover:scale-105"
              style={{ backgroundColor: "#4ECCA3", color: "#2D2A32" }}
            >
              Panel Usuarios
            </a>
            <a
              href="/adminP"
              className="px-4 py-1 rounded-md text-sm font-semibold transition duration-300 hover:scale-105"
              style={{ backgroundColor: "#4ECCA3", color: "#2D2A32" }}
            >
              Panel Mascotas
            </a>
                        <a
              href="/adminT"
              className="px-4 py-1 rounded-md text-sm font-semibold transition duration-300 hover:scale-105"
              style={{ backgroundColor: "#4ECCA3", color: "#2D2A32" }}
            >
              Panel Etiquetas
            </a>

            {user && (
              <div
                className="relative flex items-center space-x-3"
                ref={profileMenuRef}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: "#F5F5F5" }}
                >
                  {user.username}
                </span>
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
                      className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition duration-300 hover:scale-110 border-[#4ecca3]"
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
                      backgroundColor: "#F5F5F5",
                      border: "1px solid #4ECCA3",
                    }}
                  >
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm"
                      style={{ color: "#2D2A32" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E0F7F1")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
                      }
                    >
                      👤 Mi perfil
                    </a>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm"
                      style={{ color: "#2D2A32" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#E0F7F1")
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
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
