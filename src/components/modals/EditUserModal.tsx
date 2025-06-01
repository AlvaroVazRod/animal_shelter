import { useRef, useEffect } from "react";
import type { UserDTO } from "../../types/UserDTO";

interface EditUserModalProps {
    isOpen: boolean;
    form: Partial<UserDTO>;
    isSaving: boolean;
    error: string | null;
    onClose: () => void;
    onChange: (field: keyof UserDTO, value: string) => void;
    onSubmit: () => void;
    mode: 'edit' | 'create'; // Nuevo prop para controlar título y modo
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
    isOpen,
    form,
    isSaving,
    error,
    onClose,
    onChange,
    onSubmit,
    mode,
}) => {
    const usernameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => usernameInputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    return (
        <div
            className={`fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50
        transition-opacity duration-600 ease-out ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            onClick={onClose}
        >
            <div
                className={`bg-[#2D2A32] rounded-lg shadow-lg max-w-lg w-full p-6
                    transform transition-transform duration-600 ${isOpen ? "ease-in scale-100" : "scale-90"
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-2xl font-bold mb-4 text-[#e8e8e8]">
                    {mode === "edit" ? "Editar Usuario" : "Crear Usuario"}
                </h3>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    <div className="mb-4">
                        <label className="block text-[#e8e8e8] font-semibold mb-1">Usuario</label>
                        <input
                            type="text"
                            value={form.username || ""}
                            onChange={(e) => onChange("username", e.target.value)}
                            ref={usernameInputRef}
                            className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-[#e8e8e8] font-semibold mb-1">Email</label>
                        <input
                            type="email"
                            value={form.email || ""}
                            onChange={(e) => onChange("email", e.target.value)}
                            className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                            required
                        />
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[#e8e8e8] font-semibold mb-1">Nombre</label>
                            <input
                                type="text"
                                value={form.name || ""}
                                onChange={(e) => onChange("name", e.target.value)}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-[#e8e8e8] font-semibold mb-1">Apellido</label>
                            <input
                                type="text"
                                value={form.surname || ""}
                                onChange={(e) => onChange("surname", e.target.value)}
                                className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-[#e8e8e8] font-semibold mb-1">Teléfono</label>
                        <input
                            type="tel"
                            value={form.phone || ""}
                            onChange={(e) => onChange("phone", e.target.value)}
                            className="w-full border border-[#4ECCA3] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                            placeholder="Opcional"
                        />
                    </div>

                    {error && (
                        <div className="mb-4 text-red-600 font-semibold">{error}</div>
                    )}

                    <div className="flex justify-end space-x-4">
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
                            <span>{mode === 'edit' ? 'Guardar' : 'Crear'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
