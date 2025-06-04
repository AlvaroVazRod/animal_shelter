import { Navigate, Outlet } from 'react-router-dom'
import { useUser } from '../services/users/useUser';

/**
 * Componente de protección de rutas privadas.
 *
 * Su propósito es controlar el acceso a rutas que requieren autenticación.
 * Funciona como un "wrapper" (envoltorio) para rutas hijas dentro de `react-router-dom`.
 *
 * Comportamiento:
 * - Si el usuario está autenticado (`username` existe), se renderiza la ruta hija correspondiente mediante `<Outlet />`.
 * - Si no hay sesión activa, redirige automáticamente al usuario al login.
 */
export const PrivateGuard = () => {
    // 🔐 Obtenemos información de autenticación y estado de carga desde el hook personalizado
    const { user, loading } = useUser();
    const token = localStorage.getItem('token')

    if (loading) return <div>Cargando sesión...</div>;

    if (!token || !user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
