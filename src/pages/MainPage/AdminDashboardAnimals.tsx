import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
import { Loader2, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "../../components/icons/Icons"
import { EditAnimalModal } from "../../components/EditAnimalModal"
import { useUser } from "../../services/users/useUser"
import { AdminPageTemplate } from "../templates/AdminTemplate"
import { ImageIcon } from "lucide-react"
import { AnimalImagesModal } from "../../components/modals/AnimalImagesModel"
import { FiTrash2, FiEdit, FiGrid, FiTable } from "react-icons/fi";
import type { AnimalImage } from "../../types/Animals"
import { Swiper, SwiperSlide } from "swiper/react"
import { IoIosFemale, IoIosMale } from "react-icons/io";
import CountUp from 'react-countup';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";


interface Animal {
  id: number
  name: string
  species: string
  breed: string
  age: number
  gender: string
  status: string
  weight?: number
  color: string
  arrivalDate: string
  height?: number
  length?: number
  description: string
  image?: string | null
  adoptionPrice: number
  sponsorPrice: number
  tags?: AnimalTag[]
  images: AnimalImage[] | null
}

interface AnimalTag {
  id: number
  name: string
  color?: string
}

type ViewMode = "grid" | "table"

export const AdminAnimalsPage: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("table")
  const { getToken } = useUser()
  const [uploadedFile, setUploadedFile] = useState<File | null>()
  const [usingFirstImage, setUsingFirstImage] = useState<boolean>(true)
  const [selectedAnimalForImages, setSelectedAnimalForImages] = useState<Animal | null>(null)
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false)
  const [breed, setBreed] = useState<string>("");
  const [gender, setGender] = useState<string>("");

  const handleOpenImagesModal = (animal: Animal) => {
    setSelectedAnimalForImages(animal)
    setIsImagesModalOpen(true)
  }

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
    fetchAnimals(page)
  }, [page])

  useEffect(() => {
    fetchAnimals(0, breed, gender);
  }, [breed, gender]);

  const handleCreateAnimal = () => {
    setEditingAnimal(null)
    setIsModalOpen(true)
  }

  const handleEditAnimal = (animal: Animal) => {
    setEditingAnimal(animal)
    setIsModalOpen(true)
  }

  const handleDeleteAnimal = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este animal?")) return

    try {
      const token = getToken()
      const response = await fetch(`http://localhost:8080/api/animales/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Error al eliminar animal")

      // Refrescar la lista tras eliminar
      await fetchAnimals(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al eliminar animal")
    }
  }

  const handleSubmitAnimal = async (formData: Partial<Animal>) => {
    try {
      const token = getToken()

      if (editingAnimal) {
        let uploadedFileName = ""
        if (!usingFirstImage) {
          if (!uploadedFile) {
            throw new Error("Debes subir una imagen para guardar el animal")
          }

          const formDataImage = new FormData()
          formDataImage.append("file", uploadedFile)

          const imageResponse = await fetch(`http://localhost:8080/api/animales/images/upload/${formData.id}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`, // No pongas Content-Type aquí!
            },
            body: formDataImage,
          })

          if (!imageResponse.ok) {
            throw new Error("Error al subir la imagen")
          }
          const data = await imageResponse.json()
          console.log(data)
          uploadedFileName = data.filename
        }

        if (uploadedFileName !== "") {
          formData.image = uploadedFileName
        }
        formData.status = "active"
        formData.arrivalDate = `${formData.arrivalDate}T03:00:00`

        const response = await fetch(`http://localhost:8080/api/animales/${formData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          throw new Error("Error al editar el animal")
        }

        await fetchAnimals(page)
      } else {
        // Validación: imagen obligatoria
        if (!uploadedFile) {
          throw new Error("Debes subir una imagen para crear un nuevo animal")
        }

        const form = new FormData()

        // Prepara el objeto de animal para enviarlo como JSON
        formData.image = null
        formData.arrivalDate = `${formData.arrivalDate}T03:00:00`
        formData.status = "active"

        form.append("animal", new Blob([JSON.stringify(formData)], { type: "application/json" }))

        // Adjunta archivo de imagen
        form.append("file", uploadedFile) // si necesitas usar Blob puedes ajustarlo, pero normalmente File es suficiente

        const response = await fetch(`http://localhost:8080/api/animales`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        })

        if (!response.ok) {
          throw new Error("Error al crear el animal")
        }

        await fetchAnimals(page)
      }

      setIsModalOpen(false)
      setUsingFirstImage(true)
      setUploadedFile(null)
      setEditingAnimal(null)
    } catch (err) {
      console.error(err)
      throw new Error(err instanceof Error ? err.message : "Error al guardar el animal")
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: { label: "Disponible", variant: "default" as const },
      requires_funding: { label: "Adoptado", variant: "secondary" as const },
      draft: { label: "En proceso", variant: "outline" as const },
    }
    const statusInfo = statusMap[status as keyof typeof statusMap] || {
      label: status,
      variant: "outline" as const,
    }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const renderGridView = () => (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {animals.map((animal) => (
          <Card key={animal.id} className="">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center justify-center gap-1">
                  <CardTitle className="text-[#e8e8e8]">{animal.name}
                  </CardTitle>
                  {animal.gender === "masculino" ? <IoIosFemale className="h-3 w-3 text-[#e8e8e8]" /> : <IoIosMale className="h-3 w-3 text-[#e8e8e8]" />}
                </div>
                <div className="flex">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditAnimal(animal)}
                    className="hover:text-[#ad03cb]"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenImagesModal(animal)}
                    className="hover:text-blue-300"
                  >
                    <ImageIcon size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteAnimal(animal.id)}
                    className="hover:text-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {animal.image && (
                <div className="w-full h-48 rounded-xl mb-4 relative overflow-hidden bg-gray-200">
                  {/* --- Fondo con blur --- */}
                  <div className="absolute inset-0 z-0">
                    <img
                      src={`http://localhost:8080/images/animal/${animal.images?.[0]?.filename || animal.image
                        }`}
                      alt={`Fondo de ${animal.name}`}
                      className="w-full h-full object-cover filter blur-md" // ¡Blur aplicado aquí!
                    />
                  </div>

                  {/* --- Carrusel (imagen principal centrada) --- */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <Swiper
                      spaceBetween={10}
                      slidesPerView={1}
                      loop
                      className="w-full h-full max-w-70"
                    >
                      {(animal.images ?? []).length > 0 ? (
                        animal.images?.map((img, index) => (
                          <SwiperSlide
                            key={`${animal.id}-${index}`}
                            className="flex items-center justify-center h-full"
                          >
                            <div className="swiper-slide place-items-center flex-important">
                              <img
                                src={`http://localhost:8080/images/animal/${img.filename}`}
                                alt={animal.name}
                                className="max-h-full max-w-full object-contain shadow-lg"
                              />
                            </div>

                          </SwiperSlide>
                        ))
                      ) : (
                        <SwiperSlide className="flex items-center justify-center h-full">
                          <div className="swiper-slide place-items-center flex-important">
                            <img
                              src={`http://localhost:8080/images/animal/${animal.image}`}
                              alt={animal.name}
                              className="max-h-full max-w-full object-contain shadow-lg"
                            />
                          </div>

                        </SwiperSlide>
                      )}
                    </Swiper>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 text-sm text-[#e8e8e8]">
                {/* <span className="align-middle justify-center px-2 py-1 inline-flex text-xs leading-5 rounded-full font-bold border-2 border-[#c27aff] text-[#c27aff]">
                  <CountUp end={animal.weight ?? NaN} duration={0} decimals={2} suffix=" Kg" />
                </span>
                <span className="align-middle justify-center px-2 py-1 inline-flex text-xs leading-5 rounded-full font-bold border-2 border-[#c27aff] text-[#c27aff]">
                  <CountUp end={animal.age} duration={0} decimals={0} suffix=" años" />
                  </span>
                <span className="align-middle justify-center px-2 py-1 inline-flex text-xs leading-5 rounded-full font-bold border-2 border-[#c27aff] text-[#c27aff]">
                  🐶{animal.breed}</span>
                <span className="align-middle justify-center px-2 py-1 inline-flex text-xs leading-5 rounded-full font-bold border-2 border-[#c27aff] text-[#c27aff]">
                  <CountUp end={animal.length || NaN} duration={0} decimals={2} suffix=" cm" />
                </span> */}
                <span className="align-middle justify-center px-2 py-1 inline-flex text-xs leading-5 rounded-full font-medium bg-[#ad03cb] text-white">
                  <CountUp end={animal.weight ?? NaN} duration={0} decimals={2} suffix=" Kg" />
                </span>
                <span className="align-middle justify-center px-2 py-1 inline-flex text-xs leading-5 rounded-full font-medium bg-[#ad03cb] text-white">
                  <CountUp end={animal.age} duration={0} decimals={0} suffix=" años" />
                </span>
                <span className="align-middle justify-center px-2 py-1 inline-flex text-xs leading-5 rounded-full font-medium bg-[#ad03cb] text-white">
                  🐶{animal.breed}</span>
                <span className="align-middle justify-center px-2 py-1 inline-flex text-xs leading-5 rounded-full font-medium bg-[#ad03cb] text-white">
                  <CountUp end={animal.length || NaN} duration={0} decimals={2} suffix=" cm" />
                </span>
                <div><br></br></div>
                <div></div>
                <span className="align-middle justify-center inline-flex text-xs leading-5 rounded-full font-semibold text-white">
                  Adopción
                </span>
                <span className="align-middle justify-center inline-flex text-xs leading-5 rounded-full font-semibold text-white">
                  Sponsor
                </span>

                <span className="align-middle justify-center px-2 py-1 inline-flex text-xs leading-5 font-medium text-white">
                  <CountUp end={animal.adoptionPrice} duration={1.2} decimals={2} suffix=" €" className="py-1 px-4 rounded-full bg-[#ad03cb]" />
                </span>
                <span className="align-middle justify-center px-2 py-1 inline-flex text-xs leading-5 font-medium text-white">
                  <CountUp end={animal.sponsorPrice} duration={1.2} decimals={2} suffix=" €" className="py-1 px-4 rounded-full bg-[#ad03cb]" />
                </span>
              </div>
              <div className="flex justify-between items-center">
              </div>
              {/* {animal.tags && animal.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {animal.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="text-xs"
                      style={{ borderColor: tag.color, color: tag.color }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )} */}
            </CardContent>
          </Card>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-center items-center mt-10 gap-4">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
            className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#AD03CB] text-white hover:bg-[#eb7cff] disabled:opacity-50 transition-colors"
          >
            ← Anterior
          </button>
          <span className="text-[#AD03CB] font-semibold text-center">
            Página {page + 1} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page + 1 >= totalPages}
                  className="w-full sm:w-auto px-4 py-2 rounded-full bg-[#AD03CB] text-white hover:bg-[#eb7cff] disabled:opacity-50 transition-colors"
                >
                  Siguiente →
                </button>
        </div>
      )}
    </div>
  );


  const renderTableView = () => (
    <div className="rounded-lg overflow-hidden">
      <div className="rounded-lg shadow-lg border-2 border-[#ad03cb] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#8200db]/50">
            <thead className="bg-[#ad03cb]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                  Animal
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                  Información
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">

                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                  Adopción
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                  Apadrinar
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#a800b714]/80 divide-y divide-[#c27aff]/30">
              {animals.map((animal) => (
                <tr key={animal.id} className="hover:bg-[#a800b714] transition-colors">
                  {/* Animal */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#8200db] flex items-center justify-center text-[#e8e8e8]">
                        {animal.gender === "masculino" ? <IoIosFemale className="h-5 w-5" /> : <IoIosMale className="h-5 w-5" />}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#e8e8e8]">{animal.name}</div>
                        <div className="text-sm text-[#e8e8e8]/80">ID: {animal.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Información */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#e8e8e8]">
                      <div className="flex items-center">
                        <span className="mr-2 font-bold text-[#c27aff]">Especie:</span>{animal.species}
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="mr-2 font-bold text-[#c27aff]">Raza:</span>{animal.breed}
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="mr-2 font-bold text-[#c27aff]">Edad:</span>{animal.age} años
                      </div>
                    </div>
                  </td>

                  {/* Dimensiones */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#e8e8e8]">
                      <div className="flex items-center">
                        <span className="mr-2 font-bold text-[#c27aff]">Altura:</span>{animal.height} cm
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="mr-2 font-bold text-[#c27aff]">Largo:</span>{animal.length} cm
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="mr-2 font-bold text-[#c27aff]">Peso:</span>{animal.weight} kg
                      </div>
                    </div>
                  </td>

                  {/* Precio Adopción */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#8200db] text-white">
                      <CountUp end={animal.adoptionPrice} duration={1.2} decimals={2} suffix=" €" />
                    </span>
                  </td>

                  {/* Precio Apadrinar */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#8200db] text-white">
                      <CountUp end={animal.sponsorPrice} duration={1.2} decimals={2} suffix=" €" />
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-[#c27aff] hover:text-[#ad03cb] mr-4 transition-colors"
                      title="Editar animal"
                      onClick={() => handleEditAnimal(animal)}
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleOpenImagesModal(animal)}
                      className="text-[#c27aff] hover:text-blue-300 mr-4 transition-colors"
                      title="Imagenes animal"
                    >
                      <ImageIcon size={20} />

                    </button>
                    <button
                      onClick={() => handleDeleteAnimal(animal.id)}
                      className="text-[#c27aff] hover:text-red-600 transition-colors"
                      title="Eliminar animal"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>


                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex justify-between items-center px-6 py-4 bg-[#a800b714] border-t border-[#5f4075]/50">
          <div className="text-sm font-medium text-[#c27aff]">
            Mostrando página {page + 1} de {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className={`w-full sm:w-auto px-4 py-2 rounded-full bg-[#AD03CB] text-white hover:bg-[#eb7cff] disabled:opacity-50 transition-colors`}
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page + 1 >= totalPages}
              className={`w-full sm:w-auto px-4 py-2 rounded-full bg-[#AD03CB] text-white hover:bg-[#eb7cff] disabled:opacity-50 transition-colors`}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );



  if (loading) {
    return (
      <div className="min-h-screen bg-[#2D2A32] p-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-2 text-[#c27aff]">
            <Loader2 size={24} />
            <span className="text-xl">Cargando animales...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#2D2A32] p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl text-red-400">Error: {error}</div>
        </div>
      </div>
    )
  }

  return (
    <AdminPageTemplate>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-20 bg-[#2D2A32]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 text-center">
            <h1 className="text-4xl font-bold mb-2 text-slate-100">Panel de Administración</h1>
            <p className="text-lg text-slate-300 mb-6">Gestión de animales registrados</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={handleCreateAnimal} className="min-w-40">
                <Plus className="mr-2" size={16} />
                Nuevo Animal
              </Button>
                        {/* Filtros */}
          <div className="w-full max-w-[400px] sm:max-w-full mx-auto flex flex-col px-auto sm:flex-row justify-center items-center gap-4">
            <select
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="sm:w-auto px-4 py-2 rounded-md font-semibold shadow-sm bg-[#AD03CB] text-white focus:outline-none focus:ring-2 focus:ring-[#AD03CB]"
            >
              <option value="">Todas las especies</option>
              <option value="dog">🐶 Perros</option>
              <option value="cat">🐱 Gatos</option>
            </select>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="sm:w-auto px-4 py-2 rounded-md font-semibold shadow-sm bg-[#AD03CB] text-white focus:outline-none focus:ring-2 focus:ring-[#AD03CB]"
            >
              <option value="">Ambos géneros</option>
              <option value="femenino">♀️ Femenino</option>
              <option value="masculino">♂️ Masculino</option>
            </select>
          </div>

              <div className="flex items-center bg-[#a800b714] rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`${viewMode === "grid"
                    ? "bg-[#8200db] text-white"
                    : "text-slate-300 hover:text-slate-100 hover:bg-[#a800b714]"
                    }`}
                >
                  <FiGrid className="color-white h8 w8"/>
                  
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className={`${viewMode === "table"
                    ? "bg-[#8200db] text-white"
                    : "text-slate-300 hover:text-slate-100 hover:bg-[#a800b714]"
                    }`}
                >
                  <FiTable className="color-white h18 w18"/>
                </Button>
              </div>
            </div>
          </div>

          {animals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-white">No hay animales registrados</p>
            </div>
          ) : (
            <div className="space-y-6">
              {viewMode === "grid" ? renderGridView() : renderTableView()}
            </div>
          )}

          <EditAnimalModal
            isOpen={isModalOpen}
            animal={editingAnimal}
            onClose={() => {
              setIsModalOpen(false)
              setUsingFirstImage(true)
              setUploadedFile(null)
              setEditingAnimal(null)
            }}
            onSubmit={handleSubmitAnimal}
            onImageUploaded={setUploadedFile}
            onFirstImageDeleted={setUsingFirstImage}
          />
          <AnimalImagesModal
            isOpen={isImagesModalOpen}
            animal={selectedAnimalForImages}
            onClose={() => setIsImagesModalOpen(false)}
            refreshAnimals={() => fetchAnimals(page)}
          />
        </div>
      </div>
    </AdminPageTemplate>
  )
}

export default AdminAnimalsPage