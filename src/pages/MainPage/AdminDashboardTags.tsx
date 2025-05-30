import { useEffect, useState, useRef } from "react";
import { AdminPageTemplate } from "../templates/AdminTemplate";
import { FiTrash2, FiEdit, FiInfo } from "react-icons/fi";
import type { AnimalTag } from "../../types/Animals";
import { useUser } from "../../services/users/useUser";

export default function AdminDashboardTags() {
    const { getToken } = useUser();
    const [tags, setTags] = useState<AnimalTag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [editingTag, setEditingTag] = useState<AnimalTag | null>(null);
    const [editForm, setEditForm] = useState<Partial<AnimalTag>>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    const [newForm, setNewForm] = useState<Partial<AnimalTag>>({});
    const [newIcon, setNewIcon] = useState<File | null>(null);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const openEditModal = (tag: AnimalTag) => {
        setEditingTag(tag);
        setEditForm(tag);
        setSelectedFile(null);
        setEditError(null);
        setIsModalOpen(true);
        setTimeout(() => nameInputRef.current?.focus(), 100);
    };

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

    const handleNewIconChange = (file: File) => {
        const isValid = ["image/jpeg", "image/png"].includes(file.type) && file.size <= 1024 * 1024;
        if (!isValid) {
            setCreateError("Solo se permiten imágenes PNG o JPG de máximo 1MB.");
            setNewIcon(null);
            return;
        }
        setCreateError(null);
        setNewIcon(file);
    };

    const handleEditIconChange = (file: File) => {
        const isValid = ["image/jpeg", "image/png"].includes(file.type) && file.size <= 1024 * 1024;
        if (!isValid) {
            setEditError("Solo se permiten imágenes PNG o JPG de máximo 1MB.");
            setSelectedFile(null);
            return;
        }
        setEditError(null);
        setSelectedFile(file);
    };

    const fetchAnimals = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/tags`);
            if (!response.ok) throw new Error("Error al obtener las etiquetas");
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
        fetchAnimals();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTag) return;
        setIsSaving(true);
        setEditError(null);

        try {
            const token = getToken();
            const formData = new FormData();
            formData.append("tag", new Blob([JSON.stringify(editForm)], { type: "application/json" }));
            if (selectedFile) formData.append("icon", selectedFile);

            const response = await fetch(`http://localhost:8080/api/tags/${editingTag.id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) throw new Error("Error al actualizar la etiqueta");
            const updatedTag = await response.json();
            setTags((prev) => prev.map((a) => (a.id === updatedTag.id ? updatedTag : a)));
            closeEditModal();
        } catch (error) {
            setEditError(error instanceof Error ? error.message : "Error desconocido");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        setCreateError(null);

        try {
            const token = getToken();
            const formData = new FormData();
            formData.append("tag", new Blob([JSON.stringify(newForm)], { type: "application/json" }));
            if (newIcon) formData.append("icon", newIcon);

            const res = await fetch("http://localhost:8080/api/tags", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error("Error al crear etiqueta");
            const created = await res.json();
            setTags((prev) => [...prev, created]);
            setNewForm({});
            setNewIcon(null);
        } catch (err) {
            setCreateError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setCreating(false);
        }
    };

    return (
        <AdminPageTemplate>
            <div className="max-w-7xl mx-auto mb-12 bg-[#4ECCA320]/90 border border-[#4ECCA3] p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-[#e8e8e8] mb-4">Crear nueva etiqueta</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={newForm.name || ""}
                        onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                        className="w-full px-3 py-2 rounded border text-[#e8e8e8] bg-transparent border-[#4ECCA3]"
                        required
                    />
                    <textarea
                        placeholder="Descripción"
                        value={newForm.description || ""}
                        onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                        className="w-full px-3 py-2 rounded border text-[#e8e8e8] bg-transparent border-[#4ECCA3]"
                    />
                    <input
                        type="color"
                        value={newForm.color || "#4ECCA3"}
                        onChange={(e) => setNewForm({ ...newForm, color: e.target.value })}
                        className="w-full h-10 rounded border border-[#4ECCA3]"
                    />
                    <input
                        type="file"
                        id="iconUploadNew"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setNewIcon(e.target.files?.[0] || null)}
                    />
                    <div
                        onClick={() => document.getElementById("iconUploadNew")?.click()}
                        className="cursor-pointer border border-[#4ECCA3] rounded text-center py-2 text-white"
                    >
                        {newIcon?.name || "+ Subir icono"}
                    </div>
                    {createError && <div className="text-red-500 mt-2">{createError}</div>}
                    <button
                        type="submit"
                        disabled={creating}
                        className="bg-[#4ECCA3] text-black px-4 py-2 rounded hover:bg-[#3bb995]"
                    >
                        {creating ? "Creando..." : "Crear"}
                    </button>
                </form>
            </div>

            {/* Listado de etiquetas */}
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold text-[#e8e8e8] mb-6">Etiquetas</h2>
                <div className="overflow-x-auto bg-[#4ECCA320]/90 rounded-lg shadow-lg border border-[#4ECCA3]">
                    <table className="min-w-full divide-y divide-[#4ECCA3]/50">
                        <thead className="bg-[#4ECCA3]">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-[#e8e8e8] uppercase">Nombre</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-[#e8e8e8] uppercase">Color</th>
                                <th className="px-4 py-2 text-left text-xs font-semibold text-[#e8e8e8] uppercase">Descripción</th>
                                <th className="px-4 py-2 text-center text-xs font-semibold text-[#e8e8e8] uppercase">Icono</th>
                                <th className="px-4 py-2 text-right text-xs font-semibold text-[#e8e8e8] uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#a4ebd4]/30">
                            {tags.map((tag) => (
                                <tr key={tag.id} className="hover:bg-[#4ECCA320]">
                                    <td className="px-4 py-2 text-[#e8e8e8]">{tag.name}</td>
                                    <td className="px-4 py-2"><div className="h-4 w-4 rounded-full border" style={{ backgroundColor: tag.color }}></div></td>
                                    <td className="px-4 py-2 text-[#e8e8e8]">{tag.description}</td>
                                    <td className="px-4 py-2 text-center">
                                        {tag.icon ? (
                                            <img src={`http://localhost:8080/images/tags/${tag.icon}`} alt="icon" className="h-6 w-6 mx-auto" />
                                        ) : (
                                            <FiInfo className="text-[#4ECCA3] mx-auto" />
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <button onClick={() => openEditModal(tag)} className="text-[#4ECCA3] hover:text-white mr-2">
                                            <FiEdit />
                                        </button>
                                        <button onClick={() => deleteAnimal(tag.id)} className="text-red-500 hover:text-white">
                                            <FiTrash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de edición */}
            {editingTag && (
                <div className={`fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 ${isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={closeEditModal}>
                    <div className={`bg-[#2D2A32] rounded-lg shadow-lg max-w-lg w-full p-6 transform transition-transform duration-600 ${isModalOpen ? "ease-in scale-100" : "scale-90"}`} onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-2xl font-bold mb-4 text-[#e8e8e8]">Editar Etiqueta</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={editForm.name || ""}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="w-full px-3 py-2 rounded border text-[#e8e8e8] bg-transparent border-[#4ECCA3]"
                                ref={nameInputRef}
                                required
                            />
                            <textarea
                                placeholder="Descripción"
                                value={editForm.description || ""}
                                onChange={(e) => handleChange("description", e.target.value)}
                                className="w-full px-3 py-2 rounded border text-[#e8e8e8] bg-transparent border-[#4ECCA3]"
                            />
                            <input
                                type="color"
                                value={editForm.color || "#4ECCA3"}
                                onChange={(e) => handleChange("color", e.target.value)}
                                className="w-full h-10 rounded border border-[#4ECCA3]"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                id="iconUpload"
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                className="hidden"
                            />
                            <div onClick={() => document.getElementById("iconUpload")?.click()} className="cursor-pointer border border-[#4ECCA3] rounded text-center py-2 text-white">
                                {selectedFile?.name || editForm.icon || "+ Subir icono"}
                            </div>
                            {editError && <div className="text-red-500 mt-2">{editError}</div>}
                            <div className="flex justify-end mt-4">
                                <button type="submit" className="bg-[#4ECCA3] text-black px-4 py-2 rounded hover:bg-[#3bb995]">
                                    {isSaving ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminPageTemplate>
    );
}
