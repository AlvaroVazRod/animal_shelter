import { useState, useCallback } from "react";
import type { AnimalTag } from "../../types/Animals";

interface UseTagsProps {
    getToken: () => string | null;
}

export function useTags({ getToken }: UseTagsProps) {
    const [tags, setTags] = useState<AnimalTag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTags = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/api/tags`);
            if (!response.ok) throw new Error("Error al obtener las etiquetas");
            const data = await response.json();
            setTags(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteTag = useCallback(
        async (id: number) => {
            if (!window.confirm("¿Estás seguro de eliminar esta etiqueta?")) return false;

            try {
                const token = getToken();
                const response = await fetch(`http://localhost:8080/api/tags/${id}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!response.ok) throw new Error("Error al eliminar etiqueta");

                setTags((prev) => prev.filter((tag) => tag.id !== id));
                return true;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error al eliminar etiqueta");
                return false;
            }
        },
        [getToken]
    );

    const updateTag = useCallback(
        async (
            tagId: number,
            form: Partial<AnimalTag>,
            selectedFile: File | null
        ): Promise<AnimalTag | null> => {
            try {
                const token = getToken();
                const formData = new FormData();
                formData.append("tag", new Blob([JSON.stringify(form)], { type: "application/json" }));
                if (selectedFile) formData.append("icon", selectedFile);
                console.log(JSON.stringify(form))
                const response = await fetch(`http://localhost:8080/api/tags/${tagId}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!response.ok) throw new Error("Error al actualizar la etiqueta");

                const updated = await response.json();
                // console.log(updated)
                setTags((prev) => prev.map((tag) => (tag.id === updated.id ? updated : tag)));
                return updated;
            } catch (err) {
                setError(err instanceof Error ? err.message : "Error desconocido");
                return null;
            }
        },
        [getToken]
    );

    const addTag = (tag: AnimalTag) => {
        setTags((prev) => [...prev, tag]);
    };

    return {
        tags,
        loading,
        error,
        fetchTags,
        deleteTag,
        updateTag,
        addTag,
    };
}
