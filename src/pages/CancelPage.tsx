import { useNavigate } from "react-router-dom";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";

export default function CancelPage() {
  const navigate = useNavigate();

  return (
    <DefaultPageTemplate>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-20 bg-[#f5f5f5] flex flex-col items-center justify-center text-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-extrabold text-red-600 mb-6">
            ¡Pago cancelado!
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Parece que algo salió mal o cancelaste el proceso. Puedes volver a intentarlo cuando estés listo.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#AD03CB] hover:bg-[#eb7cff] text-white font-semibold px-6 py-3 rounded-full transition"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </DefaultPageTemplate>
  );
}
