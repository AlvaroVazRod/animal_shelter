import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../../types/User";

export type UpdateUserData = {
  username: string;
  name: string;
  surname: string;
  email: string;
  phone: string | null;
  newsletter: boolean;
};


export interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (
    email: string,
    username: string,
    password: string,
    name: string,
    surname: string,
    phone: string | null,
    newsletter: boolean
  ) => Promise<RegisterResult>;
  getToken: () => string | null;
  updateUser: (data: UpdateUserData) => Promise<boolean>;
}



type RegisterResult = {
  success: boolean;
  data?: any;
  error?: string;
};

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchCurrentUser = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch("http://localhost:8080/api/usuarios/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("No se pudo obtener el usuario actual");

      const data = await res.json();
      if (data.status === "inactive") logout();

      setUser({
        id: data.id,
        name: data.name,
        username: data.username,
        surname: data.surname,
        email: data.email,
        phone: data.phone,
        newsletter: data.newsletter,
        role: data.role,
        image: data.image,
        status: data.status,
      });

      localStorage.setItem("img", data.image || "");
    } catch (err) {
      console.error("Error al cargar el usuario:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
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

      await fetchCurrentUser();

      navigate(role === "ROLE_ADMIN" ? "/admin" : "/");

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
    username: string,
    email: string,
    password: string,
    name: string,
    surname: string,
    phone: string | null,
    newsletter: boolean
  ): Promise<RegisterResult> => {
    try {
      const token = getToken();

      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          password,
          name,
          surname,
          phone,
          newsletter,
          status: "active",
        }),
      });

      const responseBody = await res.json();

      if (!res.ok) {
        return {
          success: false,
          error: responseBody.error || "Error inesperado al registrar",
        };
      }

      return {
        success: true,
        data: responseBody,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Error inesperado al registrar",
      };
    }
  };

  const updateUser = async (data: UpdateUserData): Promise<boolean> => {
    try {
      const token = getToken();

      const res = await fetch("http://localhost:8080/api/usuarios/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("No se pudo actualizar el perfil");

      await fetchCurrentUser();
      return true;
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      return false;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        getToken,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};