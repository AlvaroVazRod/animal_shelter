import { useState } from "react";
import type { AnimalTag } from "../../types/Animals";
import IconUploader from "./IconUploader";
import ColorSelector from "./ColorSelector";

interface CreateTagFormProps {
    onCreateSuccess: (tag: AnimalTag) => void;
    getToken: () => string | null;
}

export default function CreateTagForm({ onCreateSuccess, getToken }: CreateTagFormProps) {
    const defaultColor = "#00ff00";
    const [newForm, setNewForm] = useState<Partial<AnimalTag>>({ color: defaultColor });
    const [newIcon, setNewIcon] = useState<File | null>(null);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [iconError, setIconError] = useState<string | null>(null);

    const handleNewIconChange = (file: File | null) => {
        if (!file) {
            setNewIcon(null);
            setIconError(null);
            return;
        }

        const isValid =
            ["image/jpeg", "image/png"].includes(file.type) && file.size <= 1024 * 1024;
        if (!isValid) {
            setIconError("Solo se permiten imágenes PNG o JPG de máximo 1MB.");
            setNewIcon(null);
            return;
        }

        setIconError(null);
        setNewIcon(file);
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
            onCreateSuccess(created);
            setNewForm({ color: defaultColor });
            setNewIcon(null);
        } catch (err) {
            setCreateError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto mb-12 bg-[#35273a] border border-[#c27aff] p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-[#e8e8e8] mb-4">Crear nueva etiqueta</h2>
            <form onSubmit={handleCreate} className="space-y-4">
                <input
                    type="text"
                    placeholder="Nombre"
                    value={newForm.name || ""}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    className="placeholder-slate-100 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ad03cb] focus:border-transparent bg-[#35273a] border-[#c27aff] text-slate-100 "
                    required
                />
                <div className="flex flex-wrap gap-4">
                    {/* Descripción */}
                    <div className="w-full md:w-1/2">
                        <textarea
                            placeholder="Descripción"
                            value={newForm.description || ""}
                            onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                            className="placeholder-slate-100 w-full h-full min-h-38 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ad03cb] focus:border-transparent resize-none bg-[#35273a] border-[#c27aff] text-slate-100"
                        />
                    </div>

                    {/* Contenedor para Color e Icono */}
                    <div className="flex gap-2">
                        {/* Color */}
                        <div className="w-1/2">
                            <ColorSelector
                                color={newForm.color || defaultColor}
                                onChange={(value) => setNewForm({ ...newForm, color: value })}
                            />
                        </div>

                        {/* Icono */}
                        <div className="w-1/2">
                            <IconUploader icon={newIcon} onIconChange={handleNewIconChange} error={iconError} />
                        </div>
                    </div>
                </div>




                {createError && <div className="text-red-500 mt-2">{createError}</div>}
                <button
                    type="submit"
                    disabled={creating}
                    className="bg-[#ad03cb] text-white px-4 py-2 rounded"
                >
                    {creating ? "Creando..." : "Crear"}
                </button>
            </form>
        </div>
    );
}
