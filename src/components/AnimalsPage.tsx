import { useState, useEffect } from "react";
import type { Animal } from "../types/Animals";
import { DefaultPageTemplate } from "../pages/templates/DefaultTemplate";
import { AnimalDetails } from "../components/AnimalDetails";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

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

  const fetchAnimals = async (pageNumber: number, species?: string, gender?: string) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: String(pageNumber),
        size: "4",
        ...(species ? { species } : {}),
        ...(gender ? { gender } : {}),
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
    fetchAnimals(0, breed, gender);
  }, [breed, gender]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      fetchAnimals(newPage, breed, gender);
    }
  };

  return (
    <DefaultPageTemplate>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-20 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto mt-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-[#A444C5] tracking-tight">
            Nuestros peludos en busca de hogar
          </h1>

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
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
            </select>
          </div>

          {loading ? (
            <div className="text-2xl text-center text-[#AD03CB]">Cargando...</div>
          ) : error ? (
            <div className="text-2xl text-center text-red-500">Error: {error}</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {animals.map((animal) => (
                  <div
                    key={animal.id}
                    onClick={() => handleAnimalClick(animal)}
                    className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    <div className="h-48 overflow-hidden relative">
                      {animal.status === "requires_funding" && (
                        <span className="absolute top-2 left-2 bg-red-700 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wide shadow-md">
                          PRIORIDAD
                        </span>
                      )}

                      <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        slidesPerView={1}
                        spaceBetween={10}
                        loop
                        autoplay={{ delay: 10000, disableOnInteraction: false }}
                        pagination={{ clickable: true }}
                      >
                        {(animal.images ?? []).length > 0 ? (
                          animal.images?.map((img, index) => (
                            <SwiperSlide key={`${animal.id}-${index}`}>
                              <img
                                src={`http://localhost:8080/images/animal/${img.filename}`}
                                alt={animal.name}
                                className="w-full h-48 object-cover rounded-t-2xl"
                              />
                            </SwiperSlide>
                          ))
                        ) : (
                          <SwiperSlide key={`${animal.id}-default`}>
                            <img
                              src={`http://localhost:8080/images/animal/${animal.image}`}
                              alt={animal.name}
                              className="w-full h-48 object-cover rounded-t-2xl"
                            />
                          </SwiperSlide>
                        )}
                      </Swiper>
                    </div>
                    <div className="p-4 bg-[#fdf3ff]">
                      <h2 className="text-lg font-bold text-[#AD03CB] mb-1">
                        {animal.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        <strong className="text-[#AD03CB]">Edad: </strong>
                        {animal.age} {animal.age === 1 ? "año" : "años"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong className="text-[#AD03CB]">Peso: </strong>
                        {animal.weight} Kg
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong className="text-[#AD03CB]">Sexo: </strong>
                        {animal.gender}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong className="text-[#AD03CB]">Raza: </strong>
                        {animal.breed}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-10 gap-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                  className="flex items-center gap-2 bg-[#AD03CB] text-white px-4 py-2 rounded-full hover:bg-[#bd5f28] disabled:opacity-50 transition-colors"
                >
                  ←
                </button>
                <span className="text-[#AD03CB] self-center font-semibold">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page + 1 >= totalPages}
                  className="flex items-center gap-2 bg-[#AD03CB] text-white px-4 py-2 rounded-full hover:bg-[#bd5f28] disabled:opacity-50 transition-colors"
                >
                  →
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
