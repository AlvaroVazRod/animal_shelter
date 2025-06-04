import type { ReactNode } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const DefaultPageTemplate = ({children}:{children:ReactNode}) => {
    return (
        <>
            <Navbar/>
            {children}
            <Footer/>
        </>
    )
}