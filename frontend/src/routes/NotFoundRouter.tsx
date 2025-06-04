import type { ReactNode } from "react"
import { Route, Routes } from "react-router-dom"
import NotFound from "../components/NotFound"

/**
 * Componente encargado de gestionar todas las rutas inaccesibles en nuestra app.
 *
 * @returns {JSX.Element} El árbol de rutas y componentes.
 */
export const NotFoundRouter = ({children}:{children:ReactNode}) => {
    return (
        <Routes>
            {children}
            <Route path="*" element={<NotFound/>} />
        </Routes>
    )
}