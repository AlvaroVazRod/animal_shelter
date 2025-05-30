import { Link } from "react-router-dom";

export const Cancel = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-100 text-red-800 text-center px-4">
      <h1 className="text-4xl font-bold mb-4">Donación cancelada ❌</h1>
      <p className="text-lg mb-6">No se ha realizado ningún cargo. Puedes intentarlo de nuevo si lo deseas.</p>
      <Link to="/" className="text-red-700 underline hover:text-red-900">
        Volver a la página principal
      </Link>
    </div>
  );
};
