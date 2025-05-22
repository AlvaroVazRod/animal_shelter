import { useState } from "react";
import { useUser } from "../services/users/useUser";

export const Profile = () => {
    const { user } = useUser();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setUploadStatus(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !user?.username) return;

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("username", user.username); // Aquí añadimos el username

        try {
            const res = await fetch("http://localhost:8080/images/upload/user", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Error al subir la imagen");
            }

            setUploadStatus("✅ Imagen subida correctamente");
        } catch (err) {
            setUploadStatus("❌ Error al subir la imagen");
            console.error(err);
        }
    };

    return (
        <div className="p-6 text-white bg-[#40170E] min-h-screen">
            <h1 className="text-3xl mb-4">Perfil de {user?.username}</h1>

            {user?.image && (
                <img
                    src={`http://localhost:8080/images/user/${user.image}`}
                    alt="Avatar"
                    className="w-32 h-32 object-cover rounded-full mb-4"
                />
            )}

            <div className="space-y-2">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block text-sm text-gray-300"
                />
                <button
                    onClick={handleUpload}
                    disabled={!selectedFile}
                    className="bg-[#D97236] text-white font-bold px-4 py-2 rounded hover:bg-orange-500 transition"
                >
                    Subir imagen
                </button>
                {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
            </div>
        </div>
    );
};

export default Profile;
