import { Link } from "react-router-dom";

export const Success = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-100 text-green-800 text-center px-4">
      <h1 className="text-4xl font-bold mb-4">¡Gracias por tu donación! 💖</h1>
      <p className="text-lg mb-6">Tu contribución ayuda a salvar vidas peludas 🐶🐱</p>
      <Link to="/" className="text-green-700 underline hover:text-green-900">
        Volver a la página principal
      </Link>
    </div>
  );
};
