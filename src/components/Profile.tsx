import { useState } from "react";
import { useUser } from "../services/users/useUser";
import { useNavigate } from "react-router-dom";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";


export const Profile = () => {
  const { user, logout } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user?.username) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("username", user.username);

    try {
      const res = await fetch("http://localhost:8080/images/upload/user", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir la imagen");

      setUploadStatus("✅ Imagen subida correctamente");
      // Recargar para mostrar la nueva imagen
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      setUploadStatus("❌ Error al subir la imagen");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DefaultPageTemplate>
      <div
        className="min-h-screen bg-cover bg-center flex items-center justify-center relative px-4 pt-15"
        style={{
          backgroundImage: "url('./mainBg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />
        <div className="relative z-10 max-w-md w-full bg-[#F2DCB3]/90 p-8 rounded-lg shadow-lg border-2 border-[#A65638]">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#40170E]">
              Perfil de Usuario
            </h2>
            <p className="mt-2 text-[#A65638]">
              Gestiona tu información personal
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex flex-col items-center">
              {user?.image ? (
                <img
                  src={`http://localhost:8080/images/user/${user.image}`}
                  alt="Avatar"
                  className="w-32 h-32 object-cover rounded-full border-4 border-[#A65638] mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-[#A65638] flex items-center justify-center text-white text-4xl mb-4">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}

              <h3 className="text-xl font-bold text-[#40170E]">
                {user?.username}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="text-center ">
                <label className="block text-sm font-medium text-[#40170E] mb-1">
                  Cambiar imagen de perfil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-[#40170E] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#D97236] file:text-white hover:file:bg-[#A65638] transition-colors border rounded-2xl"
                />
              </div>
              {selectedFile && (
                <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    isLoading
                      ? "bg-[#A65638]"
                      : "bg-[#D97236] hover:bg-[#A65638]"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40170E] transition-colors`}
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
                      Subiendo...
                    </>
                  ) : (
                    "Subir imagen"
                  )}
                </button>
              )}

              {uploadStatus && (
                <div
                  className={`rounded-md p-3 text-center text-sm ${
                    uploadStatus.includes("✅")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {uploadStatus}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#A65638]/50">
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-transparent border border-[#A65638] text-[#40170E] font-medium rounded-md hover:bg-[#A65638]/20 transition-colors"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </DefaultPageTemplate>
  );
};

export default Profile;
