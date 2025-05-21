// pages/MainPage/AdminDashboard.tsx
import { useEffect, useState } from "react";
import { useUser } from "../../services/users/useUser";

interface UserDTO {
  id: number;
  username: string;
  email: string;
  name: string;
  surname: string;
  phone?: string;
  role: string;
}

export default function AdminDashboard() {
  const { getToken } = useUser();
  const [users, setUsers] = useState<UserDTO[]>([]);

  const fetchUsers = async () => {
    const token = getToken();
    const res = await fetch("http://localhost:8080/api/usuarios", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  };

  const deleteUser = async (id: number) => {
    const token = getToken();
    await fetch(`http://localhost:8080/api/usuarios/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <table className="min-w-full border border-gray-200 bg-white">
        <thead>
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Usuario</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.id}</td>
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.name} {u.surname}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2">
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => deleteUser(u.id)}
                >
                  Eliminar
                </button>
                {/* Puedes añadir aquí un botón "Editar" si luego deseas habilitarlo */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
