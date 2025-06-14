import { useState, type FormEvent } from "react";
import { useUser } from "../services/users/useUser";
import { useNavigate, Link } from "react-router-dom";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";

interface RegisterData {
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  telefono?: string;
  newsletter: boolean;
}

interface RegisterErrors {
  nombre?: string;
  apellido?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  telefono?: string;
  form?: string;
}

export default function Register() {
  const [formData, setFormData] = useState<RegisterData>({
    nombre: "",
    apellido: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    newsletter: false,
  });
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const { register } = useUser();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: RegisterErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = "Nombre es requerido";
    if (!formData.apellido.trim()) newErrors.apellido = "Apellido es requerido";

    if (!formData.username.trim()) {
      newErrors.username = "Nombre de usuario es requerido";
    } else if (formData.username.length < 6 || formData.username.length > 30) {
      newErrors.username =
        "El nombre de usuario debe tener entre 6 y 30 caracteres";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username =
        "El nombre de usuario solo puede contener letras y números";
    }

    if (!formData.email) {
      newErrors.email = "Email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email no válido";
    }

    if (!formData.password) {
      newErrors.password = "Contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    } else if (
      !/(?=.*[a-z])/.test(formData.password) ||
      !/(?=.*[A-Z])/.test(formData.password) ||
      !/(?=.*\d)/.test(formData.password) ||
      !/(?=.*[^a-zA-Z0-9])/.test(formData.password)
    ) {
      newErrors.password =
        "Debe incluir mayúscula, minúscula, número y carácter especial";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (formData.telefono && !/^[0-9+ ]+$/.test(formData.telefono)) {
      newErrors.telefono = "Teléfono no válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await register(
        formData.username,
        formData.email,
        formData.password,
        formData.nombre,
        formData.apellido,
        formData.telefono ?? null,
        formData.newsletter
      );

      if (res.success) setIsRegistered(true);
      else setErrors({ form: res.error || "Ocurrió un error inesperado." });
    } catch (e) {
      setErrors({ form: "Ocurrió un error inesperado." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center border-2 border-[#AD03CB]">
          <h2 className="text-2xl font-bold text-[#AD03CB] mb-4">
            ¡Registro exitoso!
          </h2>
          <p className="text-[#5C0E6C] mb-6">
            Gracias por unirte a nuestra protectora. Te hemos enviado un email
            de confirmación.
          </p>

          <button
            onClick={() => navigate("/")}
            className="w-full py-2 px-4 rounded-md shadow-2xl text-sm font-medium text-white bg-[#AD03CB] hover:bg-[#AD03CB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD03CB] transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <DefaultPageTemplate>
      <div className="bg-white min-h-screen bg-cover bg-center flex items-center justify-center mt-21 mb-10">
        <div className="relative z-10 bg-white/90 p-8 rounded-lg shadow-2xl border-2 border-[#AD03CB]">

          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#AD03CB]">Registrarse</h2>
            <p className="mt-2">
              Únete a nuestra protectora de mascotas
            </p>
          </div>

          {errors.form && (
            <div className="rounded-md bg-[#AD03CB]/90 p-4 mb-4">
              <p className="text-sm text-[#F6F0FA]">{errors.form}</p>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-[#AD03CB]"
                >
                  Nombre*
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.nombre ? "border-red-500" : "border-[#AD03CB]"
                  } rounded-md shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#AD03CB] bg-[#F6F0FA]/70 text-[#AD03CB]`}
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="apellido"
                  className="block text-sm font-medium text-[#AD03CB]"
                >
                  Apellido*
                </label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.apellido ? "border-red-500" : "border-[#AD03CB]"
                  } rounded-md shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#AD03CB] bg-[#F6F0FA]/70 text-[#AD03CB]`}
                />
                {errors.apellido && (
                  <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#AD03CB]"
              >
                Nombre de usuario*
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.username ? "border-red-500" : "border-[#AD03CB]"
                } rounded-md shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#AD03CB] bg-[#F6F0FA]/70 text-[#AD03CB]`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#AD03CB]"
              >
                Email*
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-[#AD03CB]"
                } rounded-md shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#AD03CB] bg-[#F6F0FA]/70 text-[#AD03CB]`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-[#AD03CB]"
              >
                Teléfono (opcional)
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.telefono ? "border-red-500" : "border-[#AD03CB]"
                } rounded-md shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#AD03CB] bg-[#F6F0FA]/70 text-[#AD03CB]`}
                placeholder="+34 123 456 789"
              />
              {errors.telefono && (
                <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#AD03CB]"
                >
                  Contraseña*
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.password ? "border-red-500" : "border-[#AD03CB]"
                  } rounded-md shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#AD03CB] bg-[#F6F0FA]/70 text-[#AD03CB]`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[#AD03CB]"
                >
                  Confirmar Contraseña*
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  minLength={6}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-[#AD03CB]"
                  } rounded-md shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#AD03CB] bg-[#F6F0FA]/70 text-[#AD03CB]`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
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
              <label
                htmlFor="newsletter"
                className="ml-2 block text-sm text-[#AD03CB]"
              >
                Suscribirme al boletín de noticias
              </label>
            </div>

            <div className="flex justify-center ">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-38 h-28 rounded-full bg-transparent hover:scale-105 transition-transform  ${
                  isLoading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {isLoading ? (
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Mantenemos la huella pero sin texto */}
                    <circle
                      cx="10"
                      cy="35"
                      r="10"
                      fill="#AD03CB"
                      opacity="0.6"
                    />
                    <circle
                      cx="35"
                      cy="18"
                      r="12"
                      fill="#AD03CB"
                      opacity="0.6"
                    />
                    <circle
                      cx="65"
                      cy="18"
                      r="12"
                      fill="#AD03CB"
                      opacity="0.6"
                    />
                    <circle
                      cx="90"
                      cy="35"
                      r="10"
                      fill="#AD03CB"
                      opacity="0.6"
                    />
                    <ellipse
                      cx="50"
                      cy="55"
                      rx="35"
                      ry="25"
                      fill="#AD03CB"
                      opacity="0.6"
                    />

                    {/* Círculo de carga centrado en la almohadilla */}
                    <circle
                      cx="50"
                      cy="50"
                      r="15"
                      fill="transparent"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="80"
                      className="animate-spin origin-center"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Dedos */}
                    <ellipse cx="15" cy="28" rx="10" ry="12" fill="#AD03CB" />
                    <ellipse cx="37" cy="15" rx="12" ry="15" fill="#AD03CB" />
                    <ellipse cx="63" cy="15" rx="12" ry="15" fill="#AD03CB" />
                    <ellipse cx="85" cy="28" rx="10" ry="12" fill="#AD03CB" />

                    {/* Almohadilla */}
                    <ellipse cx="50" cy="55" rx="35" ry="25" fill="#AD03CB" />
                    {/* Texto */}
                    <text
                      x="50"
                      y="55"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      Registrarse
                    </text>
                  </svg>
                )}
              </button>
            </div>
          </form>

          <div className="text-center text-sm text-[#AD03CB]">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-medium text-[#AD03CB] hover:text-[#AD03CB]"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </DefaultPageTemplate>
  );
}
