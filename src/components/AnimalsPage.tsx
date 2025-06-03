import { useState, useEffect } from "react";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";
import { AnimalDetails } from "../components/AnimalDetails";
import { AnimalCard } from "../components/AnimalCard";
import type { Animal } from "../types/Animals";
import { useSearchParams } from "react-router-dom";

export const AnimalsPage = () => {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<{ id: number; name: string }[]>([]);
  const [searchParams] = useSearchParams();
  const [species, setSpecies] = useState(searchParams.get("species") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "");
  const [sizeCategory, setSizeCategory] = useState(searchParams.get("sizeCategory") || "");
  const [tagId, setTagId] = useState(searchParams.get("tagId") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortby") || "arrivalDate");


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
          const response = await fetch(`http://localhost:8080/api/tags/animal/${animal.id}`);
          const tags = await response.json();
          return { ...animal, tags };
        } catch (error) {
          console.error(`Error al obtener tags para animal ${animal.id}`, error);
          return { ...animal, tags: [] };
        }
      })
    );
    return animalsWithTags;
  };

  const resetFilters = () => {
    setSpecies("");
    setGender("");
    setSizeCategory("");
    setTagId("");
    setSortBy("arrivalDate");
  };

  const fetchAnimals = async (pageNumber: number) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(pageNumber),
        size: "8",
        sortby: sortBy,
        ...(species && { species }),
        ...(gender && { gender }),
        ...(sizeCategory && { sizeCategory }),
        ...(tagId && { tagId }),
      });

      const response = await fetch(`http://localhost:8080/api/animales?${query}`);
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
    fetchAnimals(0);
  }, [species, gender, sizeCategory, tagId, sortBy]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/tags");
        const data = await res.json();
        setAvailableTags(data);
      } catch (err) {
        console.error("Error al cargar los tags", err);
      }
    };
    fetchTags();
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchAnimals(newPage);
    }
  };

  return (
    <DefaultPageTemplate>
      <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 bg-[#f5f5f5] pt-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-center mb-8 text-[#A444C5] tracking-tight">
            Nuestros peludos en busca de hogar
          </h1>

          {/* Filtros */}
          <div className="w-full max-w-[400px] sm:max-w-full mx-auto flex flex-col px-auto sm:flex-row justify-center items-center gap-4 mb-8">
            <select value={species} onChange={(e) => setSpecies(e.target.value)} className="sm:w-auto px-4 py-2 rounded-md font-semibold shadow-sm bg-[#AD03CB] text-white focus:outline-none focus:ring-2 focus:ring-[#AD03CB]">
              <option value="">Todas las especies</option>
              <option value="dog">🐶 Perros</option>
              <option value="cat">🐱 Gatos</option>
            </select>

            <select value={gender} onChange={(e) => setGender(e.target.value)} className="sm:w-auto px-4 py-2 rounded-md font-semibold shadow-sm bg-[#AD03CB] text-white focus:outline-none focus:ring-2 focus:ring-[#AD03CB]">
              <option value="">Ambos géneros</option>
              <option value="femenino">♀️ Femenino</option>
              <option value="masculino">♂️ Masculino</option>
            </select>

            <select value={sizeCategory} onChange={(e) => setSizeCategory(e.target.value)} className="sm:w-auto px-4 py-2 rounded-md font-semibold shadow-sm bg-[#AD03CB] text-white focus:outline-none focus:ring-2 focus:ring-[#AD03CB]">
              <option value="">Todos los tamaños</option>
              <option value="pequeño">🐾 Pequeño</option>
              <option value="mediano">🐾 Mediano</option>
              <option value="grande">🐾 Grande</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sm:w-auto px-4 py-2 rounded-md font-semibold shadow-sm bg-[#AD03CB] text-white focus:outline-none focus:ring-2 focus:ring-[#AD03CB]">
              <option value="arrivalDate">📅 Llegada (reciente primero)</option>
              <option value="arrivalDate,asc">📅 Llegada (antiguo primero)</option>
            </select>

            <select value={tagId} onChange={(e) => setTagId(e.target.value)} className="sm:w-auto px-4 py-2 rounded-md font-semibold shadow-sm bg-[#AD03CB] text-white focus:outline-none focus:ring-2 focus:ring-[#AD03CB]">
              <option value="">Todos los tags</option>
              {availableTags.map((tag) => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
            <button
              onClick={resetFilters}
              title="Limpiar filtros"
              className="text-[#AD03CB] hover:text-[#7a0299] text-xl px-3 py-2 rounded-full transition-colors border border-[#AD03CB] hover:bg-pink-50"
            >
              🗑️
            </button>
          </div>

          {/* Animales */}
          {loading ? (
            <div className="text-xl text-center text-[#AD03CB]">Cargando...</div>
          ) : error ? (
            <div className="text-xl text-center text-red-500">Error: {error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {animals.map((animal) => (
                  <AnimalCard key={animal.id} animal={animal} onClick={() => handleAnimalClick(animal)} />
                ))}
              </div>

              {/* Paginación */}
              <div className="flex flex-col sm:flex-row justify-center items-center mt-10 gap-4">
                <button onClick={() => handlePageChange(page - 1)} disabled={page === 0} className="pagination-button">
                  ← Anterior
                </button>
                <span className="text-[#AD03CB] font-semibold text-center">
                  Página {page + 1} de {totalPages}
                </span>
                <button onClick={() => handlePageChange(page + 1)} disabled={page + 1 >= totalPages} className="pagination-button">
                  Siguiente →
                </button>
              </div>
            </>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && selectedAnimal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-2 sm:px-4">
            <AnimalDetails animal={selectedAnimal} onClose={closeModal} />
          </div>
        )}
      </div>
    </DefaultPageTemplate>
  );
};
