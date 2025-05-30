import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { Animal } from "../types/Animals";

interface AnimalDetailsProps {
  animal: Animal;
  onClose: () => void;
}

export const AnimalDetails = ({ animal, onClose }: AnimalDetailsProps) => {
  const modalContentRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(event.target as Node)
    ) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-red-950 bg-opacity-50"
    >
      <div
        ref={modalContentRef}
        className="bg-yellow-100 rounded-lg max-w-md w-full p-6 relative shadow-xl"
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-[#40170E]">
          {animal.name}
        </h2>

        <div className="w-full h-48 overflow-hidden rounded mb-4">
          <Swiper spaceBetween={10} slidesPerView={1} loop>
            {(animal.images ?? []).length > 0 ? (
              (animal.images ?? []).map((img, index) => (
                <SwiperSlide key={`${animal.id}-${index}`}>
                  <img
                    src={`http://localhost:8080/images/animal/${img.filename}`}
                    alt={animal.name}
                    className="w-full h-48 object-cover"
                  />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide key={`${animal.id}-default`}>
                <img
                  src={`http://localhost:8080/images/animal/${animal.image}`}
                  alt={animal.name}
                  className="w-full h-48 object-cover"
                />
              </SwiperSlide>
            )}
          </Swiper>
        </div>

        
        <div className="flex flex-col gap-4">
  {/* Subcontenedor de Datos y Chips */}
  <div className="flex flex-row gap-4">
    {/* Datos del Animal */}
    <div className="flex-1">
      <p className="text-sm text-gray-700 mb-2">
        <span className="font-semibold text-[#40170E]">Edad:</span> {animal.age} años
      </p>
      <p className="text-sm text-gray-700 mb-2">
        <span className="font-semibold text-[#40170E]">Tamaño:</span> {animal.weight} kg
      </p>
      <p className="text-sm text-gray-700 mb-2">
        <span className="font-semibold text-[#40170E]">Sexo:</span> {animal.gender}
      </p>
      <p className="text-sm text-gray-700 mb-2">
        <span className="font-semibold text-[#40170E]">Raza:</span> {animal.breed}
      </p>
    </div>

    {/* Chips */}
    <div className="flex flex-wrap gap-2 items-start">
      {animal.species.toLowerCase().includes("dog") && (
        <span className="bg-orange-200 text-orange-800 text-xs font-medium px-3 py-1 rounded-full animate-slide-in">
          🐶 Perro
        </span>
      )}
      {animal.species.toLowerCase().includes("cat") && (
        <span className="bg-yellow-200 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full animate-slide-in">
          🐱 Gato
        </span>
      )}
      <span className="bg-green-200 text-green-800 text-xs font-medium px-3 py-1 rounded-full animate-slide-in">
        💉 Antirrábica
      </span>
      <span className="bg-blue-200 text-blue-800 text-xs font-medium px-3 py-1 rounded-full animate-slide-in">
        🏥 Cirugía realizada
      </span>
      <span className="bg-purple-200 text-purple-800 text-xs font-medium px-3 py-1 rounded-full animate-slide-in">
        🌟 Cuidados especiales
      </span>
    </div>
  </div>

  {/* Botones */}
  <div className="flex justify-center gap-4 mt-4">
    <button className="bg-[#D97236] text-white px-4 py-2 rounded">Apadrinar</button>
    <button className="bg-[#D97236] text-white px-4 py-2 rounded">Adóptame</button>
    <button className="bg-[#D97236] text-white px-4 py-2 rounded">Dóname</button>
  </div>
</div>

        <style>
          {`
            @keyframes slideInRight {
              0% {
                transform: translateX(100%);
                opacity: 0;
              }
              100% {
                transform: translateX(0);
                opacity: 1;
              }
            }
            .animate-slide-in {
              animation: slideInRight 0.5s ease-out forwards;
            }
          `}
        </style>
      </div>
    </div>
  );
};
