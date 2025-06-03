import { useState, useEffect } from "react";
import { useUser } from "../../services/users/useUser";
import type { UserDTO } from "../../types/UserDTO";

export function useAdminUsers() {
  const { getToken } = useUser();
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10); // puedes cambiar el tamaño de página

  const fetchUsers = async (pageNumber: number = 0) => {
    setLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`http://localhost:8080/api/usuarios/paged?page=${pageNumber}&size=${pageSize}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al cargar usuarios");
      const data = await res.json();
      setUsers(data.content);
      setPage(data.number);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!window.confirm(user?.status !== "active" ? "¿Estás seguro de eliminar este usuario?" : "¿Estás seguro de desactivar este usuario?")) return;

    try {
      const token = getToken();
      if (!user) throw new Error("Usuario no encontrado");

      if (user.status !== "inactive") {
        const updatedUserData = { ...user, status: "inactive" };
        const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUserData),
        });
        if (!res.ok) throw new Error("Error al actualizar usuario");
        const updatedUser = await res.json();
        setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      } else {
        const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al eliminar usuario");
        setUsers(prev => prev.filter(u => u.id !== id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  const updateUser = async (id: number, form: Partial<UserDTO>) => {
    const token = getToken();
    const res = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (!res.ok) throw new Error("Error al actualizar usuario");
    const updatedUser = await res.json();
    setUsers(prev => prev.map(u => (u.id === updatedUser.id ? updatedUser : u)));
    return updatedUser;
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  return {
    users,
    loading,
    error,
    page,
    totalPages,
    setPage,
    fetchUsers,
    deleteUser,
    updateUser
  };
}
