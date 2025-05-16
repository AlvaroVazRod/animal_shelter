import { useState } from "react";

export const Main = () => {
  return (
    <div>
      {/* Overlay oscuro para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/40 "></div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-2xl">
        {/* Título */}
        <h1
          className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in"
          style={{ color: "#F2DCB3" }}
        >
          Protectora
        </h1>

        {/* Descripción */}
        <p
          className="text-xl md:text-2xl mb-8 animate-fade-in delay-100"
          style={{ color: "#F2DCB3" }}
        >
          Rescatando y dando amor a los peludos que más lo necesitan.
        </p>

        {/* Botones */}
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in delay-200">
          <button
            className="px-8 py-3 rounded-full text-lg font-bold shadow-lg 
             transition-all duration-300 hover:scale-105 hover:-rotate-3"
            style={{
              backgroundColor: "#D97236",
              color: "#40170E",
            }}
          >
            🐶 Botón 1
          </button>
          <button
            className="px-8 py-3 rounded-full text-lg font-bold shadow-lg 
             transition-all duration-300 hover:scale-105 hover:rotate-3"
            style={{
              backgroundColor: "#F2DCB3",
              color: "#40170E",
            }}
          >
            🏡 Botón 2
          </button>
        </div>
      </div>
    </div>
  );
};
export default Main;
