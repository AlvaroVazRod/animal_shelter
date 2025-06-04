import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <section 
      className="relative z-0 min-h-screen flex flex-col items-center justify-center text-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('./mainBg.jpg')",
      }}
    >
      {/* Overlay oscuro semi-transparente */}
      <div className="absolute inset-0  bg-black/50 backdrop-blur-sm"></div>

      {/* Contenido principal */}
      <article className="relative z-10 max-w-2xl space-y-6">
        {/* Título - Número 404 grande */}
        <div className="flex justify-center pt-30">
        <h1 className="text-8xl md:text-9xl font-bold text-[#F2DCB3] animate-fade-in">
          4
        </h1>
        <img src="404.png" className="w-40 h-40"/>
        <h1 className="text-8xl md:text-9xl font-bold text-[#F2DCB3] animate-fade-in">
          4
        </h1>
        </div>

        {/* Subtítulo */}
        <h2 className="text-4xl md:text-5xl font-bold text-[#F2DCB3] animate-fade-in delay-75">
          ¡Ups! Página no encontrada
        </h2>

        {/* Descripción */}
        <p className="text-xl md:text-2xl text-[#F2DCB3] animate-fade-in delay-100">
          Lo sentimos, la página que buscas parece haberse perdido como un gatito curioso.
        </p>

        {/* Botón para volver al inicio */}
        <div className="animate-fade-in delay-200">
          <Link
            to="/"
            className="inline-block px-8 py-3 rounded-full text-lg font-bold shadow-lg 
                      transition-all duration-300 hover:scale-105 bg-[#D97236] text-[#40170E]"
          >
            🏠 Volver al hogar
          </Link>
        </div>
      </article>
    </section>
  );
};

export default NotFound;