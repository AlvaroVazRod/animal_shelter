import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/User";

export interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    name: string,
    surname: string,
    phone: string | null
  ) => Promise<boolean>;
  getToken: () => string | null;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getToken = (): string | null => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const image = localStorage.getItem("img");

    if (token && username && role) {
      setUser({ username, role , image: 'user.jpg'});
    }

    setLoading(false); // ✅ Terminó la comprobación
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error((await res.json()).message || "Login fallido");

      const { token, role } = await res.json();

      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      localStorage.setItem("img", 'user.jpg');

      setUser({ username, role , image:'user.jpg'});

      if (role === "ROLE_ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    surname: string,
    phone: string | null
  ): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: email, email, password, name, surname, phone }),
      });

      if (!res.ok) throw new Error((await res.json()).message || "Registro fallido");

      return true;
    } catch (err) {
      console.error("Error al registrar:", err);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ user, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};
