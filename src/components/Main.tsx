import { useState } from "react";

export const Main = () => {
  return (
    <section 
      className="relative z-0 min-h-screen flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('./mainBg.jpg')",
      }}
    >
      {/* Overlay oscuro semi-transparente */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      {/* Contenido principal */}
      <article className="relative z-10 max-w-2xl space-y-6">
        {/* Título */}
        <h1 className="text-5xl md:text-6xl font-bold text-[#F2DCB3] animate-fade-in">
          Protectora
        </h1>

        {/* Descripción */}
        <p className="text-xl md:text-2xl text-[#F2DCB3] animate-fade-in delay-100">
          Rescatando y dando amor a los peludos que más lo necesitan.
        </p>

        {/* Grupo de botones */}
        <div className="flex flex-wrap justify-center gap-4 animate-fade-in delay-200">
          <button
            className="px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-300 
                       hover:scale-105 hover:-rotate-3 bg-[#D97236] text-[#40170E]"
          >
            🐶 Adoptar
          </button>
          <button
            className="px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-300 
                       hover:scale-105 hover:rotate-3 bg-[#F2DCB3] text-[#40170E]"
          >
            🏡 Apadrinar
          </button>
        </div>
      </article>
    </section>
  );
};
export default Main;
