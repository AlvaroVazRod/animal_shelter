"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Modal } from "./ui/Modal"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Textarea } from "./ui/Textarea"
import { Select } from "./ui/Select"
import { Badge } from "./ui/Badge"
import { Card } from "./ui/Card"
import { Upload, X, Plus, Loader2 } from "./icons/Icons"
import { useTags } from "../services/tags/useTags"
import { useUser } from "../services/users/useUser"

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

interface EditAnimalModalProps {
  isOpen: boolean
  animal?: Animal | null
  onClose: () => void
  onSubmit: (formData: Partial<Animal>) => Promise<void>
  onImageUploaded: (file: File | null) => void
  onFirstImageDeleted: (isDeleted:boolean) => void
}

export const EditAnimalModal: React.FC<EditAnimalModalProps> = ({ isOpen, animal, onClose, onSubmit, onImageUploaded, onFirstImageDeleted }) => {
  const [formData, setFormData] = useState<Partial<Animal>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<AnimalTag[]>([])
  const [showTagInput, setShowTagInput] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const { getToken } = useUser()
  const { tags, loading, fetchTags } = useTags({ getToken })


  const speciesOptions = [
    { value: "dog", label: "Perro" },
    { value: "cat", label: "Gato" },
  ]

  const genderOptions = [
    { value: "masculino", label: "Masculino" },
    { value: "femenino", label: "Femenino" },
  ]

  const statusOptions = [
    { value: "active", label: "Disponible" },
    { value: "requires_funding", label: "Adoptado" },
    { value: "draft", label: "En proceso" },
  ]

  useEffect(() => {
    fetchTags()
    if (animal) {
      setFormData(animal)
      setSelectedTags(animal.tags || [])
      setImagePreview("http://localhost:8080/images/animal/" + animal.image || null)
    } else {
      setFormData({
        name: "",
        species: "",
        breed: "",
        age: 0,
        gender: "",
        status: "",
        color: "",
        arrivalDate: "",
        description: "",
        adoptionPrice: 0,
        sponsorPrice: 0,
      })
      setSelectedTags([])
      setImagePreview(null)
    }
    setImageFile(null)
    setError(null)
  }, [animal, isOpen])

  const handleInputChange = (field: keyof Animal, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      onImageUploaded(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      onImageUploaded(null)
    }
  }

  const handleAddTag = (tag: AnimalTag) => {
    if (!selectedTags.find((t) => t.id === tag.id)) {
      setSelectedTags((prev) => [...prev, tag])
    }
  }

  const handleRemoveTag = (tagId: number) => {
    setSelectedTags((prev) => prev.filter((t) => t.id !== tagId))
  }

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      const newTag: AnimalTag = {
        id: Date.now(),
        name: newTagName.trim(),
        color: "#4ECCA3",
      }
      handleAddTag(newTag)
      setNewTagName("")
      setShowTagInput(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.species || !formData.breed) {
      setError("Por favor completa todos los campos requeridos")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const submitData = {
        ...formData,
        tags: selectedTags,
      }
      await onSubmit(submitData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el animal")
    } finally {
      setIsSaving(false)
    }
  }

  const filteredTags = (tags || []).filter(
    (tag) => !selectedTags.find((selected) => selected.id === tag.id)
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={animal ? "Editar Animal" : "Crear Animal"}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre *"
            value={formData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
          <Input
            label="Adopción ($) *"
            type="number"
            step="0.01"
            value={formData.adoptionPrice || ""}
            onChange={(e) => handleInputChange("adoptionPrice", Number.parseFloat(e.target.value))}
            required
          />
        </div>

        {/* Species, Breed, Age */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Especie *"
            value={formData.species?.toLocaleLowerCase() || ""}
            onChange={(e) => handleInputChange("species", e.target.value)}
            options={speciesOptions}
            required
          />
          <Input
            label="Raza *"
            value={formData.breed || ""}
            onChange={(e) => handleInputChange("breed", e.target.value)}
            required
          />
          <Input
            label="Edad *"
            type="number"
            value={formData.age || ""}
            onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value))}
            required
          />
        </div>

        {/* Gender, Status, Weight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Género *"
            value={formData.gender || ""}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            options={genderOptions}
            required
          />
          <Input
            label="Peso (kg)"
            type="number"
            step="0.1"
            value={formData.weight || ""}
            onChange={(e) => handleInputChange("weight", Number.parseFloat(e.target.value))}
          />
        </div>

        {/* Color and Arrival Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Color *"
            value={formData.color || ""}
            onChange={(e) => handleInputChange("color", e.target.value)}
            required
          />
          <Input
            label="Fecha de Llegada *"
            type="date"
            value={formData.arrivalDate ? formData.arrivalDate.slice(0, 10) : ""}
            onChange={(e) => handleInputChange("arrivalDate", e.target.value)}
            required
          />
        </div>

        {/* Height and Length */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Altura (cm)"
            type="number"
            value={formData.height || ""}
            onChange={(e) => handleInputChange("height", Number.parseFloat(e.target.value))}
          />
          <Input
            label="Largo (cm)"
            type="number"
            value={formData.length || ""}
            onChange={(e) => handleInputChange("length", Number.parseFloat(e.target.value))}
          />
        </div>

        {/* Description, Image, and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Description */}
          <Textarea
            label="Descripción *"
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={5}
            required
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Imagen</label>
            <Card className="p-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1"
                    onClick={() => {
                      setImagePreview(null)
                      setImageFile(null)
                      onImageUploaded(null)
                      onFirstImageDeleted(false)
                    }}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-600 rounded-md p-4 text-center">
                  <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                  <p className="text-sm text-slate-400">Subir imagen</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-slate-600 file:text-slate-200 hover:file:bg-slate-500"
              />
            </Card>
          </div>

          {/* Tags */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-200">Etiquetas</label>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowTagInput(!showTagInput)}
                className="text-emerald-400 hover:text-emerald-300"
              >
                <Plus size={16} />
              </Button>
            </div>

            {showTagInput && (
              <div className="flex gap-2 mb-2">
                <input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Nueva etiqueta"
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  onKeyPress={(e) => e.key === "Enter" && handleCreateTag()}
                />
                <Button type="button" size="sm" onClick={handleCreateTag}>
                  Crear
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 border-b-1 border-slate-700 pb-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="cursor-pointer"
                    style={{ backgroundColor: "#314158", color: tag.color }}
                    onClick={() => handleRemoveTag(tag.id)}
                  >
                    {tag.name} <X className="ml-1" size={12} />
                  </Badge>
                ))}
              </div>

              <div className="max-h-24 overflow-y-auto">
                <div className="flex flex-wrap gap-1">
                  {filteredTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="cursor-pointer bg-slate-700"
                      style={{ borderColor: tag.color, color: tag.color }}
                      onClick={() => handleAddTag(tag)}
                    >
                      {tag.name} <Plus className="ml-1" size={12} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="text-red-400 font-semibold">{error}</div>}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2" size={16} />}
            {animal ? "Guardar" : "Crear"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
