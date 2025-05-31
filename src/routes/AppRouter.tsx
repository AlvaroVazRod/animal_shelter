import { Route } from "react-router-dom";
import type { ReactNode } from "react";
import { NotFoundRouter } from "./NotFoundRouter";
import Home from "../pages/MainPage/Home";
import Login from "../components/Login";
import Register from "../components/Register";
import { PrivateGuard } from "./PrivateGuard";
import { AdminGuard } from "./AdminGuard";
import AdminDashboardUsers from "../pages/MainPage/AdminDashboardUsers";
import AdminDashboardAnimals from "../pages/MainPage/AdminDashboardAnimals";
import WebhookLogsPage from "../pages/MainPage/AdminDashboardWebhookLogs"
import Donate from "../components/Donate";

import { Profile } from "../components/Profile";
import Contact from "../components/Contact";
import Main from "../components/Main";
import AnimalsPage from "../components/AnimalsPage";
import { AnimalDetails } from "../components/AnimalDetails";
import AdminDashboardTags from "../pages/MainPage/AdminDashboardTags";
import AdoptionFormPage from "../pages/MainPage/AdoptionFromPage";

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
        <Route path="/animales" element={<AnimalsPage/>}/>
        <Route path="/adopt/:id" element={<AdoptionFormPage />} />
        <Route element={<PrivateGuard />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/donate" element={<Donate />} />


          {/* Rutas solo para admins */}
          <Route element={<AdminGuard />}>
            <Route path="/adminU" element={<AdminDashboardUsers />} />
            <Route path="/adminP" element={<AdminDashboardAnimals />} />
            <Route path="/adminT" element={<AdminDashboardTags />} />
            <Route path="/adminW" element={<WebhookLogsPage />} />
          </Route>
        </Route>
      </NotFoundRouter>
      {children}
    </>
  );
};
