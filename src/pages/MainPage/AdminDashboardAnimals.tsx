import { useEffect, useState, useRef } from "react";
import { AdminPageTemplate } from "../templates/AdminTemplate";
import { FiTrash2, FiEdit, FiAlertCircle, FiInfo } from "react-icons/fi";
import type { Animal } from "../../types/Animals";
import { useUser } from "../../services/users/useUser";

export default function AdminDashboardAnimals() {
  const { getToken } = useUser();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Edición de animales
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null);
  const [editForm, setEditForm] = useState<Partial<Animal>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Abrir modal con animación y focus
  const openEditModal = (animal: Animal) => {
    setEditingAnimal(animal);
    setEditForm(animal);
    setEditError(null);
    setIsModalOpen(true);
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  // Cerrar modal con animación
  const closeEditModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingAnimal(null);
      setEditForm({});
      setEditError(null);
    }, 300);
  };

  const handleChange = (field: keyof Animal, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const fetchAnimals = async (pageNumber: number) => {
    setLoading(true);
    try {
      const token = getToken();
      const query = new URLSearchParams({
        page: String(pageNumber),
        size: "10",
      });

      const response = await fetch(
        `http://localhost:8080/api/animales?${query.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      if (!response.ok) throw new Error("Error al obtener los animales");
      const data = await response.json();
      setAnimals(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const deleteAnimal = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este animal?")) return;

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:8080/api/animales/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al eliminar animal");

      setAnimals((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar animal");
    }
  };

  useEffect(() => {
    fetchAnimals(0);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchAnimals(newPage);
    }
  };

  if (loading) {
    return (
      <AdminPageTemplate>
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl" style={{ color: "#4ECCA320" }}>
            Cargando animales...
          </div>
        </div>
      </AdminPageTemplate>
    );
  }

  if (error) {
    return (
      <AdminPageTemplate>
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl text-red-500">Error: {error}</div>
        </div>
      </AdminPageTemplate>
    );
  }

  return (
    <AdminPageTemplate>
      <div
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-20"
        style={{ backgroundColor: "#2D2A32" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#e8e8e8" }}>
              Panel de Administración
            </h1>
            <p className="text-lg" style={{ color: "#e8e8e8" }}>
              Gestión de animales registrados
            </p>
          </div>

          {animals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl" style={{ color: "#4ECCA320" }}>
                No hay animales registrados
              </p>
            </div>
          ) : (
            <div className="bg-[#4ECCA320]/90 rounded-lg shadow-lg border-2 border-[#4ECCA3] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#4ECCA3]/50">
                  <thead className="bg-[#4ECCA3]">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider"
                      >
                        Animal
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider"
                      >
                        Información
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider"
                      >
                        Prioridad
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider"
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-bold text-[#e8e8e8] uppercase tracking-wider"
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#4ECCA320]/80 divide-y divide-[#a4ebd4]/30">
                    {animals.map((animal) => (
                      <tr
                        key={animal.id}
                        className="hover:bg-[#4ECCA320] transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#4ECCA3] flex items-center justify-center text-[#e8e8e8]">
                              <FiInfo className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#e8e8e8]">
                                {animal.name}
                              </div>
                              <div className="text-sm text-[#e8e8e8]/80">
                                ID: {animal.id}
                              </div>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              animal.status === "disponible"
                                ? "bg-[#a4ebd4] text-[#3d5950]"
                                : "bg-[#a4ebad] text-[#3d5950]"
                            }`}
                          >
                            {animal.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => deleteAnimal(animal.id)}
                            className="text-[#7ddb8f] hover:text-red-600 mr-4 transition-colors"
                            title="Eliminar animal"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                          <button
                            className="text-[#7ddb8f] hover:text-[#7ddbc8] transition-colors"
                            title="Editar animal"
                            onClick={() => openEditModal(animal)}
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
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 0}
                    className={`px-4 py-2 rounded-md font-semibold ${
                      page === 0
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-[#48e0af] text-[#294a3f] hover:bg-[#4ECCA3]"
                    } transition-colors`}
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page + 1 >= totalPages}
                    className={`px-4 py-2 rounded-md font-semibold ${
                      page + 1 >= totalPages
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-[#48e0af] text-[#294a3f] hover:bg-[#4ECCA3]"
                    } transition-colors`}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal edición */}
        {editingAnimal && (
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50
              transition-opacity duration-600 ease-out
              ${isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={closeEditModal}
          >
            <div
              className={`bg-[#2D2A32] rounded-lg shadow-lg max-w-lg w-full p-6
                transform transition-transform duration-600
                ${isModalOpen ? "ease-in scale-100" : "scale-90"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4 text-[#e8e8e8]">
                Editar Animal
              </h3>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSaving(true);
                  setEditError(null);
                  try {
                    const token = getToken();
                    const response = await fetch(
                      `http://localhost:8080/api/animales/${editingAnimal.id}`,
                      {
                        method: "PUT",
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(editForm),
                      }
                    );
                    if (!response.ok)
                      throw new Error("Error al actualizar animal");

                    const updatedAnimal = await response.json();
                    setAnimals((prev) =>
                      prev.map((a) => (a.id === updatedAnimal.id ? updatedAnimal : a))
                    );
                    closeEditModal();
                  } catch (error) {
                    setEditError(
                      error instanceof Error
                        ? error.message
                        : "Error desconocido"
                    );
                  } finally {
                    setIsSaving(false);
                  }
                }}
              >
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-[#e8e8e8] font-semibold mb-1"
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={editForm.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full border border-[#4ECCA3] rounded-md px-3 py-2
                      focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                    ref={nameInputRef}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="species"
                      className="block text-[#e8e8e8] font-semibold mb-1"
                    >
                      Especie
                    </label>
                    <input
                      type="text"
                      id="species"
                      value={editForm.species || ""}
                      onChange={(e) => handleChange("species", e.target.value)}
                      className="w-full border border-[#4ECCA3] rounded-md px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="breed"
                      className="block text-[#e8e8e8] font-semibold mb-1"
                    >
                      Raza
                    </label>
                    <input
                      type="text"
                      id="breed"
                      value={editForm.breed || ""}
                      onChange={(e) => handleChange("breed", e.target.value)}
                      className="w-full border border-[#4ECCA3] rounded-md px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="age"
                      className="block text-[#e8e8e8] font-semibold mb-1"
                    >
                      Edad
                    </label>
                    <input
                      type="number"
                      id="age"
                      value={editForm.age || ""}
                      onChange={(e) => handleChange("age", e.target.value)}
                      className="w-full border border-[#4ECCA3] rounded-md px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="priority"
                      className="block text-[#e8e8e8] font-semibold mb-1"
                    >
                      Prioridad
                    </label>
                    <select
                      id="priority"
                      value={editForm.priority || ""}
                      onChange={(e) => handleChange("priority", e.target.value)}
                      className="w-full border border-[#4ECCA3] rounded-md px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8] bg-[#2D2A32]"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="alta">Alta</option>
                      <option value="media">Media</option>
                      <option value="baja">Baja</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="status"
                    className="block text-[#e8e8e8] font-semibold mb-1"
                  >
                    Estado
                  </label>
                  <select
                    id="status"
                    value={editForm.status || ""}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-full border border-[#4ECCA3] rounded-md px-3 py-2
                      focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8] bg-[#2D2A32]"
                    required
                  >
                    <option value="">Seleccionar...</option>
                    <option value="disponible">Disponible</option>
                    <option value="adoptado">Adoptado</option>
                    <option value="en_proceso">En proceso</option>
                  </select>
                </div>

                {editError && (
                  <div className="mb-4 text-red-600 font-semibold">
                    {editError}
                  </div>
                )}

                <div className="flex justify-end items-center space-x-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 bg-[#48e0af] text-[#294a3f] font-semibold rounded-md hover:bg-[#4ECCA3] transition-colors"
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#48e0af] text-[#294a3f] font-semibold rounded-md hover:bg-[#4ECCA3] flex items-center justify-center space-x-2"
                    disabled={isSaving}
                  >
                    {isSaving && (
                      <svg
                        className="animate-spin h-5 w-5 text-[#e8e8e8]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    )}
                    <span>Guardar</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminPageTemplate>
  );
}