import { useEffect, useState, useRef } from "react";
import { AdminPageTemplate } from "../templates/AdminTemplate";
import { useUser } from "../../services/users/useUser";
import CreateTagForm from "../../components/forms/CreateTagForm";
import TagsTable from "../../components/tables/TagsTable";
import EditTagModal from "../../components/modals/EditTagModal";
import { useTags } from "../../services/tags/useTags";
import type { AnimalTag } from "../../types/Animals";

export default function AdminDashboardTags() {
    const { getToken } = useUser();
    const {
        tags,
        loading,
        error,
        fetchTags,
        deleteTag,
        updateTag,
        addTag,
    } = useTags({ getToken });

    const [editingTag, setEditingTag] = useState<AnimalTag | null>(null);
    const [editForm, setEditForm] = useState<Partial<AnimalTag>>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [firstImageRemoved, setFirstImageRemoved ] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchTags();
    }, [fetchTags]);

    const openEditModal = (tag: AnimalTag) => {
        setEditingTag(tag);
        setEditForm(tag);
        setSelectedFile(null);
        setEditError(null);
        setIsModalOpen(true);
        setTimeout(() => nameInputRef.current?.focus(), 100);
    };

    const closeEditModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setEditingTag(null);
            setEditForm({});
            setEditError(null);
            setSelectedFile(null);
        }, 300);
    };

    const handleChange = (field: keyof AnimalTag, value: string) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    // Función que acepta string | File | null y normaliza a File | null para el estado
    const changeSelectedFile = (fileOrUrl: string | File | null) => {
        console.log(fileOrUrl)
        if (typeof fileOrUrl === "object" && fileOrUrl !== null) {
            setSelectedFile(fileOrUrl);
        } else {
            setFirstImageRemoved(true);
            setSelectedFile(null);
        }

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTag) return;

        setIsSaving(true);
        setEditError(null);

        const formToSubmit = {
            ...editForm,
            icon: firstImageRemoved ? null : editForm.icon,
        };

        const updated = await updateTag(editingTag.id, formToSubmit, selectedFile);

        if (updated) {
            closeEditModal();
        } else {
            setEditError("Error al actualizar la etiqueta");
        }

        setIsSaving(false);
    };


    return (
        <AdminPageTemplate>
            <CreateTagForm getToken={getToken} onCreateSuccess={addTag} />

            <TagsTable tags={tags} onEdit={openEditModal} onDelete={deleteTag} />

            {editingTag && (
                <EditTagModal
                    isOpen={isModalOpen}
                    editingTag={editingTag}
                    editForm={editForm}
                    onClose={closeEditModal}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    selectedFile={selectedFile}
                    setSelectedFile={changeSelectedFile}
                    editError={editError}
                    isSaving={isSaving}
                    nameInputRef={nameInputRef}
                />
            )}
        </AdminPageTemplate>
    );
}
