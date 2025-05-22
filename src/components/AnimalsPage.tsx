import { useState, useEffect } from "react";
import type { Animal } from "../types/Animals";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";
import { AnimalDetails } from "../components/AnimalDetails"; // ajusta la ruta si es necesario

export const AnimalsPage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleAnimalClick = (animal: Animal) => {
    setSelectedAnimal(animal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnimal(null);
  };

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/animales");
        if (!response.ok) throw new Error("Failed to fetch animals");
        const data = await response.json();
        setAnimals(data.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchAnimals();
  }, []);

  if (loading || error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl" style={{ color: "#F2DCB3" }}>
          {loading ? "Cargando..." : `Error: ${error}`}
        </div>
      </div>
    );
  }

  return (
    <DefaultPageTemplate>
      <div
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "#40170E" }}
      >
        <div className="max-w-7xl mx-auto mt-6">
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
                    src={`http://localhost:8080/images/animal/${animal.image}`}
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-[#F2DCB3] hover:filter hover:brightness-80 transition-all duration-200">
                  <h2 className="text-xl font-bold mb-2" style={{ color: "#40170E" }}>
                    {animal.name}
                  </h2>
                  <div className="mb-2">
                    <span className="font-semibold text-[#D97236]">Edad: </span>
                    <span style={{ color: "#40170E" }}>
                      {animal.age} {animal.age === 1 ? "año" : "años"}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-[#D97236]">Tamaño: </span>
                    <span style={{ color: "#40170E" }}>{animal.weight} Kg</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-[#D97236]">Sexo: </span>
                    <span style={{ color: "#40170E" }}>{animal.gender}</span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-[#D97236]">Raza: </span>
                    <span style={{ color: "#40170E" }}>{animal.breed}</span>
                  </div>
                  <button
                    onClick={() => handleAnimalClick(animal)}
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
            </>
          )}
        </div>

        {isModalOpen && selectedAnimal && (
          <AnimalDetails animal={selectedAnimal} onClose={closeModal} />
        )}
      </div>
    </DefaultPageTemplate>
  );
};

export default AnimalsPage;
