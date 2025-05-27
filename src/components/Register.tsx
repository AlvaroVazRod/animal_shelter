import { useState, type FormEvent } from "react";
import { useUser } from "../services/users/useUser";
import { useNavigate, Link } from "react-router-dom";

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
    if (!formData.username.trim()) newErrors.username = "Nombre de usuario es requerido";
    if (!formData.email) newErrors.email = "Email es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email no válido";

    if (!formData.password) newErrors.password = "Contraseña es requerida";
    else if (formData.password.length < 6) //Añadir en un futuro mas requisitos (Upper, Lower, Numbers & Symbols)
      newErrors.password = "Mínimo 6 caracteres";

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";

    if (formData.telefono && !/^[0-9+ ]+$/.test(formData.telefono))
      newErrors.telefono = "Teléfono no válido";

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
      // console.log(formData.email, formData.username, formData.password, formData.nombre, formData.apellido)
      console.log(res)
      if (res) setIsRegistered(true);
    } catch {
      setErrors({ form: "Error al registrar. Por favor intenta nuevamente." });
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="max-w-md w-full bg-[#F2DCB3] p-8 rounded-lg shadow-lg text-center border-2 border-[#A65638]">
          <h2 className="text-2xl font-bold text-[#A65638] mb-4">
            ¡Registro exitoso!
          </h2>
          <p className="text-[#40170E] mb-6">
            Gracias por unirte a nuestra protectora. Te hemos enviado un email
            de confirmación.
          </p>
          <button
            onClick={() => setIsRegistered(false)}
            className="w-full py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-[#D97236] hover:bg-[#A65638] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40170E] transition-colors"
          >
            Volver al formulario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 flex flex-col pt-[NAVBAR_HEIGHT] overflow-y-auto bg-cover bg-center"
      style={{ backgroundImage: "url('./mainBg.jpg')" }}
    >
      <div className="flex-1 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div className="max-w-md w-full bg-[#F2DCB3]/90 p-8 rounded-lg shadow-lg border-2 border-[#A65638] my-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#40170E]">Registrarse</h2>
            <p className="mt-2 text-[#A65638]">
              Únete a nuestra protectora de mascotas
            </p>
          </div>

          {errors.form && (
            <div className="rounded-md bg-[#40170E]/90 p-4 mb-4">
              <p className="text-sm text-[#F2DCB3]">{errors.form}</p>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-[#40170E]"
                >
                  Nombre*
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.nombre ? "border-red-500" : "border-[#A65638]"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#40170E] bg-[#F2DCB3]/70 text-[#40170E]`}
                />
                {errors.nombre && (
                  <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="apellido"
                  className="block text-sm font-medium text-[#40170E]"
                >
                  Apellido*
                </label>
                <input
                  id="apellido"
                  name="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.apellido ? "border-red-500" : "border-[#A65638]"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#40170E] bg-[#F2DCB3]/70 text-[#40170E]`}
                />
                {errors.apellido && (
                  <p className="mt-1 text-sm text-red-600">{errors.apellido}</p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#40170E]"
              >
                Username*
              </label>
              <input
                id="username"
                name="username"
                type="usernamee"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.username ? "border-red-500" : "border-[#A65638]"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#40170E] bg-[#F2DCB3]/70 text-[#40170E]`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#40170E]"
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
                className={`mt-1 block w-full px-3 py-2 border ${errors.email ? "border-red-500" : "border-[#A65638]"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#40170E] bg-[#F2DCB3]/70 text-[#40170E]`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="telefono"
                className="block text-sm font-medium text-[#40170E]"
              >
                Teléfono (opcional)
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${errors.telefono ? "border-red-500" : "border-[#A65638]"
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#40170E] bg-[#F2DCB3]/70 text-[#40170E]`}
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
                  className="block text-sm font-medium text-[#40170E]"
                >
                  Contraseña*
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.password ? "border-red-500" : "border-[#A65638]"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#40170E] bg-[#F2DCB3]/70 text-[#40170E]`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-[#40170E]"
                >
                  Confirmar Contraseña*
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.confirmPassword
                      ? "border-red-500"
                      : "border-[#A65638]"
                    } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#40170E] bg-[#F2DCB3]/70 text-[#40170E]`}
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
                className="h-4 w-4 text-[#A65638] focus:ring-[#40170E] border-[#A65638] rounded"
              />
              <label
                htmlFor="newsletter"
                className="ml-2 block text-sm text-[#40170E]"
              >
                Suscribirme al boletín de noticias
              </label>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-38 h-28 rounded-full bg-transparent hover:scale-105 transition-transform ${isLoading ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
              >
                {isLoading ? (
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Mantenemos la huella pero sin texto */}
                    <circle
                      cx="10"
                      cy="35"
                      r="10"
                      fill="#D97236"
                      opacity="0.6"
                    />
                    <circle
                      cx="35"
                      cy="18"
                      r="12"
                      fill="#D97236"
                      opacity="0.6"
                    />
                    <circle
                      cx="65"
                      cy="18"
                      r="12"
                      fill="#D97236"
                      opacity="0.6"
                    />
                    <circle
                      cx="90"
                      cy="35"
                      r="10"
                      fill="#D97236"
                      opacity="0.6"
                    />
                    <ellipse
                      cx="50"
                      cy="55"
                      rx="35"
                      ry="25"
                      fill="#D97236"
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
                    <ellipse cx="15" cy="28" rx="10" ry="12" fill="#D97236" />
                    <ellipse cx="37" cy="15" rx="12" ry="15" fill="#D97236" />
                    <ellipse cx="63" cy="15" rx="12" ry="15" fill="#D97236" />
                    <ellipse cx="85" cy="28" rx="10" ry="12" fill="#D97236" />

                    {/* Almohadilla */}
                    <ellipse cx="50" cy="55" rx="35" ry="25" fill="#D97236" />
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

          <div className="text-center text-sm text-[#40170E]">
            ¿Ya tienes una cuenta?{" "}
            <Link
              to="/login"
              className="font-medium text-[#A65638] hover:text-[#40170E]"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
