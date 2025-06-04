import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export const Main = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const SPECIES_OPTIONS = [
    { key: "dog", label: "Ver Perros", icon: "🐶" },
    { key: "cat", label: "Ver Gatos", icon: "🐱" },
  ];

  const handleAdoptClick = () => {
    setShowDropdown(!showDropdown);
  };

  const goToSpecies = (type: string) => {
    navigate(`/animales?species=${type}`);
    setShowDropdown(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="relative z-0 min-h-screen bg-black px-4 overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover z-[-1] filter sepia"
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
        {/* Texto izquierdo */}
        <div className="hidden md:flex flex-1 items-center justify-start">
          <div className="space-y-5">
            {["Ayuda", "Dando", "Oportunidad a", "Peludos que", "Transforman", "Almas"].map((word, i) => (
              <h1
                key={word}
                className={`text-6xl font-bold text-left animate-line fade-delay-${i + 1}`}
              >
                <span style={{ color: "#AD03CB" }}>{word.charAt(0)}</span>
                <span style={{ color: "#f5f5f5" }}>{word.slice(1)}</span>
              </h1>
            ))}
          </div>
        </div>

        {/* Vista Móvil */}
        <div className="block md:hidden w-full text-center flex flex-col items-center animate-fade-in-up mt-20 relative">
          <h1 className="text-5xl font-extrabold text-[#AD03CB] drop-shadow-lg mb-20">
            <div className="absolute top-[-2rem] left-1/2 -translate-x-1/2 flex gap-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`paw animate-paw${i + 1}`}>🐾</span>
              ))}
            </div>
            ADOPTA
          </h1>

          <p className="text-2xl text-[#f5f5f5] animate-fade-in-up mb-6">
            Rescata y dale amor a los peludos que más lo necesitan.
          </p>

          <div className="mt-4 flex flex-wrap justify-center gap-4 relative" ref={dropdownRef}>
            <div className="relative w-[160px]">
              <button
                onClick={handleAdoptClick}
                className="w-full px-6 py-2 rounded-full text-md font-bold shadow-lg transition-all duration-500 hover:scale-105 hover:-rotate-3 bg-[#AD03CB] text-white"
              >
                🐶 Adoptar
              </button>
              {showDropdown && (
                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-md z-50 flex flex-col text-[#AD03CB] text-sm font-semibold overflow-hidden">
                  {SPECIES_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => goToSpecies(option.key)}
                      className="px-4 py-2 hover:bg-[#AD03CB] hover:text-white transition"
                    >
                      {option.icon} {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/shelter")}
              className="px-6 py-2 rounded-full text-md font-bold shadow-lg transition-all duration-500 hover:scale-105 hover:-rotate-3 bg-[#AD03CB] text-white"
            >
              🏡 Shelter
            </button>
          </div>
        </div>

        {/* Vista Desktop */}
        <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center gap-20 animate-fade-in-up">
          <p className="text-3xl text-[#f5f5f5] animate-fade-in-up">
            Rescata y dale amor a los peludos que más lo necesitan.
          </p>

          <div className="flex flex-wrap justify-center gap-4 relative" ref={dropdownRef}>
            <div className="relative w-[180px]">
              <button
                onClick={handleAdoptClick}
                className="w-full px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:-rotate-3 bg-[#AD03CB] text-white"
              >
                🐶 Adoptar
              </button>
              {showDropdown && (
                <div className="absolute mt-2 w-full bg-white rounded-lg shadow-md z-50 flex flex-col text-[#AD03CB] text-sm font-semibold overflow-hidden">
                  {SPECIES_OPTIONS.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => goToSpecies(option.key)}
                      className="px-4 py-2 hover:bg-[#AD03CB] hover:text-white transition"
                    >
                      {option.icon} {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/shelter")}
              className="px-8 py-3 rounded-full text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:-rotate-3 bg-[#AD03CB] text-white"
            >
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

