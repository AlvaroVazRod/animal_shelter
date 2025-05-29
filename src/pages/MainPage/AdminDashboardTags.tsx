import { useEffect, useState, useRef } from "react";
import { AdminPageTemplate } from "../templates/AdminTemplate";
import { FiTrash2, FiEdit, FiAlertCircle, FiInfo } from "react-icons/fi";
import type { AnimalTag } from "../../types/Animals";
import { useUser } from "../../services/users/useUser";

export default function AdminDashboardTags() {
    const { getToken } = useUser();
    const [tags, setTags] = useState<AnimalTag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Edición de animales
    const [editingTag, setEditingTag] = useState<AnimalTag | null>(null);
    const [editForm, setEditForm] = useState<Partial<AnimalTag>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    // Abrir modal con animación y focus
    const openEditModal = (tag: AnimalTag) => {
        setEditingTag(tag);
        setEditForm(tag);
        setEditError(null);
        setIsModalOpen(true);
        setTimeout(() => nameInputRef.current?.focus(), 100);
    };

    // Cerrar modal con animación
    const closeEditModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setEditingTag(null);
            setEditForm({});
            setEditError(null);
        }, 300);
    };

    const handleChange = (field: keyof AnimalTag, value: string) => {
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

            const response = await fetch(`http://localhost:8080/api/tags`);

            if (!response.ok) throw new Error("Error al obtener los animales");
            const data = await response.json();
            setTags(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    const deleteAnimal = async (id: number) => {
        if (!window.confirm("¿Estás seguro de eliminar esta etiqueta?")) return;

        try {
            const token = getToken();
            const response = await fetch(`http://localhost:8080/api/tags/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error("Error al eliminar etiqueta");

            setTags((prev) => prev.filter((a) => a.id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al eliminar etiqueta");
        }
    };

    useEffect(() => {
        fetchAnimals(0);
    }, []);

    if (loading) {
        return (
            <AdminPageTemplate>
                <div className="flex justify-center items-center h-64">
                    <div className="text-2xl" style={{ color: "#4ECCA320" }}>
                        Cargando Etiquetas...
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
                        <h1
                            className="text-4xl font-bold mb-2"
                            style={{ color: "#e8e8e8" }}
                        >
                            Panel de Administración
                        </h1>
                        <p className="text-lg" style={{ color: "#e8e8e8" }}>
                            Gestión de etiquetas creadas
                        </p>
                    </div>

                    {tags.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-xl" style={{ color: "#4ECCA320" }}>
                                No hay etiquetas creadas
                            </p>
                        </div>
                    ) : (
                        <div className="bg-[#4ECCA320]/90 rounded-lg shadow-lg border-2 border-[#4ECCA3] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-fixed divide-y divide-[#4ECCA3]/50">
                                    <thead className="bg-[#4ECCA3]">
                                        <tr>
                                            <th className="w-[15%] px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                                Etiqueta
                                            </th>
                                            <th className="w-[10%] px-6 py-3 text-center text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                                Color
                                            </th>
                                            <th className="w-[40%] px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                                Descripción
                                            </th>
                                            <th className="w-[15%] px-6 py-3 text-center text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                                Indicador
                                            </th>
                                            <th className="w-[20%] px-6 py-3 text-right text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-[#4ECCA320]/80 divide-y divide-[#a4ebd4]/30">
                                        {tags.map((tag) => (
                                            <tr
                                                key={tag.id}
                                                className="hover:bg-[#4ECCA320] transition-colors"
                                            >
                                                <td className="w-[15%] px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-[#e8e8e8]">
                                                                {tag.name}
                                                            </div>
                                                            <div className="text-sm text-[#e8e8e8]/80">
                                                                ID: {tag.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="w-[10%] px-6 py-4 whitespace-nowrap">
                                                    <div className="flex justify-center items-center h-full">
                                                        <div
                                                            className="h-5 w-5 rounded-full border border-white shadow-md"
                                                            style={{ backgroundColor: tag.color }}
                                                        ></div>
                                                    </div>
                                                </td>
                                                <td className="w-[40%] px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-[#e8e8e8]">
                                                        {tag.description}
                                                    </div>
                                                </td>
                                                <td className="w-[15%] px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="flex justify-center items-center h-full">
                                                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-md">
                                                            {!tag.icon ? (
                                                                <FiInfo className="text-[#4ECCA3] text-[1.625rem]" />
                                                            ) : (
                                                                <img
                                                                    height={18}
                                                                    width={18}
                                                                    src={"/" + tag.icon}
                                                                    alt={tag.name}
                                                                ></img>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="w-[20%] px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => deleteAnimal(tag.id)}
                                                        className="text-[#7ddb8f] hover:text-red-600 mr-4 transition-colors"
                                                        title="Eliminar tag"
                                                    >
                                                        <FiTrash2 className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        className="text-[#7ddb8f] hover:text-[#7ddbc8] transition-colors"
                                                        title="Editar tag"
                                                        onClick={() => openEditModal(tag)}
                                                    >
                                                        <FiEdit className="h-5 w-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
                {/* Modal edición */}
                {editingTag && (
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
                            <h3 className="text-2xl font-bold mb-4 text-[#e8e8e8]">Editar Etiqueta</h3>

                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    setIsSaving(true);
                                    setEditError(null);

                                    try {
                                        const token = getToken(); // Asegúrate de que esta función obtenga tu JWT u otro método de autenticación.

                                        const response = await fetch(`http://localhost:8080/api/tags/${editingTag.id}`, {
                                            method: "PUT",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify(editForm),
                                        });

                                        if (!response.ok) {
                                            throw new Error("Error al actualizar la etiqueta");
                                        }

                                        const updatedTag = await response.json();

                                        // Actualiza el estado si es necesario
                                        setTags((prev) =>
                                            prev.map((a) => (a.id === updatedTag.id ? updatedTag : a))
                                        );

                                        closeEditModal();
                                    } catch (error) {
                                        setEditError(error instanceof Error ? error.message : "Error desconocido");
                                    } finally {
                                        setIsSaving(false);
                                    }
                                }}
                            >


                                {/* Nombre */}
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

                                {/* Descripción */}
                                <div className="mb-4">
                                    <label
                                        htmlFor="description"
                                        className="block text-[#e8e8e8] font-semibold mb-1"
                                    >
                                        Descripción
                                    </label>
                                    <textarea
                                        id="description"
                                        value={editForm.description || ""}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        className="w-full border border-[#4ECCA3] rounded-md px-3 py-2
                focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex mb-12">
                                    {/* Color */}
                                    <div className="flex-1 flex flex-col items-center">
                                        <label
                                            htmlFor="color"
                                            className="block text-[#e8e8e8] font-semibold mb-1 text-center"
                                        >
                                            Color
                                        </label>
                                        <input
                                            type="color"
                                            id="color"
                                            value={editForm.color || "#4ECCA3"}
                                            onChange={(e) => handleChange("color", e.target.value)}
                                            className="w-20 h-20 p-0 border border-[#4ECCA3] rounded cursor-pointer"
                                        />
                                    </div>

                                    {/* Icono / Foto */}
                                    <div className="flex-1 flex flex-col items-center">
                                        <label
                                            htmlFor="iconUpload"
                                            className="block text-[#e8e8e8] font-semibold mb-1 text-center cursor-pointer"
                                        >
                                            Icono
                                        </label>

                                        <div
                                            className="relative w-20 h-20 cursor-pointer rounded border border-[#4ECCA3]
                 hover:bg-[#4ECCA3]/20 hover:shadow-lg transition-colors transition-shadow
                 flex items-center justify-center"
                                            title="Click para cambiar la imagen"
                                            onClick={() => document.getElementById("iconUpload")?.click()}
                                        >
                                            {editForm.icon ? (
                                                <img
                                                    src={editForm.icon}
                                                    alt="Icono actual"
                                                    className="object-contain w-[70%] h-[70%] rounded"
                                                />
                                            ) : (
                                                <div className="w-[70%] h-[70%] bg-[#444] flex items-center justify-center text-gray-400 rounded">
                                                    + Subir
                                                </div>
                                            )}

                                            {editForm.icon && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleChange("icon", "");
                                                    }}
                                                    className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 transition"
                                                    title="Eliminar icono"
                                                >
                                                    ×
                                                </button>
                                            )}

                                            <input
                                                type="file"
                                                id="iconUpload"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onload = (ev) => {
                                                            handleChange("icon", ev.target?.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>


                                {editError && (
                                    <div className="mb-4 text-red-600 font-semibold">{editError}</div>
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
