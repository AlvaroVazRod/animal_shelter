import { Route } from "react-router-dom";
import type { ReactNode } from "react";
import { NotFoundRouter } from "./NotFoundRouter";
import Home from "../pages/MainPage/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import { PrivateGuard } from "./PrivateGuard";
import { AdminGuard } from "./AdminGuard";
import AdminDashboard from "../pages/MainPage/AdminDashboard";
import { Profile } from "../components/Profile";
import Contact from "../components/Contact";
import Main from "../components/Main";
import AnimalsPage from "../components/AnimalsPage";
import { AnimalDetails } from "../components/AnimalDetails";

// Encapsula todas las rutas de la app
export const AppRouter = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <NotFoundRouter>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/contacto" element={<Contact />} />
                {/* <Route path="/animales/:id" element={<AnimalDetails/>}/> */}
                {/* <Route path="/main" element={<Main />} /> */}
                <Route path="/animales" element={<AnimalsPage />} />

                <Route element={<PrivateGuard />}>
                    <Route path="/profile" element={<Profile />} />

                    {/* Rutas solo para admins */}
                    <Route element={<AdminGuard />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Route>
                </Route>
            </NotFoundRouter>
            {children}
        </>
    );
};
