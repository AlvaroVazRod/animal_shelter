import type { Animal } from "../types/Animals";

interface AnimalDetailsProps {
    animal: Animal;
    onClose: () => void;
}

export const AnimalDetails = ({ animal, onClose }: AnimalDetailsProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 relative shadow-xl">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
                    onClick={onClose}
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold mb-4 text-[#40170E]">{animal.name}</h2>
                <img
                    src={`http://localhost:8080/images/animal/${animal.image}`}
                    alt={animal.name}
                    className="w-full h-48 object-cover rounded mb-4"
                />
                <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold text-[#D97236]">Edad:</span> {animal.age} años
                </p>
                <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold text-[#D97236]">Tamaño:</span> {animal.weight} kg
                </p>
                <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold text-[#D97236]">Sexo:</span> {animal.gender}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold text-[#D97236]">Raza:</span> {animal.breed}
                </p>
                {animal.description && (
                    <p className="text-sm text-gray-700">
                        <span className="font-semibold text-[#D97236]">Descripción:</span> {animal.description}
                    </p>
                )}
            </div>
        </div>
    );
};
