import { useEffect, useState, useRef } from "react";
import { AdminPageTemplate } from "../templates/AdminTemplate";
import { FiTrash2, FiEdit, FiAlertCircle, FiInfo } from "react-icons/fi";
import type { Animal } from "../../types/Animals";
import { useUser } from "../../services/users/useUser";
import AnimalTable from "../../components/tables/AnimalsTable";
import { EditAnimalModal } from "../../components/modals/EditAnimalModal";

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

  const handleCreateAnimal = () => {
    setEditingAnimal(null);
    setEditForm({});
    setEditError(null);
    setIsModalOpen(true);
  };

  const handleSubmitAnimal = async (form: Partial<Animal>) => {
    setIsSaving(true);
    try {
      const token = getToken();
      console.log(form)
      const response = await fetch(
        editingAnimal
          ? `http://localhost:8080/api/animales/${editingAnimal.id}`
          : `http://localhost:8080/api/animales`,
        {
          method: editingAnimal ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) throw new Error("Error al guardar el animal");
      await fetchAnimals(0);
      closeEditModal();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSaving(false);
    }
  };


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

  const handleChange = (field: keyof Animal, value: string | number) => {
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

  function handleSubmitEdit(form: Partial<Animal>): Promise<void> {
    throw new Error("Function not implemented.");
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
            <button
              onClick={handleCreateAnimal}
              className="mb-6 px-4 py-2 bg-[#4ECCA3] text-[#2D2A32] rounded-md font-semibold"
            >
              + Nuevo Animal
            </button>

          </div>

          {animals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl" style={{ color: "#4ECCA320" }}>
                No hay animales registrados
              </p>
            </div>
          ) : (
            <AnimalTable
              animals={animals}
              page={page}
              totalPages={totalPages}
              onDelete={deleteAnimal}
              onEdit={openEditModal}
              onPageChange={handlePageChange}
            />)}
        </div>

        {/* Modal edición */}
        {isModalOpen && (
          <EditAnimalModal
            isOpen={isModalOpen}
            animal={editingAnimal ?? undefined}
            mode={editingAnimal ? "edit" : "create"}
            editForm={editForm}
            onClose={closeEditModal}
            onChange={handleChange}
            onSubmit={handleSubmitAnimal}
            isSaving={isSaving}
            editError={editError}
          />

        )}
      </div>
    </AdminPageTemplate>
  );
}