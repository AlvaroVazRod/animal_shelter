// AnimalTable.tsx
import { FiTrash2, FiEdit, FiInfo } from "react-icons/fi";
import type { Animal } from "../../types/Animals";

interface AnimalTableProps {
    animals: Animal[];
    page: number;
    totalPages: number;
    onDelete: (id: number) => void;
    onEdit: (animal: Animal) => void;
    onPageChange: (newPage: number) => void;
}

export default function AnimalTable({
    animals,
    page,
    totalPages,
    onDelete,
    onEdit,
    onPageChange,
}: AnimalTableProps) {
    if (animals.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-xl" style={{ color: "#4ECCA320" }}>
                    No hay animales registrados
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#4ECCA320]/90 rounded-lg shadow-lg border-2 border-[#4ECCA3] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#4ECCA3]/50">
                    <thead className="bg-[#4ECCA3]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                Animal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                Información
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                Prioridad
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#4ECCA320]/80 divide-y divide-[#a4ebd4]/30">
                        {animals.map((animal) => (
                            <tr key={animal.id} className="hover:bg-[#4ECCA320] transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#4ECCA3] flex items-center justify-center text-[#e8e8e8]">
                                            <FiInfo className="h-5 w-5" />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-[#e8e8e8]">
                                                {animal.name}
                                            </div>
                                            <div className="text-sm text-[#e8e8e8]/80">ID: {animal.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-[#e8e8e8]">
                                        <div className="flex items-center">
                                            <span className="mr-2 text-[#a4ebd4]">Especie:</span>
                                            {animal.species}
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <span className="mr-2 text-[#a4ebd4]">Raza:</span>
                                            {animal.breed}
                                        </div>
                                        <div className="flex items-center mt-1">
                                            <span className="mr-2 text-[#a4ebd4]">Edad:</span>
                                            {animal.age} años
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap"></td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${animal.status === "disponible"
                                                ? "bg-[#a4ebd4] text-[#3d5950]"
                                                : "bg-[#a4ebad] text-[#3d5950]"
                                            }`}
                                    >
                                        {animal.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onDelete(animal.id)}
                                        className="text-[#7ddb8f] hover:text-red-600 mr-4 transition-colors"
                                        title="Eliminar animal"
                                    >
                                        <FiTrash2 className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(animal)}
                                        className="text-[#7ddb8f] hover:text-[#7ddbc8] transition-colors"
                                        title="Editar animal"
                                    >
                                        <FiEdit className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginación */}
            <div className="flex justify-between items-center px-6 py-4 bg-[#4ECCA3]/20 border-t border-[#4ECCA3]/50">
                <div className="text-sm text-[#e8e8e8]">
                    Mostrando página {page + 1} de {totalPages}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 0}
                        className={`px-4 py-2 rounded-md font-semibold ${page === 0
                                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                : "bg-[#48e0af] text-[#294a3f] hover:bg-[#4ECCA3]"
                            } transition-colors`}
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page + 1 >= totalPages}
                        className={`px-4 py-2 rounded-md font-semibold ${page + 1 >= totalPages
                                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                : "bg-[#48e0af] text-[#294a3f] hover:bg-[#4ECCA3]"
                            } transition-colors`}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}
