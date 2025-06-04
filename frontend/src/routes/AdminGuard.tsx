import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../services/users/useUser'

/**
 * Componente de protección de rutas backoffice (admin).
 *
 * Requiere que:
 * - Exista un token en localStorage.
 * - Exista un usuario autenticado.
 * - El rol del usuario sea ADMIN.
 */
export const AdminGuard = () => {
    const { user, loading } = useUser()
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    if (loading) return <div>Cargando sesión...</div>;

    if (!token || !user) {
        return <Navigate to="/login" replace />
    }

    if (role !== 'ADMIN' || user.role !== 'ADMIN') {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
