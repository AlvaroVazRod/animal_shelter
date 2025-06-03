import { useState, useEffect, type FormEvent } from "react";
import { useUser } from "../services/users/useUser";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";

interface EditData {
    username: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    newsletter: boolean;
}

interface EditErrors {
    nombre?: string;
    apellido?: string;
    email?: string;
    telefono?: string;
    form?: string;
}

export default function EditProfile() {
    const { user, updateUser } = useUser();
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState<EditData>({
        username: "",
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        newsletter: false,
    });

    const [errors, setErrors] = useState<EditErrors>({});
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username || "",
                nombre: user.name || "",
                apellido: user.surname || "",
                email: user.email || "",
                telefono: user.phone || "",
                newsletter: user.newsletter || false,
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const validate = () => {
        const newErrors: EditErrors = {};
        if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido";
        if (!formData.apellido.trim()) newErrors.apellido = "Apellido es requerido";
        if (!formData.email) newErrors.email = "Email es requerido";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Email no válido";
        if (formData.telefono && !/^[0-9+ ]+$/.test(formData.telefono)) newErrors.telefono = "Teléfono no válido";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setIsSaving(true);
        setSuccess(false);
        try {
            await updateUser({
                username: formData.username,
                name: formData.nombre,
                surname: formData.apellido,
                email: formData.email,
                phone: formData.telefono || null,
                newsletter: formData.newsletter,
            });
            setSuccessMessage("✅ Perfil actualizado correctamente.");
        } catch (err) {
            setErrors({ form: "Ocurrió un error al guardar los cambios." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DefaultPageTemplate>
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <form
                    onSubmit={handleSubmit}
                    className="max-w-md w-full bg-white/90 p-8 rounded-lg shadow-lg border-2 border-[#AD03CB] space-y-4"
                >
                    <h2 className="text-3xl font-bold text-[#AD03CB] text-center mb-4">
                        Editar Perfil
                    </h2>

                    {errors.form && (
                        <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
                            {errors.form}
                        </div>
                    )}

                    {successMessage && (
                        <div className="bg-green-100 text-green-700 p-2 rounded text-sm text-center">
                            {successMessage}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[#AD03CB]">Usuario</label>
                        <input
                            name="username"
                            value={formData.username}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#AD03CB]">Nombre*</label>
                        <input
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-[#AD03CB] rounded-md bg-[#F6F0FA]/70 text-[#AD03CB]"
                        />
                        {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#AD03CB]">Apellido*</label>
                        <input
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-[#AD03CB] rounded-md bg-[#F6F0FA]/70 text-[#AD03CB]"
                        />
                        {errors.apellido && <p className="text-red-500 text-sm">{errors.apellido}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#AD03CB]">Email*</label>
                        <input
                            name="email" // ✅ corregido
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-[#AD03CB] rounded-md bg-[#F6F0FA]/70 text-[#AD03CB]"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#AD03CB]">Teléfono</label>
                        <input
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-[#AD03CB] rounded-md bg-[#F6F0FA]/70 text-[#AD03CB]"
                        />
                        {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            id="newsletter"
                            name="newsletter"
                            type="checkbox"
                            checked={formData.newsletter}
                            onChange={handleChange}
                            className="h-4 w-4 text-[#AD03CB] focus:ring-[#AD03CB] border-[#AD03CB] rounded"
                        />
                        <label htmlFor="newsletter" className="ml-2 text-sm text-[#AD03CB]">
                            Suscribirme al boletín de noticias
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full py-2 px-4 bg-[#AD03CB] text-white rounded-md hover:bg-[#9503B0] transition-colors"
                    >
                        {isSaving ? "Guardando..." : "Guardar cambios"}
                    </button>

                </form>
            </div>
        </DefaultPageTemplate>
    );
}
