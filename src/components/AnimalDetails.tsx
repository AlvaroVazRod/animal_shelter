import { useRef } from "react";
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

        <img
          src={`http://localhost:8080/images/animal/${animal.image}`}
          alt={animal.name}
          className="w-full h-48 object-cover rounded mb-4"
        />

        <p className="text-sm text-gray-700 mb-2">
          <span className="font-semibold text-[#40170E]">Edad:</span>{" "}
          {animal.age} años
        </p>
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-semibold text-[#40170E]">Tamaño:</span>{" "}
          {animal.weight} kg
        </p>
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-semibold text-[#40170E]">Sexo:</span>{" "}
          {animal.gender}
        </p>
        <p className="text-sm text-gray-700 mb-2">
          <span className="font-semibold text-[#40170E]">Raza:</span>{" "}
          {animal.breed}
        </p>

        {animal.description && (
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-[#40170E]">Descripción:</span>{" "}
            {animal.description}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mt-4">
          {animal.breed.toLowerCase().includes("perro") && (
            <span className="bg-orange-200 text-orange-800 text-xs font-medium px-3 py-1 rounded-full animate-slide-in">
              🐶 Perro
            </span>
          )}
          {animal.breed.toLowerCase().includes("gato") && (
            <span className="bg-yellow-200 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full animate-slide-in">
              🐱 Gato
            </span>
          )}
          <div className="absolute -top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-md">
  🆘 Adopción urgente
</div>
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

        {/* Estilos de animación añadidos en línea */}
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
