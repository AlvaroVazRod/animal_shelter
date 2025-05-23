import { useState, useEffect } from "react";
import type { Animal } from "../types/Animals";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";
import { AnimalDetails } from "../components/AnimalDetails"; // Ajusta esta ruta si es necesario

export const AnimalsPage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [breed, setBreed] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  // Modal
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    breed?: string,
    gender?: string
  ) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(pageNumber),
        size: "10",
        ...(breed ? { breed } : {}),
        ...(gender ? { gender } : {}),
      });

      const response = await fetch(
        `http://localhost:8080/api/animales?${query}`
      );
      if (!response.ok) throw new Error("Error al obtener los animales");
      const data = await response.json();

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

  return (
    <DefaultPageTemplate>
      <div
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: "#40170E" }}
      >
        <div className="max-w-7xl mx-auto mt-6">
          <h1
            className="text-4xl font-bold mb-8 text-center"
            style={{ color: "#F2DCB3" }}
          >
            Nuestros Peludos en Busca de Hogar
          </h1>

          {/* Filtros */}
          <div className="flex justify-center gap-6 mb-10">
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="px-4 py-2 rounded font-bold"
              style={{ color: "#40170E", backgroundColor: "#F2DCB3" }}
            >
              <option value="">Todas las espécies</option>
              <option value="perro">Perro</option>
              <option value="gato">Gato</option>
            </select>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="px-4 py-2 rounded font-bold"
              style={{ color: "#40170E", backgroundColor: "#F2DCB3" }}
            >
              <option value="">Ambos géneros</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </div>

          {loading ? (
            <div className="text-2xl text-center text-[#F2DCB3]">
              Cargando...
            </div>
          ) : error ? (
            <div className="text-2xl text-center text-red-500">
              Error: {error}
            </div>
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
                      {!animal.priority && (
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

              {/* Paginación */}
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
