import { AdminPageTemplate } from "../templates/AdminTemplate";
import { useEffect, useState, useRef } from "react";
import { useUser } from "../../services/users/useUser";
import {
  FiTrash2,
  FiEdit,
  FiUser,
  FiMail,
  FiPhone,
} from "react-icons/fi";

interface UserDTO {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  phone?: string;
  role: string;
}

export default function AdminDashboardUsers() {
  const { getToken } = useUser();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edición usuarios
  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserDTO>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const usernameInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Abrir modal con animación y focus
  const openEditModal = (user: UserDTO) => {
    setEditingUser(user);
    setEditForm(user);
    setEditError(null);
    setIsModalOpen(true);
    setTimeout(() => usernameInputRef.current?.focus(), 100);
  };

  // Cerrar modal con animación
  const closeEditModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingUser(null);
      setEditForm({});
      setEditError(null);
    }, 300);
  };

  const handleChange = (field: keyof UserDTO, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const fetchUsers = async () => {
    try {
      const token = getToken();
      const res = await fetch("http://localhost:8080/api/usuarios", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al cargar usuarios");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al eliminar usuario");

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar usuario");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <AdminPageTemplate>
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl" style={{ color: "#4ECCA320" }}>
            Cargando usuarios...
          </div>
        </div>
      </AdminPageTemplate>
    );
  }

  if (error) {
    return (
      <AdminPageTemplate>
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl text-red-500">Error: {error}</div>
        </div>
      </AdminPageTemplate>
    );
  }

  return (
    <AdminPageTemplate>
      <div
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-20"
        style={{ backgroundColor: "#2D2A32" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#e8e8e8" }}>
              Panel de Administración
            </h1>
            <p className="text-lg" style={{ color: "#e8e8e8" }}>
              Gestión de usuarios registrados
            </p>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl" style={{ color: "#4ECCA320" }}>
                No hay usuarios registrados
              </p>
            </div>
          ) : (
            <div className="bg-[#4ECCA320]/90 rounded-lg shadow-lg border-2 border-[#4ECCA3] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#4ECCA3]/50">
                  <thead className="bg-[#4ECCA3]">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider"
                      >
                        Usuario
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider"
                      >
                        Información
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider"
                      >
                        Rol
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-bold text-[#e8e8e8] uppercase tracking-wider"
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#4ECCA320]/80 divide-y divide-[#a4ebd4]/30">
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-[#4ECCA320] transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#4ECCA3] flex items-center justify-center text-[#e8e8e8]">
                              <FiUser className="h-5 w-5" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-[#e8e8e8]">
                                {user.username}
                              </div>
                              <div className="text-sm text-[#e8e8e8]/80">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-[#e8e8e8]">
                            <div className="flex items-center">
                              <FiMail className="mr-2 text-[#a4ebd4]" />
                              {user.email}
                            </div>
                            <div className="flex items-center mt-1">
                              <FiUser className="mr-2 text-[#a4ebd4]" />
                              {user.name} {user.surname}
                            </div>
                            {user.phone && (
                              <div className="flex items-center mt-1">
                                <FiPhone className="mr-2 text-[#a4ebd4]" />
                                {user.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === "ADMIN"
                                ? "bg-[#a4ebd4] text-[#3d5950]"
                                : "bg-[#a4ebad] text-[#3d5950]"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => deleteUser(user.id)}
                            className="text-[#7ddb8f] hover:text-red-600 mr-4 transition-colors"
                            title="Eliminar usuario"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                          <button
                            className="text-[#7ddb8f] hover:text-[#7ddbc8] transition-colors"
                            title="Editar usuario"
                            onClick={() => openEditModal(user)}
                          >
                            <FiEdit className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal edición */}
        {editingUser && (
          <div
            className={`fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50
              transition-opacity duration-600 ease-out
              ${isModalOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            onClick={closeEditModal}
          >
            <div
              className={`bg-[#2D2A32] rounded-lg shadow-lg max-w-lg w-full p-6
                transform transition-transform duration-600
                ${isModalOpen ? "ease-in scale-100" : "scale-90"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4 text-[#e8e8e8]">
                Editar Usuario
              </h3>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsSaving(true);
                  setEditError(null);
                  try {
                    const token = getToken();
                    const response = await fetch(
                      `http://localhost:8080/api/usuarios/${editingUser.id}`,
                      {
                        method: "PUT",
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(editForm),
                      }
                    );
                    if (!response.ok)
                      throw new Error("Error al actualizar usuario");

                    const updatedUser = await response.json();
                    setUsers((prev) =>
                      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
                    );
                    closeEditModal();
                  } catch (error) {
                    setEditError(
                      error instanceof Error
                        ? error.message
                        : "Error desconocido"
                    );
                  } finally {
                    setIsSaving(false);
                  }
                }}
              >
                <div className="mb-4">
                  <label
                    htmlFor="username"
                    className="block text-[#e8e8e8] font-semibold mb-1"
                  >
                    Usuario
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={editForm.username || ""}
                    onChange={(e) => handleChange("username", e.target.value)}
                    className="w-full border border-[#4ECCA3] rounded-md px-3 py-2
                      focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                    ref={usernameInputRef}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-[#e8e8e8] font-semibold mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={editForm.email || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full border border-[#4ECCA3] rounded-md px-3 py-2
                      focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                    required
                  />
                </div>

                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-[#e8e8e8] font-semibold mb-1"
                    >
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={editForm.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full border border-[#4ECCA3] rounded-md px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="surname"
                      className="block text-[#e8e8e8] font-semibold mb-1"
                    >
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="surname"
                      value={editForm.surname || ""}
                      onChange={(e) => handleChange("surname", e.target.value)}
                      className="w-full border border-[#4ECCA3] rounded-md px-3 py-2
                        focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="phone"
                    className="block text-[#e8e8e8] font-semibold mb-1"
                  >
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={editForm.phone || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className=" w-full border border-[#4ECCA3] rounded-md px-3 py-2
                      focus:outline-none focus:ring-2 focus:ring-[#5ae8ba] text-[#e8e8e8]"
                    placeholder="Opcional"
                  />
                </div>

                {editError && (
                  <div className="mb-4 text-red-600 font-semibold">
                    {editError}
                  </div>
                )}

                <div className="flex justify-end items-center space-x-4">
                  <button
                    type="button"
                    onClick={closeEditModal}
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    )}
                    <span>Guardar</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminPageTemplate>
  );
}