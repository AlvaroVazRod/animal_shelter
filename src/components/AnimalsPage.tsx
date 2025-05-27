import { useState, useEffect } from "react";
import type { Animal } from "../types/Animals";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";
import { AnimalDetails } from "../components/AnimalDetails";

const PAGE_SIZE = 10;
const API_URL = "http://localhost:8080/api/animales";

export const AnimalsPage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");

  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnimalClick = (animal: Animal) => {
    setSelectedAnimal(animal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAnimal(null);
    setIsModalOpen(false);
  };

  const fetchAnimals = async (
    pageNumber: number,
    species?: string,
    gender?: string
  ) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(pageNumber),
        size: "4",
        ...(species ? { species } : {}),
        ...(gender ? { gender } : {}),
      });

      const res = await fetch(`${API_URL}?${params}`);
      if (!res.ok) throw new Error("Error al obtener los animales");

      const data = await res.json();
      setAnimals(data.content);
      setTotalPages(data.totalPages);
      setPage(data.number);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals(0, breed, gender);
  }, [breed, gender]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchAnimals(newPage, breed, gender);
    }
  };

  const renderAnimalCard = (animal: Animal) => (
    <div
      key={animal.id}
      onClick={() => handleAnimalClick(animal)}
      className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={`http://localhost:8080/images/animal/${animal.image}`}
          alt={animal.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4 bg-[#F2DCB3]">
        <h2 className="text-xl font-bold mb-2 text-[#40170E]">{animal.name}</h2>
        <p className="mb-2 text-[#40170E]"><strong className="text-[#D97236]">Edad: </strong>{animal.age} {animal.age === 1 ? "año" : "años"}</p>
        <p className="mb-2 text-[#40170E]"><strong className="text-[#D97236]">Peso: </strong>{animal.weight} Kg</p>
        <p className="mb-2 text-[#40170E]"><strong className="text-[#D97236]">Sexo: </strong>{animal.gender ? "Masculino" : "Femenino"}</p>
        <p className="mb-2 text-[#40170E]"><strong className="text-[#D97236]">Raza: </strong>{animal.breed}</p>
      </div>
    </div>
  );

  return (
    <DefaultPageTemplate>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#40170E]">
        <div className="max-w-7xl mx-auto mt-6">
          <h1 className="text-4xl font-bold mb-8 text-center text-[#F2DCB3]">
            Nuestros Peludos en Busca de Hogar
          </h1>

          <div className="flex justify-center gap-6 mb-10">
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="px-4 py-2 rounded font-bold text-[#40170E] bg-[#F2DCB3]"
            >
              <option value="">Todas las espécies</option>
              <option value="dog">Perro</option>
              <option value="cat">Gato</option>
            </select>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="px-4 py-2 rounded font-bold text-[#40170E] bg-[#F2DCB3]"
            >
              <option value="">Ambos géneros</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </div>

          {loading ? (
            <p className="text-2xl text-center text-[#F2DCB3]">Cargando...</p>
          ) : error ? (
            <p className="text-2xl text-center text-red-500">Error: {error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {animals.map((animal) => (
                  <div
                    key={animal.id}
                    onClick={() => handleAnimalClick(animal)}
                    className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
                  >
                    <div className="h-48 overflow-hidden relative">
                      {animal.status === 'requires_funding' && (
                        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                          PRIORIDAD
                        </span>
                      )}

                      <img
                        src={`http://localhost:8080/images/animal/${animal.image}`}
                        alt={animal.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 bg-[#F2DCB3] ">
                      <h2
                        className="text-xl font-bold mb-2"
                        style={{ color: "#40170E" }}
                      >
                        {animal.name}
                      </h2>
                      <div className="mb-2 text-[#40170E]">
                        <strong className="text-[#D97236]">Edad: </strong>
                        {animal.age} {animal.age === 1 ? "año" : "años"}
                      </div>
                      <div className="mb-2 text-[#40170E]">
                        <strong className="text-[#D97236]">Peso: </strong>
                        {animal.weight} Kg
                      </div>
                      <div className="mb-2 text-[#40170E]">
                        <strong className="text-[#D97236]">Sexo: </strong>
                        {animal.gender}
                      </div>
                      <div className="mb-2 text-[#40170E]">
                        <strong className="text-[#D97236]">Raza: </strong>
                        {animal.breed}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-10 gap-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="bg-[#D97236] text-[#40170E] px-4 py-2 rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-[#F2DCB3] self-center">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page + 1 >= totalPages}
                  className="bg-[#D97236] text-[#40170E] px-4 py-2 rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
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
