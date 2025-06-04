import React, { useEffect, useState } from "react"
import { Modal } from "../../components/ui/Modal"
import { Button } from "../../components/ui/Button"
import { Card } from "../../components/ui/Card"
import { useUser } from "../../services/users/useUser"
import { Upload, X, Image as ImageIcon, Edit, Trash2, ChevronLeft, ChevronRight, Plus, Loader2 } from "lucide-react"

interface AnimalImage {
    id: number
    filename: string
}

interface AnimalImagesModalProps {
    isOpen: boolean
    animal: { id: number; name: string } | null
    onClose: () => void
    refreshAnimals: () => void
}

export const AnimalImagesModal: React.FC<AnimalImagesModalProps> = ({ isOpen, animal, onClose, refreshAnimals }) => {
    const [images, setImages] = useState<AnimalImage[]>([])
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const { getToken } = useUser()

    const fetchImages = async () => {
        if (!animal) return
        const token = getToken()
        const res = await fetch(`http://localhost:8080/api/animales/images/${animal.id}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (res.ok) {
            const data = await res.json()
            setImages(data)
        }
    }

    useEffect(() => {
        if (isOpen && animal) {
            fetchImages()
        }
    }, [isOpen, animal])

    const handleUpload = async () => {
        if (!selectedFile || !animal) return
        const token = getToken()
        const formData = new FormData()
        formData.append("file", selectedFile)
        setLoading(true)
        try {
            const res = await fetch(`http://localhost:8080/api/animales/images/upload/${animal.id}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })
            if (!res.ok) throw new Error("Error al subir la imagen")
            await fetchImages()
            setSelectedFile(null)
            refreshAnimals()
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (imageId: number) => {
        if (!window.confirm("¿Eliminar esta imagen?")) return
        const token = getToken()
        try {
            const res = await fetch(`http://localhost:8080/api/animales/images/${imageId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error("Error al eliminar imagen")
            await fetchImages()
            refreshAnimals()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Imágenes de ${animal?.name ?? "animal"}`}>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Nueva imagen</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                        className="mt-2 w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#8200db] file:text-slate-200 hover:file:bg-[#AD03CB]"
                        />
                    <Button onClick={handleUpload} disabled={!selectedFile || loading} className="mt-2">
                        <Upload size={16} className="mr-1" /> Subir imagen
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img) => (
                        <Card key={img.id} className="relative">
                            <img
                                src={`http://localhost:8080/images/animal/${img.filename}`}
                                alt=""
                                className="w-full h-32 object-cover rounded-md"
                            />
                            <Button
                                variant="ghost"
                                onClick={() => handleDelete(img.id)}
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white"
                            >
                                <Trash2 size={14} />
                            </Button>
                        </Card>
                    ))}
                </div>

                {images.length === 0 && <p className="text-slate-400">Este animal no tiene imágenes adicionales.</p>}
            </div>
        </Modal>
    )
}
