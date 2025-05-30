import type { Animal } from "../types/Animals";

type AnimalCardProps = {
  animal: Animal;
  onClick: () => void;
};

export const AnimalCard = ({ animal, onClick }: AnimalCardProps) => {
  const imageUrl =
    animal.images && animal.images.length > 0
      ? `http://localhost:8080/images/animal/${animal.images[0].filename}`
      : `http://localhost:8080/images/animal/${animal.image}`;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-3xl shadow-lg flex w-96 h-48 overflow-hidden border border-gray-200 cursor-pointer hover:shadow-xl transition-all duration-300"
    >
      {/* Imagen */}
      <div className="relative w-1/2 h-full">
        <img
          src={imageUrl}
          alt={animal.name}
          className="object-cover w-full h-full rounded-l-3xl"
        />
        {animal.status === "requires_funding" && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            PRIORIDAD
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col justify-center w-1/2 bg-[#fdf3ff] h-full">
        <h3 className="text-lg font-bold text-purple-700 mb-2 text-center truncate">
          {animal.name}
        </h3>
        <p className="text-sm">
          <span className="font-semibold text-fuchsia-700">Edad:</span>{" "}
          {animal.age} {animal.age === 1 ? "año" : "años"}
        </p>
        <p className="text-sm">
          <span className="font-semibold text-fuchsia-700">Sexo:</span> {animal.gender}
        </p>
        <p className="text-sm">
          <span className="font-semibold text-fuchsia-700">Peso:</span> {animal.weight} Kg
        </p>
        <p className="text-sm truncate">
          <span className="font-semibold text-fuchsia-700">Raza:</span> {animal.breed}
        </p>
      </div>
    </div>
  );
};
