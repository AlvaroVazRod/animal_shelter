import { useRef, useEffect, useState } from "react";
import type { Animal, AnimalTag } from "../../types/Animals";
import { ImageUploader } from "../forms/ImageUploader";
import { useUser } from "../../services/users/useUser";
import { AnimalTagsEditor } from "../forms/AnimalTagsEditor";
import { FiPlus } from "react-icons/fi";
import { useTags } from "../../services/tags/useTags";
import { AnimalAddTags } from "../forms/AnimalAddTags";

interface EditAnimalModalProps {
    isOpen: boolean;
    animal?: Animal;
    mode: "edit" | "create";
    editForm: Partial<Animal>;
    onImageUpload: (file: File | null) => void;
    onClose: () => void;
    onChange: (field: keyof Animal, value: string | number) => void;
    onSubmit: (form: Partial<Animal>) => Promise<void>;
    onTagsChange: (tags: AnimalTag[] | null) => void;
    isSaving: boolean;
    editError: string | null;
}

export const EditAnimalModal = ({
    isOpen,
    mode,
    editForm,
    onImageUpload,
    onClose,
    onChange,
    onSubmit,
    onTagsChange,
    isSaving,
    editError,
}: EditAnimalModalProps) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [animalTags, setAnimalTags] = useState<AnimalTag[] | null>(null);
    const [showTagsSearch, setShowTagsSearch] = useState<boolean>(false);
    const { getToken } = useUser();
    const { tags, loading, fetchTags } = useTags({ getToken });

    const handleTagDelete = (id: number) => {
        setAnimalTags((prev) => {
            const updated = prev ? prev.filter((tag) => tag.id !== id) : null;
            onTagsChange(updated); // Aquí se llama correctamente
            return updated;
        });
    };

    const handleTagAdded = (id: number) => {
        const newTag = tags?.find(tag => tag.id === id);
        if (!newTag) return;

        // Si animalTags es null, creamos una nueva lista con solo el newTag
        if (!animalTags) {
            setAnimalTags([newTag]);
            onTagsChange([newTag]);
            return;
        }

        // Evitar duplicados si ya existe el tag
        const isAlreadyAdded = animalTags.some(tag => tag.id === id);
        if (isAlreadyAdded) return;

        const updatedTags = [...animalTags, newTag];
        setAnimalTags(updatedTags);
        onTagsChange(updatedTags);
    };


    // Cuando cambia la imagen, actualizamos también el campo 'image' con la URL local (opcional)
    const handleImageChange = (file: File | null) => {
        setImageFile(file);
        if (file) {
            onImageUpload(file);
            onChange("image", URL.createObjectURL(file));
        } else {
            onImageUpload(null);
            onChange("image", "");
        }
    };

    const getAnimalTags = async () => {
        const token = getToken();
        const response = await fetch(
            `http://localhost:8080/api/tags/animal/${editForm.id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.ok) {
            const data = await response.json();
            return data;
        }
        return "";
    };

    const filteredTags = tags?.filter(tag => {
        // Retener solo los tags cuyo id NO esté en animalTags
        return !animalTags?.some(animalTag => animalTag.id === tag.id);
    });


    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        console.log(animalTags)
    }, [animalTags]);

    useEffect(() => {
        const fetchAnimalTags = async () => {
            const data = await getAnimalTags();
            setAnimalTags(data);
        };

        if (isOpen && editForm.id) {
            fetchAnimalTags(); // ✅
            setTimeout(() => nameInputRef.current?.focus(), 100);
            setImageFile(null);
        }
    }, [isOpen, editForm.id]); // También asegúrate de incluir editForm.id

    return (
        <div
            className={`fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50
            transition-opacity duration-600 ease-out
            ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={onClose}
        >
            <div
                className={`bg-[#2D2A32] rounded-lg shadow-lg max-w-3xl w-full p-6
                transform transition-transform duration-600
                ${isOpen ? "ease-in scale-100" : "scale-90"}`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold mb-4 text-[#e8e8e8]">
                    {mode === "edit" ? "Editar Animal" : "Crear Animal"}
                </h3>

                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await onSubmit(editForm);
                    }}
                >
                    {/* Nombre + Precios */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-[#e8e8e8] font-semibold mb-1"
                            >
                                Nombre
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={editForm.name ?? ""}
                                onChange={(e) => onChange("name", e.target.value)}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 text-[#e8e8e8] bg-[#2D2A32]"
                                ref={nameInputRef}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="adoptionPrice"
                                    className="block text-[#e8e8e8] font-semibold mb-1"
                                >
                                    Adopción ($)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    id="adoptionPrice"
                                    value={
                                        editForm.adoptionPrice !== undefined
                                            ? editForm.adoptionPrice
                                            : ""
                                    }
                                    onChange={(e) =>
                                        onChange("adoptionPrice", parseFloat(e.target.value))
                                    }
                                    className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 text-[#e8e8e8] bg-[#2D2A32]"
                                    min="0"
                                    required
                                />
                            </div>

                        </div>
                    </div>

                    {/* Especie, Raza, Edad */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="species"
                                className="block text-[#e8e8e8] font-semibold mb-1"
                            >
                                Especie
                            </label>
                            <select
                                id="species"
                                value={editForm.species ? editForm.species.toLowerCase() : ""}
                                onChange={(e) => onChange("species", e.target.value)}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 bg-[#2D2A32] text-[#e8e8e8]"
                                required
                            >
                                <option value="">Seleccionar...</option>
                                <option value="dog">Perro</option>
                                <option value="cat">Gato</option>
                            </select>
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
                                onChange={(e) => onChange("breed", e.target.value)}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 bg-[#2D2A32] text-[#e8e8e8]"
                                required
                            />
                        </div>
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
                                onChange={(e) => onChange("age", parseInt(e.target.value))}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 bg-[#2D2A32] text-[#e8e8e8]"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    {/* Género, Estado, Peso */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="gender"
                                className="block text-[#e8e8e8] font-semibold mb-1"
                            >
                                Género
                            </label>
                            <select
                                id="gender"
                                value={editForm.gender || ""}
                                onChange={(e) => onChange("gender", e.target.value)}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 bg-[#2D2A32] text-[#e8e8e8]"
                                required
                            >
                                <option value="">Seleccionar...</option>
                                <option value="masculino">Masculino</option>
                                <option value="femenino">Femenino</option>
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-[#e8e8e8] font-semibold mb-1"
                            >
                                Estado
                            </label>
                            <select
                                id="status"
                                value={editForm.status || ""}
                                onChange={(e) => onChange("status", e.target.value)}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 bg-[#2D2A32] text-[#e8e8e8]"
                                required
                            >
                                <option value="">Seleccionar...</option>
                                <option value="active">Disponible</option>
                                <option value="requires_funding">Adoptado</option>
                                <option value="draft">En proceso</option>
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="weight"
                                className="block text-[#e8e8e8] font-semibold mb-1"
                            >
                                Peso (kg)
                            </label>
                            <input
                                type="number"
                                id="weight"
                                value={editForm.weight || ""}
                                onChange={(e) => onChange("weight", parseFloat(e.target.value))}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 bg-[#2D2A32] text-[#e8e8e8]"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Color y Fecha de Llegada */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="color"
                                className="block text-[#e8e8e8] font-semibold mb-1"
                            >
                                Color
                            </label>
                            <input
                                type="text"
                                id="color"
                                value={editForm.color || ""}
                                onChange={(e) => onChange("color", e.target.value)}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 bg-[#2D2A32] text-[#e8e8e8]"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="arrivalDate"
                                className="block text-[#e8e8e8] font-semibold mb-1"
                            >
                                Fecha de Llegada
                            </label>
                            <input
                                type="date"
                                id="arrivalDate"
                                value={
                                    editForm.arrivalDate ? editForm.arrivalDate.slice(0, 10) : ""
                                }
                                onChange={(e) => onChange("arrivalDate", e.target.value)}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 bg-[#2D2A32] text-[#e8e8e8]"
                                required
                            />
                        </div>
                    </div>

                    {/* Altura y Largo */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label
                                htmlFor="height"
                                className="block text-[#e8e8e8] font-semibold mb-1"
                            >
                                Altura (cm)
                            </label>
                            <input
                                type="number"
                                id="height"
                                value={editForm.height || ""}
                                onChange={(e) => onChange("height", parseFloat(e.target.value))}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 bg-[#2D2A32] text-[#e8e8e8]"
                                min="0"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="length"
                                className="block text-[#e8e8e8] font-semibold mb-1"
                            >
                                Largo (cm)
                            </label>
                            <input
                                type="number"
                                id="length"
                                value={editForm.length || ""}
                                onChange={(e) => onChange("length", parseFloat(e.target.value))}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 bg-[#2D2A32] text-[#e8e8e8]"
                                min="0"
                            />
                        </div>
                    </div>

                    {/* Descripción + Imagen */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {/* Descripción */}
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-[#e8e8e8] font-semibold mb-1"
                            >
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                value={editForm.description || ""}
                                onChange={(e) => onChange("description", e.target.value)}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 bg-[#2D2A32] text-[#e8e8e8] resize-none"
                                rows={5}
                                required
                            />
                        </div>

                        {/* Imagen */}
                        <div>
                            <label className="block text-[#e8e8e8] font-semibold mb-1">
                                Imagen
                            </label>
                            <ImageUploader
                                imageFile={imageFile}
                                imageUrl={editForm.image || null}
                                onImageChange={handleImageChange}
                                error={editError} // o un error específico para imagen
                            />
                        </div>

                        {/* Etiquetas */}
                        <div className="relative">
                            {" "}
                            {/* Contenedor relativo para referencia del absolute */}
                            <div className="flex justify-between items-center mb-1">
                                <label
                                    htmlFor="description"
                                    className="text-[#e8e8e8] font-semibold"
                                >
                                    Etiquetas
                                </label>
                                <button
                                    onClick={() => setShowTagsSearch((prev) => !prev)}
                                    className="bg-white/20 hover:bg-white/30 text-blue-700 hover:text-blue-900 p-1 rounded-full transition-colors"
                                    title="Añadir etiqueta"
                                >
                                    <FiPlus
                                        className="w-4 h-4"
                                        style={
                                            showTagsSearch
                                                ? { color: "#ff0000" }
                                                : { color: "#48e0af" }
                                        }
                                    />
                                </button>
                            </div>
                            {showTagsSearch && (
                                <AnimalAddTags tags={filteredTags} onTagAdded={handleTagAdded} />
                            )}
                            <AnimalTagsEditor
                                tags={animalTags}
                                onTagDeleted={handleTagDelete}
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {editError && (
                        <div className="mb-4 text-red-600 font-semibold">{editError}</div>
                    )}

                    {/* Botones */}
                    <div className="flex justify-end items-center space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
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
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>
                            )}
                            <span>{mode === "edit" ? "Guardar" : "Crear"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
