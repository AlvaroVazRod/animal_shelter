import { useState, useEffect } from "react";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";
import { AnimalDetails } from "../components/AnimalDetails";
import { AnimalCard } from "../components/AnimalCard"; // Asegúrate de tener este componente
import type { Animal } from "../types/Animals";

interface AnimalsGridProps {
  animals: Animal[];
  onSelect: (animal: Animal) => void;
}

export const AnimalsGrid: React.FC<AnimalsGridProps> = ({
  animals,
  onSelect,
}) => {
  return (
    <div
      className="
        flex flex-wrap 
        max-h-[24rem] 
        overflow-auto
        gap-6
      "
      style={{
        maxHeight: "24rem", // altura para 2 filas aprox
      }}
    >
      {animals.map((animal) => (
        <AnimalCard
          key={animal.id}
          animal={animal}
          onClick={() => onSelect(animal)}
        />
      ))}
    </div>
  );
};

export const AnimalsPage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [breed, setBreed] = useState<string>("");
  const [gender, setGender] = useState<string>("");

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

  const getAnimalsTags = async (animals: Animal[]) => {
    const animalsWithTags = await Promise.all(
      animals.map(async (animal) => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/tags/animal/${animal.id}`
          );
          const tags = await response.json();
          return { ...animal, tags };
        } catch (error) {
          console.error(
            `Error al obtener tags para animal ${animal.id}`,
            error
          );
          return { ...animal, tags: [] };
        }
      })
    );
    return animalsWithTags;
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
        size: "8",
        ...(species ? { species } : {}),
        ...(gender ? { gender } : {}),
      });

      const response = await fetch(
        `http://localhost:8080/api/animales?${query}`
      );
      if (!response.ok) throw new Error("Error al obtener los animales");
      const data = await response.json();

      const formattedData = await getAnimalsTags(data.content);
      setAnimals(formattedData);
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
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-15 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto mt-6">
          <h1 className="text-4xl font-extrabold text-center mb-12 text-[#A444C5] tracking-tight">
            Nuestros peludos en busca de hogar
          </h1>

          {/* Filtros */}
          <div className="flex justify-center gap-6 mb-10">
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="px-4 py-2 rounded-md font-semibold shadow-sm bg-[#AD03CB] text-white focus:outline-none focus:ring-2 focus:ring-[#AD03CB]"
            >
              <option value="">Todas las espécies</option>
              <option value="dog">🐶Perros</option>
              <option value="cat">🐱Gatos</option>
            </select>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="px-4 py-2 rounded-md font-semibold shadow-sm bg-[#AD03CB] text-white focus:outline-none focus:ring-2 focus:ring-[#AD03CB]"
            >
              <option value="">Ambos géneros</option>
              <option value="femenino">♀️Femenino♀️</option>
              <option value="masculino">♂️Masculino♂️</option>
            </select>
          </div>

          {/* Animales */}
          {loading ? (
            <div className="text-2xl text-center text-[#AD03CB]">
              Cargando...
            </div>
          ) : error ? (
            <div className="text-2xl text-center text-red-500">
              Error: {error}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {animals.map((animal) => (
                  <AnimalCard
                    key={animal.id}
                    animal={animal}
                    onClick={() => handleAnimalClick(animal)}
                  />
                ))}
              </div>

              {/* Paginación */}
              <div className="flex justify-center mt-10 gap-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="flex items-center gap-2 bg-[#AD03CB] text-white px-4 py-2 rounded-full hover:bg-[#eb7cff] disabled:opacity-50 transition-colors"
                >
                  ←
                </button>
                <span className="text-[#AD03CB] self-center font-semibold">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page + 1 >= totalPages}
                  className="flex items-center gap-2 bg-[#AD03CB] text-white px-4 py-2 rounded-full hover:bg-[#eb7cff] disabled:opacity-50 transition-colors"
                >
                  →
                </button>
              </div>
            </>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && selectedAnimal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-lg max-w-2xl w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                onClick={closeModal}
              >
                ×
              </button>
              <AnimalDetails animal={selectedAnimal} onClose={closeModal} />
            </div>
          </div>
        )}
      </div>
    </DefaultPageTemplate>
  );
};

export default AnimalsPage;
