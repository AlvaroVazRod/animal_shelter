import React, { useEffect, type RefObject } from "react";
import type { AnimalTag } from "../../types/Animals";
import IconUploader from "../forms/IconUploader";
import ColorSelector from "../forms/ColorSelector";

interface EditTagModalProps {
    isOpen: boolean;
    editingTag: AnimalTag | null;
    editForm: Partial<AnimalTag>;
    onClose: () => void;
    onChange: (field: keyof AnimalTag, value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    selectedFile: File | null;
    setSelectedFile: (fileOrUrl: string | File | null) => void;
    editError: string | null;
    isSaving: boolean;
    nameInputRef?: RefObject<HTMLInputElement | null>;
}

const EditTagModal: React.FC<EditTagModalProps> = ({
    isOpen,
    editingTag,
    editForm,
    onClose,
    onChange,
    onSubmit,
    selectedFile,
    setSelectedFile,
    editError,
    isSaving,
    nameInputRef,
}) => {
    const internalNameInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                (nameInputRef ?? internalNameInputRef).current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setSelectedFile(null);
        }
    }, [isOpen, setSelectedFile, nameInputRef]);

    if (!editingTag) return null;

    return (
        <div
            className={`fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            onClick={onClose}
        >
            <div
                className={`bg-[#3e2443] border border-[#c27aff] rounded-lg shadow-lg max-w-3xl w-full p-6 transform transition-transform duration-500 ${isOpen ? "ease-in scale-100" : "scale-90"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold mb-4 text-[#e8e8e8]">Editar Etiqueta</h3>
                <form onSubmit={onSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={editForm.name || ""}
                        onChange={(e) => onChange("name", e.target.value)}
                        className="placeholder-slate-100 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ad03cb] focus:border-transparent bg-[#35273a] border-[#c27aff] text-slate-100 "
                        ref={nameInputRef ?? internalNameInputRef}
                        required
                    />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Descripción: ocupa toda la fila en móvil, 2 columnas en md+ */}
                        <div className="w-full md:col-span-2">
                            <textarea
                                placeholder="Descripción"
                                value={editForm.description || ""}
                                onChange={(e) => onChange("description", e.target.value)}
                                className="placeholder-slate-100 w-full h-full min-h-38 px-3 py-2 border border-[#c27aff] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ad03cb] focus:border-transparent resize-none bg-[#35273a] text-slate-100"
                            />
                        </div>

                        {/* Color + Icono: juntos en fila, ocupan 1 columna cada uno en md+ */}
                        <div className="custom-color-icon-grid md:col-span-2 gap-4">
                            <div>
                                <ColorSelector
                                    color={editForm.color || "#00ff00"}
                                    onChange={(value) => onChange("color", value)}
                                />
                            </div>
                            <div>
                                <IconUploader
                                    icon={selectedFile}
                                    iconUrl={editingTag.icon}
                                    onIconChange={(fileOrUrl) => {
                                        if (fileOrUrl instanceof File) {
                                            setSelectedFile(fileOrUrl);
                                        } else {
                                            setSelectedFile(null);
                                            // setIsImageDeleted(true);
                                        }
                                    }}
                                    error={null}
                                />
                            </div>
                        </div>
                    </div>


                    {editError && <div className="text-red-500 mt-2">{editError}</div>}

                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="bg-[#ad03cb] text-white px-4 py-2 rounded"
                            disabled={isSaving}
                        >
                            {isSaving ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTagModal;
