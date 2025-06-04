import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";

const schema = z.object({
  currentPassword: z.string().min(1, "Contraseña actual requerida"),
  newPassword: z.string().min(6, "La nueva contraseña debe tener al menos 6 caracteres"),
});

type ChangePasswordData = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ChangePasswordData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ChangePasswordData) => {
    setSuccessMessage("");
    setErrorMessage("");
    try {
      await axios.put("http://localhost:8080/api/usuarios/change-password", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSuccessMessage("✅ Contraseña cambiada correctamente");
      reset();
    } catch (error: any) {
      setErrorMessage("❌ Error al cambiar la contraseña");
    }
  };

  return (
    <DefaultPageTemplate>
      <div className="min-h-screen bg-white flex items-center justify-center p-4 mt-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md w-full bg-white/90 p-8 rounded-lg shadow-lg border-2 border-[#AD03CB] space-y-4"
        >
          <h2 className="text-3xl font-bold text-[#AD03CB] text-center mb-4">
            Cambiar Contraseña
          </h2>

          {successMessage && (
            <div className="bg-green-100 text-green-700 p-2 rounded text-sm text-center">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
              {errorMessage}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#AD03CB]">Contraseña actual</label>
            <input
              type="password"
              {...register("currentPassword")}
              className="w-full px-3 py-2 border border-[#AD03CB] rounded-md bg-[#F6F0FA]/70 text-[#AD03CB]"
            />
            {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#AD03CB]">Nueva contraseña</label>
            <input
              type="password"
              {...register("newPassword")}
              className="w-full px-3 py-2 border border-[#AD03CB] rounded-md bg-[#F6F0FA]/70 text-[#AD03CB]"
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-[#AD03CB] text-white rounded-md hover:bg-[#9503B0] transition-colors"
          >
            {isSubmitting ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </DefaultPageTemplate>
  );
}
