"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "../../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Loader2, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "../../components/icons/Icons"
import { EditAnimalModal } from "../../components/EditAnimalModal"
import { useUser } from "../../services/users/useUser"
import { AdminPageTemplate } from "../templates/AdminTemplate"
import { ImageIcon } from "lucide-react"
import { AnimalImagesModal } from "../../components/modals/AnimalImagesModel"
import { FiTrash2, FiEdit, FiAlertCircle, FiInfo } from "react-icons/fi";
import type { AnimalImage } from "../../types/Animals"
import { Swiper, SwiperSlide } from "swiper/react"


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
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const { getToken } = useUser()
  const [uploadedFile, setUploadedFile] = useState<File | null>()
  const [usingFirstImage, setUsingFirstImage] = useState<boolean>(true)
  const [selectedAnimalForImages, setSelectedAnimalForImages] = useState<Animal | null>(null)
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false)

  const handleOpenImagesModal = (animal: Animal) => {
    setSelectedAnimalForImages(animal)
    setIsImagesModalOpen(true)
  }

  const fetchAnimals = async (pageNumber: number) => {
    setLoading(true)
    setError(null)
    try {
      const token = getToken()
      const query = new URLSearchParams({
        page: String(pageNumber),
        size: "10",
      })

      const response = await fetch(`http://localhost:8080/api/animales?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Error al obtener los animales")
      const data = await response.json()

      const animalsWithFormattedDate = data.content.map((animal: any) => {
        if (animal.arrivalDate) {
          return {
            ...animal,
            arrivalDate: animal.arrivalDate.substring(0, 10),
          }
        }
        return animal
      })

      setAnimals(animalsWithFormattedDate)
      setTotalPages(data.totalPages)
      setPage(data.number)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnimals(page)
  }, [page])

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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
      {animals.map((animal) => (
        <Card key={animal.id} className="">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-[#e8e8e8]">{animal.name}</CardTitle>
              <div className="flex space-x-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditAnimal(animal)}
                  className="hover:text-[#7ddbc8]"
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
            src={`http://localhost:8080/images/animal/${
              animal.images?.[0]?.filename || animal.image
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
            className="w-full h-full"
          >
            {(animal.images ?? []).length > 0 ? (
              animal.images?.map((img, index) => (
                <SwiperSlide
                  key={`${animal.id}-${index}`}
                  className="flex items-center justify-center h-full"
                >
                  <img
                    src={`http://localhost:8080/images/animal/${img.filename}`}
                    alt={animal.name}
                    className="max-h-full max-w-full object-contain mx-auto shadow-lg"
                  />
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide className="flex items-center justify-center h-full">
                <img
                  src={`http://localhost:8080/images/animal/${animal.image}`}
                  alt={animal.name}
                  className="max-h-full max-w-full object-contain mx-auto shadow-lg"
                />
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </div>
            )}
            <div className="grid grid-cols-2 gap-2 text-sm text-[#e8e8e8]">
              <div>
                <span className="text-[#a4ebd4] font-medium">Especie:</span> {animal.species === "dog" ? "Perro" : "Gato"}
              </div>
              <div>
                <span className="text-[#a4ebd4] font-medium">Raza:</span> {animal.breed}
              </div>
              <div>
                <span className="text-[#a4ebd4] font-medium">Edad:</span> {animal.age} años
              </div>
              <div>
                <span className="text-[#a4ebd4] font-medium">Género:</span> {animal.gender}
              </div>
            </div>
            <div className="flex justify-between items-center">
              {/* <div className="text-right text-sm text-[#e8e8e8]">
                <div>Adopción: ${animal.adoptionPrice}</div>
                <div>Patrocinio: ${animal.sponsorPrice}</div>
              </div> */}
            </div>
            {animal.tags && animal.tags.length > 0 && (
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
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );


  const renderTableView = () => (
    <div className="rounded-lg overflow-hidden">
      <div className=" rounded-lg shadow-lg border-2 border-[#8200db] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#8200db]/50">
            <thead className="bg-[#8200db]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                  Animal
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                  Información
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#a800b714]/80 divide-y divide-[#c27aff]/30">
              {animals.map((animal) => (
                <tr
                  key={animal.id}
                  className="hover:bg-[#a800b714] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#8200db] flex items-center justify-center text-[#e8e8e8]">
                        <FiInfo className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-[#e8e8e8]">
                          {animal.name}
                        </div>
                        <div className="text-sm text-[#e8e8e8]/80">
                          ID: {animal.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#e8e8e8]">
                      <div className="flex items-center">
                        <span className="mr-2 font-bold text-[#c27aff]">Especie:</span>
                        {animal.species}
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="mr-2 font-bold text-[#c27aff]">Raza:</span>
                        {animal.breed}
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="mr-2 font-bold text-[#c27aff]">Edad:</span>
                        {animal.age} años
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* Puedes completar aquí la prioridad si es necesario */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${animal.status === "disponible"
                        ? "bg-[#a4ebd4] text-[#3d5950]"
                        : "bg-[#a4ebad] text-[#3d5950]"
                        }`}
                    >
                      {animal.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteAnimal(animal.id)}
                      className="text-[#c27aff] hover:text-red-600 mr-4 transition-colors"
                      title="Eliminar animal"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                    <button
                      className="text-[#c27aff] hover:text-[#a800b7] transition-colors"
                      title="Editar animal"
                      onClick={() => setIsModalOpen(true)}
                    >
                      <FiEdit className="h-5 w-5" />
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
              className={`px-4 py-2 rounded-md font-semibold ${page === 0
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "w-full sm:w-auto px-4 py-2 rounded-full bg-[#AD03CB] text-white hover:bg-[#eb7cff] disabled:opacity-50 transition-colors"
                } transition-colors`}
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page + 1 >= totalPages}
              className={`px-4 py-2 rounded-md font-semibold ${page + 1 >= totalPages
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "w-full sm:w-auto px-4 py-2 rounded-full bg-[#AD03CB] text-white hover:bg-[#eb7cff] disabled:opacity-50 transition-colors"
                } transition-colors`}
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
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-2 text-emerald-400">
            <Loader2 size={24} />
            <span className="text-xl">Cargando animales...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
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
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2 text-slate-100">Panel de Administración</h1>
            <p className="text-lg text-slate-300 mb-6">Gestión de animales registrados</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button onClick={handleCreateAnimal}>
                <Plus className="mr-2" size={16} />
                Nuevo Animal
              </Button>

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
                  Grid
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
                  Tabla
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

              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-[#a800b714]">
                    Página {page + 1} de {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page === totalPages - 1}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
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