import type { ReactNode } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import Footer from "../../components/Footer";

export const AdminPageTemplate = ({children}:{children:ReactNode}) => {
    return (
        <>
            <AdminNavbar/>
            {children}
            
        </>
    )
}