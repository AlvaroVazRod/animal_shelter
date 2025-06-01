import { useState, useEffect } from "react";
import { useUser } from "../../services/users/useUser";
import type { UserDTO } from "../../types/UserDTO";


export function useAdminUsers() {
    const { getToken } = useUser();
    const [users, setUsers] = useState<UserDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const fetchUsers = async () => {
        try {
            const token = getToken();
            const res = await fetch("http://localhost:8080/api/usuarios", {
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
        const user = users.find(u => u.id === id);
        if (!window.confirm(user?.status !== "active" ? "¿Estás seguro de eliminar este usuario?" : "¿Estás seguro de desactivar este usuario?")) return;

        try {
            const token = getToken();
            // Buscar usuario en lista actual
            
            if (!user) throw new Error("Usuario no encontrado");

            if (user.status !== "inactive") {
                // Hacer update cambiando status a inactive
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
                // Si ya está inactive, eliminar definitivamente
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
        setUsers((prev) =>
            prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
        );
        return updatedUser;
    };

    useEffect(() => { fetchUsers(); }, []);

    return { users, loading, error, deleteUser, updateUser };
}
