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
import SuccessPage from "../pages/SuccessPage";
import CancelPage from "../pages/CancelPage";
import { Profile } from "../components/Profile";
import Contact from "../components/Contact";
import { AnimalsPage } from "../components/AnimalsPage";
import AdminDashboardTags from "../pages/MainPage/AdminDashboardTags";
import AdoptionFormPage from "../pages/MainPage/AdoptionFromPage";
import EditProfile from "../components/EditForm";
import ShelterPage from "../pages/ShelterPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";

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
        <Route path="/adopt/:id" element={<AdoptionFormPage />} />
        <Route path="/shelter" element={<ShelterPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route element={<PrivateGuard />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit" element={<EditProfile />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
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
