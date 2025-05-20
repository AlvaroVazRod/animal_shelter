import { useState, useEffect } from "react";
import type { Animal } from "../types/Animals"; // Assuming you have a type definition
 // Assuming you have a type definition

export const AnimalsPage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch("https://NUESTRA_API.com/animales");
        if (!response.ok) {
          throw new Error("Failed to fetch animals");
        }
        const data = await response.json();
        setAnimals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl" style={{ color: "#F2DCB3" }}>
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "#40170E" }}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-12 text-center" style={{ color: "#F2DCB3" }}>
          Nuestros Peludos en Busca de Hogar
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {animals.map((animal) => (
            <div
              key={animal.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={animal.imageUrl || "/default-pet.jpg"}
                  alt={animal.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4" style={{ backgroundColor: "#F2DCB3" }}>
                <h2 className="text-xl font-bold mb-2" style={{ color: "#40170E" }}>
                  {animal.name}
                </h2>
                <div className="mb-2">
                  <span className="font-semibold" style={{ color: "#D97236" }}>
                    Edad:{" "}
                  </span>
                  <span style={{ color: "#40170E" }}>{animal.age} años</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold" style={{ color: "#D97236" }}>
                    Tamaño:{" "}
                  </span>
                  <span style={{ color: "#40170E" }}>{animal.size}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold" style={{ color: "#D97236" }}>
                    Sexo:{" "}
                  </span>
                  <span style={{ color: "#40170E" }}>{animal.gender}</span>
                </div>
                <p className="text-sm mt-3" style={{ color: "#40170E" }}>
                  {animal.description}
                </p>
                <button
                  className="mt-4 w-full py-2 rounded-lg font-bold transition-colors duration-300"
                  style={{
                    backgroundColor: "#D97236",
                    color: "#40170E",
                  }}
                >
                  Conocer más
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimalsPage;