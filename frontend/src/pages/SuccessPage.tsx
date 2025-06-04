import { useLocation, useNavigate } from "react-router-dom";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const isSponsor = params.get("sponsor") === "true";

  return (
    <DefaultPageTemplate>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-20 bg-[#f5f5f5] flex flex-col items-center justify-center text-center">
        <div className="max-w-xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#A444C5] mb-6">
            ¡Gracias por tu {isSponsor ? "apadrinamiento" : "donación"}!
          </h1>
          <p className="text-lg text-gray-700 mb-8">
            Tu generosidad nos ayuda a seguir cuidando de nuestros peludos 💜
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
