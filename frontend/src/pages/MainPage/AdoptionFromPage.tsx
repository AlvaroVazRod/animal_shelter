import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Animal } from "../../types/Animals";
import { DefaultPageTemplate } from "../templates/DefaultTemplate";
import { useUser } from "../../services/users/useUser";

export default function AdoptionFormPage() {
    const { id } = useParams();
    const [animal, setAnimal] = useState<Animal | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getToken } = useUser();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        employment: "",
        hasOtherPets: false,
        agreeToTerms: false,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchAnimal = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/animales/${id}`);
                if (!res.ok) throw new Error("No se pudo cargar el animal");
                const data = await res.json();
                setAnimal(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoading(false);
            }
        };
        fetchAnimal();
    }, [id]);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};
        if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";
        if (!formData.email.trim()) newErrors.email = "El email es obligatorio";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const token = getToken(); // <-- Aquí recuperas el token

            const response = await fetch("http://localhost:8080/api/forms/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // <-- Lo envías en el header
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("No se pudo enviar el formulario");

            alert("¡Formulario enviado con éxito!");
            setFormData({
                name: "",
                email: "",
                phone: "",
                address: "",
                employment: "",
                hasOtherPets: false,
                agreeToTerms: false,
            });
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error al enviar el formulario"
            );
        }
    };


    if (loading) return <DefaultPageTemplate>Cargando...</DefaultPageTemplate>;
    if (error) return <DefaultPageTemplate>Error: {error}</DefaultPageTemplate>;

    return (
        <DefaultPageTemplate>
            <div className="min-h-screen flex justify-center items-start pt-24 pb-24 px-4 animate-fade-in">
                <div className="w-full max-w-xl p-8 bg-white/90 rounded-2xl shadow-lg border border-[#AD03CB] backdrop-blur-sm">
                    <h1 className="text-3xl font-extrabold text-[#AD03CB] mb-6 text-center">
                        Solicitud de adopción para {animal?.name}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <input
                                type="text"
                                placeholder="Nombre completo"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className={`w-full border px-4 py-3 rounded-lg shadow-sm transition ${errors.name
                                    ? "border-red-500 ring-2 ring-red-300"
                                    : "border-gray-300 focus:ring-2 focus:ring-[#AD03CB]"
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                className={`w-full border px-4 py-3 rounded-lg shadow-sm transition ${errors.email
                                    ? "border-red-500 ring-2 ring-red-300"
                                    : "border-gray-300 focus:ring-2 focus:ring-[#AD03CB]"
                                    }`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <input
                            type="tel"
                            placeholder="Teléfono"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AD03CB] transition"
                        />

                        <textarea
                            placeholder="Dirección"
                            value={formData.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AD03CB] transition"
                        />

                        <select
                            value={formData.employment}
                            onChange={(e) => handleChange("employment", e.target.value)}
                            className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AD03CB] transition"
                        >
                            <option value="">¿Estás trabajando?</option>
                            <option value="yes">Sí</option>
                            <option value="no">No</option>
                        </select>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.hasOtherPets}
                                onChange={(e) => handleChange("hasOtherPets", e.target.checked)}
                            />
                            <label>Tengo otras mascotas</label>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={(e) => handleChange("agreeToTerms", e.target.checked)}
                            />
                            <label>Acepto los términos y condiciones</label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#AD03CB] text-white font-bold py-3 rounded-lg hover:bg-[#7a0299] transition"
                        >
                            Enviar Solicitud
                        </button>
                    </form>
                </div>
            </div>
        </DefaultPageTemplate>
    );
}
