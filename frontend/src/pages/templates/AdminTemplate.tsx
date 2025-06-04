import type { ReactNode } from "react";
import AdminNavbar from "../../components/AdminNavbar";

export const AdminPageTemplate = ({children}:{children:ReactNode}) => {
    return (
        <>
            <AdminNavbar/>
            {children}
            
        </>
    )
}