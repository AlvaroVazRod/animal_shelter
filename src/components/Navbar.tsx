import { useState, useRef, useEffect } from "react";
import { useUser } from "../services/users/useUser";

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
    <nav className="fixed top-0 left-0 w-full z-50 shadow-lg bg-[#f5f5f5]">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between h-16 whitespace-nowrap px-4">
          <a
            href="/"
            className="text-xl font-bold px-3 py-1 transition duration-300 hover:scale-115 hover:text-[#AD03CB]"
          >
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

          <div className="flex items-center space-x-2">
            {/* Menú hamburguesa para móvil */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-[#AD03CB] focus:outline-none"
              aria-label="Abrir menú"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Admin panel (solo en escritorio) */}
            {user && user.role === "ADMIN" && (
              <a
                href="/adminU"
                className="hidden md:inline-block px-3 py-1 rounded transition duration-300 hover:scale-107 hover:-rotate-2 mr-2"
                style={{ color: "#f5f5f5", backgroundColor: "#AD03CB" }}
              >
                🛠️ Panel Admin
              </a>
            )}

            {user ? (
              <div
                className="hidden md:flex items-center space-x-3 relative"
                ref={profileMenuRef}
              >
                <span
                  className="text-sm font-medium"
                  style={{ color: "#AD03CB" }}
                >
                  {user.username}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="focus:outline-none"
                    aria-label="Menú de perfil"
                    aria-expanded={isProfileMenuOpen}
                    aria-haspopup="true"
                  >
                    {user?.image ? (
                      <img
                        src={`http://localhost:8080/images/user/${user.image}`}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition duration-300 hover:scale-110 border-[#AD03CB]"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full text-lg font-semibold flex items-center justify-center object-cover cursor-pointer border-2 transition duration-300 hover:scale-115"
                        style={{
                          backgroundColor: base,
                          color: complementary,
                          borderColor: complementary,
                        }}
                      >
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {isProfileMenuOpen && (
                    <div
                      id="profile-menu"
                      className="absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 z-50"
                      style={{
                        backgroundColor: "#FFE2FE",
                        border: "1px solid rgb(208, 0, 187)",
                      }}
                    >
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-sm text-[#40170E] hover:bg-[#FFBDFD] transition-colors duration-200"
                      >
                        👤 Mi perfil
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-[#40170E] hover:bg-[#FFBDFD] transition-colors duration-200"
                      >
                        ⚙️ Configuración
                      </a>
                      <button
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-[#40170E] hover:bg-[#FFBDFD] transition-colors duration-200"
                      >
                        🚪 Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <a href="/login">
                  <button
                    className="group relative px-4 py-1 text-sm font-bold transition duration-300 hover:scale-105"
                    style={{ color: "#AD03CB" }}
                  >
                    <span className="relative z-10">Iniciar sesión</span>
                  </button>
                </a>
                <a href="/register">
                  <button
                    className="group relative px-4 py-1 text-sm font-bold transition duration-300 hover:scale-105"
                    style={{ color: "#AD03CB" }}
                  >
                    <span className="relative z-10">Registrarse</span>
                  </button>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-2 bg-[#f5f5f5] shadow-md transition-all duration-300 text-left">
            <a href="/animales" className="block text-[#AD03CB] font-medium hover:text-purple-500">
              Mascotas
            </a>
            <a href="/contacto" className="block text-[#AD03CB] font-medium hover:text-purple-500">
              Contacto
            </a>
            <a href="/donate" className="block text-[#AD03CB] font-medium hover:text-purple-500">
              🐾 Donar
            </a>
            {user && user.role === "ADMIN" && (
              <a
                href="/adminU"
                className="block text-[#AD03CB] font-medium hover:text-purple-500"
              >
                🛠️ Panel Admin
              </a>
            )}
            {user ? (
              <>
                <a href="/profile" className="block text-[#AD03CB] font-medium hover:text-purple-500">
                  👤 Mi perfil
                </a>
                <a href="#" className="block text-[#AD03CB] font-medium hover:text-purple-500">
                  ⚙️ Configuración
                </a>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-left w-full text-[#AD03CB] font-medium hover:text-purple-500"
                >
                  🚪 Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="block text-[#AD03CB] font-medium hover:text-purple-500">
                  Iniciar sesión
                </a>
                <a href="/register" className="block text-[#AD03CB] font-medium hover:text-purple-500">
                  Registrarse
                </a>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
