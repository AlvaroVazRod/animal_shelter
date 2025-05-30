import { useState, type FormEvent } from "react";
import { useUser } from "../services/users/useUser";
import { useNavigate, Link } from "react-router-dom";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";


interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginErrors {
  email?: string;
  password?: string;
  form?: string;
}

export default function Login() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!credentials.email) {
      newErrors.email = "Email es requerido";
    }

    if (!credentials.password) {
      newErrors.password = "Contraseña es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const loginResult = await login(credentials.email, credentials.password);
      if (loginResult) {
        // Guarda el estado de autenticación
        localStorage.setItem("isLoggedIn", "true");

        const role = localStorage.getItem("role");
        if (role === "ADMIN") navigate("/adminU");
        else {
          navigate("/");
          // Forzar actualización para reflejar cambios
        }
        return;
      }
      setErrors({
        form: "Error al iniciar sesión. Verifica tus credenciales.",
      });
    } catch {
      setErrors({
        form: "Error al iniciar sesión. Verifica tus credenciales.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultPageTemplate>
    <div className="bg-white min-h-screen bg-cover bg-center flex items-center justify-center mt-5">
      <div className="absolute inset-0 z-0" />
      <div className="relative z-10 max-w-md w-full bg-white/90 p-8 rounded-lg shadow-lg border-2 border-[#AD03CB]">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#AD03CB]">Iniciar Sesión</h2>
          <p className="mt-2 text-gray-600">
            Accede a tu cuenta de la protectora
          </p>
        </div>

        {errors.form && (
          <div className="rounded-md bg-[#AD03CB]/90 p-4 mb-4">
            <p className="text-sm text-white">{errors.form}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#AD03CB]"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="username"
                value={credentials.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? "border-red-500" : "border-[#AD03CB]"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AD03CB] bg-[#F6F0FA] text-[#AD03CB]`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#AD03CB]"
              >
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? "border-red-500" : "border-[#AD03CB]"
                } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#AD03CB] bg-[#F6F0FA] text-[#AD03CB]`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#AD03CB] focus:ring-[#AD03CB] border-[#AD03CB] rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-[#AD03CB]"
              >
                Recordarme
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-[#AD03CB] hover:text-[#7a0299]"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? "bg-[#AD03CB]/80"
                  : "bg-[#AD03CB] hover:bg-[#7a0299]"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#AD03CB] transition-colors`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Procesando...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-[#AD03CB] mt-4">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="font-medium hover:text-[#7a0299]">
            Regístrate
          </Link>
        </div>
      </div>
    </div>
    </DefaultPageTemplate>
  );
}
