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
  onFirstImageDeleted: (isDeleted: boolean) => void
}

export const EditAnimalModal: React.FC<EditAnimalModalProps> = ({ isOpen, animal, onClose, onSubmit, onImageUploaded, onFirstImageDeleted }) => {
  const [formData, setFormData] = useState<Partial<Animal>>({})
  const [, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedTags, setSelectedTags] = useState<AnimalTag[]>([])
  const { getToken } = useUser()
  const { tags,  fetchTags } = useTags({ getToken })


  const speciesOptions = [
    { value: "dog", label: "Perro" },
    { value: "cat", label: "Gato" },
  ]

  const genderOptions = [
    { value: "masculino", label: "Masculino" },
    { value: "femenino", label: "Femenino" },
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
          <div className="relative w-full">
            <label className="block text-sm font-medium text-slate-200 mb-1">Fecha llegada *</label>
            <input
              value={formData.arrivalDate ? formData.arrivalDate.slice(0, 10) : ""}
              onChange={(e) => handleInputChange("arrivalDate", e.target.value)}
              required
              type="date"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#ad03cb] focus:border-transparent bg-[#35273a] border-[#c27aff] text-slate-100 pr-10"
            />
            <svg className="absolute right-4 top-8 h-5 w-5 text-slate-200 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10m-11 4h12M4 5h16a2 2 0 012 2v14a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
            </svg>
          </div>
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
                <div className="border-2 border-dashed border-[#5f4075] rounded-md p-4 text-center">
                  <Upload className="mx-auto text-slate-200 mb-2" size={32} />
                  <p className="text-sm text-slate-200">Subir imagen</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#8200db] file:text-slate-200 hover:file:bg-[#AD03CB]"
              />
            </Card>
          </div>

          {/* Tags */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-200">Etiquetas</label>
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap gap-1 border-b-1 border-[#5f4075] pb-2">
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="cursor-pointer"
                    style={{ backgroundColor: "#35273a", color: tag.color }}
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
                      className="cursor-pointer bg-[#3e2443]"
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
          <Button type="button" onClick={onClose} disabled={isSaving}>
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
