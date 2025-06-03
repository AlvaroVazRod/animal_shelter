export const Main = () => {
  return (
    <div className="relative z-0 min-h-screen bg-black px-4 overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full filter grayscale object-cover z-[-1]"
        style={{ filter: "sepia(1)" }}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/main_video_bg.mp4" type="video/mp4" />
        Tu navegador no soporta el video.
      </video>

      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-15 flex flex-col md:flex-row items-center justify-center min-h-screen gap-10 p-8">
        {/* VISTA DESKTOP */}
        <div className="hidden md:flex flex-1 items-center justify-start">
          <div className="space-y-5">
            <h1 className="text-6xl font-bold text-left animate-line fade-delay-1">
              <span style={{ color: "#AD03CB" }}>A</span>
              <span style={{ color: "#f5f5f5" }}>yuda</span>
            </h1>
            <h1 className="text-6xl font-bold text-left animate-line fade-delay-2">
              <span style={{ color: "#AD03CB" }}>D</span>
              <span style={{ color: "#f5f5f5" }}>ando</span>
            </h1>
            <h1 className="text-6xl font-bold text-left animate-line fade-delay-3">
              <span style={{ color: "#AD03CB" }}>O</span>
              <span style={{ color: "#f5f5f5" }}>portunidad a</span>
            </h1>
            <h1 className="text-6xl font-bold text-left animate-line fade-delay-4">
              <span style={{ color: "#AD03CB" }}>P</span>
              <span style={{ color: "#f5f5f5" }}>eludos que</span>
            </h1>
            <h1 className="text-6xl font-bold text-left animate-line fade-delay-5">
              <span style={{ color: "#AD03CB" }}>T</span>
              <span style={{ color: "#f5f5f5" }}>ransforman</span>
            </h1>
            <h1 className="text-6xl font-bold text-left animate-line fade-delay-6">
              <span style={{ color: "#AD03CB" }}>A</span>
              <span style={{ color: "#f5f5f5" }}>lmas</span>
            </h1>
          </div>
        </div>

        {/* VISTA MÓVIL */}
        <div className="block md:hidden w-full text-center flex flex-col items-center animate-fade-in-up mt-20 relative">
          <h1 className="text-5xl font-extrabold text-[#AD03CB] drop-shadow-lg mb-20">
            {/* HUELLAS ANIMADAS */}
            <div className="absolute top-[-2rem] left-1/2 -translate-x-1/2 flex gap-2">
              <span className="paw animate-paw1">🐾</span>
              <span className="paw animate-paw2">🐾</span>
              <span className="paw animate-paw3">🐾</span>
              <span className="paw animate-paw4">🐾</span>
              <span className="paw animate-paw5">🐾</span>
            </div>
            ADOPTA
          </h1>

          <p className="text-2xl text-[#f5f5f5] animate-fade-in-up mb-6">
            Rescata y dale amor a los peludos que más lo necesitan.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-4">
            <button className="px-6 py-2 rounded-full text-md font-bold shadow-lg transition-all duration-500 hover:scale-105 hover:-rotate-3 bg-[#AD03CB] text-white">
              🐶 Adoptar
            </button>
            <button className="px-6 py-2 rounded-full text-md font-bold shadow-lg transition-all duration-500 hover:scale-105 hover:-rotate-3 bg-[#AD03CB] text-white">
              🏡 Shelter
            </button>
          </div>
        </div>

        {/* Contenido a la derecha para desktop */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center gap-20 animate-fade-in-up">
          <p className="text-3xl text-[#f5f5f5] animate-fade-in-up">
            Rescata y dale amor a los peludos que más lo necesitan.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:-rotate-3 bg-[#AD03CB] text-white">
              🐶 Adoptar Mascota
            </button>
            <button className="px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:rotate-3 bg-[#AD03CB] text-white">
              🏡 Sobre el Shelter
            </button>
          </div>
        </div>

        {/* Animaciones CSS embebidas */}
        <style>
          {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }

         

          @keyframes pawStep {
            0%   { opacity: 0; transform: translateX(0); }
            20%  { opacity: 1; transform: translateX(10%); }
            40%  { transform: translateX(20%); }
            60%  { transform: translateX(35%); }
            80%  { transform: translateX(50%); opacity: 1; }
            100% { transform: translateX(65%); opacity: 0; }
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

         

          .paw-track {
            left: 10%;
          }

          .paw {
            font-size: 1.5rem;
            opacity: 0;
            position: relative;
          }

          .animate-paw1 { animation: pawStep 5s infinite ease-in-out 0s; }
          .animate-paw2 { animation: pawStep 5s infinite ease-in-out 0.5s; }
          .animate-paw3 { animation: pawStep 5s infinite ease-in-out 1s; }
          .animate-paw4 { animation: pawStep 5s infinite ease-in-out 1.5s; }
          .animate-paw5 { animation: pawStep 5s infinite ease-in-out 2s; }
        `}
        </style>
      </div>
    </div>
  );
};

export default Main;
