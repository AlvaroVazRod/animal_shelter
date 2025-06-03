"use client"

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
}

interface AnimalTag {
  id: number
  name: string
  color?: string
}

export const AdminAnimalsPage: React.FC = () => {
  const [animals, setAnimals] = useState<Animal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [editingAnimal, setEditingAnimal] = useState<Animal | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
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

      const response = await fetch(
        `http://localhost:8080/api/animales?${query.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

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
      const token = getToken();

      if (editingAnimal) {
        let uploadedFileName = "";
        if (!usingFirstImage) {
          if (!uploadedFile) {
            throw new Error("Debes subir una imagen para guardar el animal");
          }

          const formDataImage = new FormData();
          formDataImage.append("file", uploadedFile);

          const imageResponse = await fetch(`http://localhost:8080/api/animales/images/upload/${formData.id}`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`, // No pongas Content-Type aquí!
            },
            body: formDataImage,
          });

          if (!imageResponse.ok) {
            throw new Error("Error al subir la imagen");
          }
          const data = await imageResponse.json();
          console.log(data)
          uploadedFileName = data.filename;
        }

        if (uploadedFileName !== "") {
          formData.image = uploadedFileName;
        }
        formData.status = 'active'
        formData.arrivalDate = `${formData.arrivalDate}T03:00:00`

        const response = await fetch(`http://localhost:8080/api/animales/${formData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Error al editar el animal");
        }

        await fetchAnimals(page);
      } else {
        // Validación: imagen obligatoria
        if (!uploadedFile) {
          throw new Error("Debes subir una imagen para crear un nuevo animal");
        }

        const form = new FormData();

        // Prepara el objeto de animal para enviarlo como JSON
        formData.image = null
        formData.arrivalDate = `${formData.arrivalDate}T03:00:00`;
        formData.status = 'active'

        form.append("animal", new Blob([JSON.stringify(formData)], { type: "application/json" }));

        // Adjunta archivo de imagen
        form.append("file", uploadedFile); // si necesitas usar Blob puedes ajustarlo, pero normalmente File es suficiente

        const response = await fetch(`http://localhost:8080/api/animales`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: form,
        });

        if (!response.ok) {
          throw new Error("Error al crear el animal");
        }

        await fetchAnimals(page);
      }

      setIsModalOpen(false);
      setUsingFirstImage(true);
      setUploadedFile(null)
      setEditingAnimal(null)
    } catch (err) {
      console.error(err);
      throw new Error(
        err instanceof Error ? err.message : "Error al guardar el animal"
      );
    }
  };




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
            <Button onClick={handleCreateAnimal}>
              <Plus className="mr-2" size={16} />
              Nuevo Animal
            </Button>
          </div>

          {animals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-emerald-400/60">No hay animales registrados</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {animals.map((animal) => (
                  <Card key={animal.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-slate-100">{animal.name}</CardTitle>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditAnimal(animal)}
                            className="text-emerald-400 hover:text-emerald-300 hover:bg-slate-700"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleOpenImagesModal(animal)} className="text-blue-400 hover:text-blue-300 hover:bg-slate-700">
                            <ImageIcon size={16} />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteAnimal(animal.id)} className="text-red-400 hover:text-red-300 hover:bg-slate-700">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {animal.image && (
                        <img
                          src={"http://localhost:8080/images/animal/" + animal.image || "/placeholder.svg"}
                          alt={animal.name}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      )}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-slate-300">
                          <span className="font-medium">Especie:</span> {animal.species === "dog" ? "Perro" : "Gato"}
                        </div>
                        <div className="text-slate-300">
                          <span className="font-medium">Raza:</span> {animal.breed}
                        </div>
                        <div className="text-slate-300">
                          <span className="font-medium">Edad:</span> {animal.age} años
                        </div>
                        <div className="text-slate-300">
                          <span className="font-medium">Género:</span> {animal.gender}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        {getStatusBadge(animal.status)}
                        <div className="text-right text-sm text-slate-300">
                          <div>Adopción: ${animal.adoptionPrice}</div>
                          <div>Patrocinio: ${animal.sponsorPrice}</div>
                        </div>
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
                  <span className="text-slate-300">
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
              setIsModalOpen(false);
              setUsingFirstImage(true);
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
