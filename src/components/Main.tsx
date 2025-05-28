export const Main = () => {
  return (
    <div
      className="relative z-0 min-h-screen bg-black px-4 overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover z-[-1]"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/main_video_bg.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-15 flex flex-col md:flex-row items-center justify-center min-h-screen gap-10 p-15">
        {/* Título animado línea por línea */}
        <div className="flex-1 flex items-center justify-start">
          <div className="space-y-5">
            <h1 className="text-6xl font-bold text-left animate-line fade-delay-1">
              <span style={{ color: "#40170E" }}>A</span>
              <span style={{ color: "#F2DCB3" }}>yuda</span>
            </h1>
            <h1 className="text-6xl font-bold text-left animate-line fade-delay-2">
              <span style={{ color: "#40170E" }}>D</span>
              <span style={{ color: "#F2DCB3" }}>ando</span>
            </h1>
            <h1 className="text-6xl font-bold text-left animate-line fade-delay-3">
              <span style={{ color: "#40170E" }}>O</span>
              <span style={{ color: "#F2DCB3" }}>portunidad a</span>
            </h1>
            <h1 className="text-6xl font-bold text-left animate-line fade-delay-4">
              <span style={{ color: "#40170E" }}>P</span>
              <span style={{ color: "#F2DCB3" }}>eludos que</span>
            </h1>
            <h1 className="text-6xl font-bold text-left animate-line fade-delay-5">
              <span style={{ color: "#40170E" }}>T</span>
              <span style={{ color: "#F2DCB3" }}>ransforman</span>
            </h1>
            <h1 className="text-6xl font-bold text-left animate-line fade-delay-6">
              <span style={{ color: "#40170E" }}>A</span>
              <span style={{ color: "#F2DCB3" }}>lmas</span>
            </h1>
          </div>
        </div>

        {/* Contenido a la derecha */}
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-20 mt-50 animate-fade-in-up">
          <p className="text-xl md:text-4xl mt-10 text-[#F2DCB3] animate-fade-in-up">
            Rescata y dale amor a los peludos que más lo necesitan.
          </p>

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

        {/* Animaciones CSS embebidas */}
        <style>
          {`
            @keyframes fadeInUp {
              0% {
                opacity: 0;
                transform: translateY(20px);
              }
              100% {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .animate-fade-in-up {
              animation: fadeInUp 0.8s ease-out both;
            }

            .animate-line {
              opacity: 0;
              animation: fadeInUp 0.6s ease-out forwards;
            }

            .fade-delay-1 { animation-delay: 0.1s; }
            .fade-delay-2 { animation-delay: 0.3s; }
            .fade-delay-3 { animation-delay: 0.5s; }
            .fade-delay-4 { animation-delay: 0.7s; }
            .fade-delay-5 { animation-delay: 0.9s; }
            .fade-delay-6 { animation-delay: 1.1s; }
          `}
        </style>
      </div>
    </div>
  );
};

export default Main;
