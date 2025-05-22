
import { useState } from "react";

export const Main = () => {
  return (
    <div
      className="relative z-0 min-h-screen bg-cover bg-center px-4"
      style={{
        backgroundImage: "url('./mainBg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay oscuro para mejorar legibilidad */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Contenedor general del contenido */}
      <div className="relative z-15 flex flex-col md:flex-row items-center justify-center min-h-screen gap-7 p-8">
        {/* Título a la izquierda */}
        <div className="flex-1 flex items-center justify-start">
          <h1
            className="text-7xl font-bold text-left leading-tight"
            style={{ whiteSpace: "pre-line" }}
          >
            <span style={{ color: "#A66B49" }}>A</span>
            <span style={{ color: "#F2DCB3" }}>yuda</span>
            {"\n"}
            <span style={{ color: "#A66B49" }}>D</span>
            <span style={{ color: "#F2DCB3" }}>ando</span>
            {"\n"}
            <span style={{ color: "#A66B49" }}>O</span>
            <span style={{ color: "#F2DCB3" }}>portunidad a</span>
            {"\n"}
            <span style={{ color: "#A66B49" }}>P</span>
            <span style={{ color: "#F2DCB3" }}>eludos que</span>
            {"\n"}
            <span style={{ color: "#A66B49" }}>T</span>
            <span style={{ color: "#F2DCB3" }}>ransforman</span>
            {"\n"}
            <span style={{ color: "#A66B49" }}>A</span>
            <span style={{ color: "#F2DCB3" }}>lmas</span>
          </h1>
        </div>

        {/* Contenido a la derecha */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-20 mt-50 animate-fade-in-up">
          <p className="text-xl md:text-4xl mt-10 animate-fade-in-up text-[#F2DCB3]" style={{ color: "#F2DCB3" }}>
            Rescata y dale amor a los peludos que más lo necesitan.
          </p>

          {/* Botones */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              className="px-8 py-3 rounded-full text-lg font-bold shadow-lg 
        transition-all duration-300 hover:scale-105 hover:-rotate-3"
              style={{
                backgroundColor: "#D97236",
                color: "#40170E",
              }}
            >
              🐶 Adoptar Mascota
            </button>
            <button
              className="px-8 py-3 rounded-full text-lg font-bold shadow-lg 
        transition-all duration-300 hover:scale-105 hover:rotate-3"
              style={{
                backgroundColor: "#F2DCB3",
                color: "#40170E",
              }}
            >
              🏡 Sobre el Shelter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;