import React, { createContext, useEffect, useState } from "react";
import type { User } from "../../types/User";

export interface UserContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    register: (email: string, password: string, name:string, surname:string, phone:string|null) => Promise<boolean>;
}

export const UserContext = createContext<UserContextType | undefined>(
    undefined
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const getJWToken = async () => {
        const username = import.meta.env.VITE_ADMIN_USERNAME;
        const password = import.meta.env.VITE_ADMIN_PASSWORD;

        try {
            const res = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) throw new Error((await res.json()).message);
            const data = await res.json();

            // ✅ Guardar token en localStorage
            localStorage.setItem("token", data.token);
            // localStorage.setItem("username", username);

            // ✅ Establecer usuario en estado
            // setUser({ email: username, token: data.token });
        } catch (err: any) {
            console.error("Error al obtener token:", err.message);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        // const username = localStorage.getItem("username"); -- AGREGAR SI PERSISTE LA SESION

        if (!token) {
            getJWToken();
        }
    }, []);

    const login = async (username: string, password: string) => {

        try {
            const res = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) throw new Error((await res.json()).message);
            const data = await res.json();

            // ✅ Guardar token en localStorage
            console.log(data)
            setUser({username, password});
            return true;
            // localStorage.setItem("username", username);

            // ✅ Establecer usuario en estado
            // setUser({ email: username, token: data.token });
        } catch (err: any) {
            console.error("Error al obtener token:", err.message);
            return false;
        }
        
    }

    const register = async (email: string, password: string, name:string, surname:string, phone:string|null) => {
        try {
            const username = email;
            const res = await fetch("http://localhost:8080/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authoritation": "Bearer"+localStorage.getItem("token") },
                body: JSON.stringify(
                    { username, email, password, name, surname, phone }
                ),
            });

            if (!res.ok) throw new Error((await res.json()).message);
            const data = await res.json();

            console.log(data)
            return true;
        } catch (err: any) {
            console.error("Error al registrar:", err.message);
            return false;
        }
    }

    const logout = () => setUser(null);

    return (
        <UserContext.Provider
            value={{ user, login, logout, register }}
        >
            {children}
        </UserContext.Provider>
    );
};
