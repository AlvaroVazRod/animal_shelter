import { useState } from "react";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav 
      className="fixed top-0 left-0 w-full z-50 shadow-lg" 
      style={{ backgroundColor: "#A65638" }} // Fondo café cálido
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 whitespace-nowrap">
          {/* Logo */}
          <span 
            className="text-xl font-bold px-3 py-1 rounded-lg shadow-md transition duration-300 hover:opacity-90"
            style={{ 
              color: "#F2DCB3", 
              backgroundColor: "#D97236" 
            }}
          >
            🐕 Protectora
          </span>

          {/* Menú principal (desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <a 
              href="#" 
              className="px-3 py-1 rounded transition duration-300 hover:opacity-90"
              style={{ 
                color: "#F2DCB3", 
                backgroundColor: "#D97236" 
              }}
            >
              Inicio
            </a>
            <a 
              href="#" 
              className="px-3 py-1 rounded transition duration-300 hover:opacity-90"
              style={{ 
                color: "#F2DCB3", 
                backgroundColor: "#D97236" 
              }}
            >
              Productos
            </a>
            <a 
              href="#" 
              className="px-3 py-1 rounded transition duration-300 hover:opacity-90"
              style={{ 
                color: "#F2DCB3", 
                backgroundColor: "#D97236" 
              }}
            >
              Blog
            </a>
            <a 
              href="#" 
              className="px-3 py-1 rounded transition duration-300 hover:opacity-90"
              style={{ 
                color: "#F2DCB3", 
                backgroundColor: "#D97236" 
              }}
            >
              Contacto
            </a>
          </div>

          {/* Botón Donar */}
          <button 
            className="px-4 py-1 rounded-full text-sm font-bold shadow-md transition duration-300 hover:opacity-90"
            style={{ 
              color: "#40170E", 
              backgroundColor: "#F2DCB3" 
            }}
          >
            🐾 Donar
          </button>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;