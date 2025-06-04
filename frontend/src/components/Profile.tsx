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
  if (!selectedFile) return;

  setIsLoading(true);
  setUploadStatus(null);

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const res = await fetch("http://localhost:8080/images/upload/user", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: formData,
    });

    const text = await res.text();

    if (!res.ok) throw new Error(text);

    setUploadStatus(`✅ ${text}`);
    // Recargar para mostrar la nueva imagen
    setTimeout(() => window.location.reload(), 1500);
  } catch (err: any) {
    const errorMsg = err?.message || "Error al subir la imagen";
    setUploadStatus(`❌ ${errorMsg}`);
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
      <div className="min-h-screen bg-white bg-cover bg-center flex items-center justify-center relative px-4 mt-10">
        <div className="relative z-10 max-w-md w-full bg-white/90 p-8 rounded-lg shadow-lg border-2 border-[#AD03CB]">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#AD03CB]">
              Perfil de Usuario
            </h2>
            <p className="mt-2">
              Gestiona tu información personal
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex flex-col items-center">
              {user?.image ? (
                <img
                  src={`http://localhost:8080/images/user/${user.image}`}
                  alt="Avatar"
                  className="w-32 h-32 object-cover rounded-full border-4 border-[#AD03CB] mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-2 border-[#AD03CB] bg-[#d68ae3] flex items-center justify-center text-white text-4xl mb-4">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
              )}

              <h3 className="text-xl font-bold text-[#AD03CB]">
                {user?.username}
              </h3>
            </div>

            <div className="space-y-4">
              <div className="text-center ">
                <label className="block text-sm font-medium text-[#AD03CB] mb-1">
                  Cambiar imagen de perfil
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-[#AD03CB] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#b454c4] file:text-white hover:file:bg-[#AD03CB] transition-colors  border rounded-2xl"
                />
              </div>
              {selectedFile && (
                <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${isLoading
                      ? "bg-[#AD03CB]"
                      : "bg-[#b454c4] hover:bg-[#AD03CB]"
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
                      Subiendo...
                    </>
                  ) : (
                    "Subir imagen"
                  )}
                </button>
              )}

              {uploadStatus && (
                <div
                  className={`rounded-md p-3 text-center text-sm ${uploadStatus.includes("✅")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                    }`}
                >
                  {uploadStatus}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#AD03CB]/50">
              <button
                onClick={handleLogout}
                className="w-full py-2 px-4 bg-transparent border border-[#AD03CB] text-[#AD03CB] font-medium rounded-md hover:bg-[#AD03CB] hover:text-white transition-colors"
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
