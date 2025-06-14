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
      className="bg-white rounded-3xl shadow-lg flex flex-col sm:flex-row overflow-hidden border border-gray-200 cursor-pointer hover:shadow-xl transition-all duration-300"
    >
      {/* Imagen */}
      <div className="relative sm:w-1/2 h-70 sm:h-auto">
        <img
          src={imageUrl}
          alt={animal.name}
          className="object-cover w-full h-full sm:rounded-l-3xl"
        />
        {animal.status === "requires_funding" && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            PRIORIDAD
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2 flex flex-col justify-center items-center sm:items-start w-full sm:w-1/2 bg-[#fdf3ff] gap-y-1.5 text-base sm:text-sm rounded-b-3xl sm:rounded-bl-none">
        <h3 className="text-xl font-bold text-purple-700 mb-2 text-center truncate w-full">
          {animal.name}
        </h3>
        <p>
          <span className="font-semibold text-fuchsia-700">Edad:</span>{" "}
          {animal.age} {animal.age === 1 ? "año" : "años"}
        </p>
        <p>
          <span className="font-semibold text-fuchsia-700">Sexo:</span>{" "}
          {animal.gender}
        </p>
        <p>
          <span className="font-semibold text-fuchsia-700">Peso:</span>{" "}
          {animal.weight} Kg
        </p>
        <p className="truncate">
          <span className="font-semibold text-fuchsia-700">Raza:</span>{" "}
          {animal.breed}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-fuchsia-700">Fecha de llegada:</span>
          {" "}
          {new Date(animal.arrivalDate).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};