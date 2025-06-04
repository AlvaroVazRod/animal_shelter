import { AdminPageTemplate } from "../templates/AdminTemplate";
import { EditUserModal } from "../../components/modals/EditUserModal";
import { UsersTable } from "../../components/tables/UsersTable";
import { useAdminUsers } from "../../services/users/useAdminUsers";
import { useState } from "react";
import type { UserDTO } from "../../types/UserDTO";

export default function AdminDashboardUsers() {
  const {
    users,
    loading,
    error,
    deleteUser,
    updateUser,
    page,
    totalPages,
    setPage,
  } = useAdminUsers();

  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserDTO>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'create'>('edit');

  const openEditModal = (user: UserDTO) => {
    setEditingUser(user);
    setEditForm(user);
    setEditError(null);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingUser(null);
      setEditForm({});
      setEditError(null);
    }, 300);
  };

  const handleChange = <T extends keyof UserDTO>(field: T, value: UserDTO[T]) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setEditError(null);
    try {
      if (modalMode === 'edit' && editingUser) {
        await updateUser(editingUser.id, editForm as UserDTO);
      }
      closeEditModal();
    } catch (err: any) {
      setEditError(err.message || 'Error al guardar usuario');
    } finally {
      setIsSaving(false);
    }
  };

  const deactivateUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    updateUser(id, { ...user, status: "inactive" });
  };

  const activateUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    updateUser(id, { ...user, status: "active" });
  };

  return (
    <AdminPageTemplate>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-20" style={{ backgroundColor: "#2D2A32" }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#e8e8e8" }}>
              Panel de Administración
            </h1>
            <p className="text-lg" style={{ color: "#e8e8e8" }}>
              Gestión de usuarios registrados
            </p>
          </div>

          {loading ? (
            <p className="text-center text-2xl" style={{ color: "#4ECCA320" }}>
              Cargando usuarios...
            </p>
          ) : error ? (
            <p className="text-center text-2xl text-red-500">Error: {error}</p>
          ) : (
            <>
              <UsersTable
                users={users}
                onEdit={openEditModal}
                onDelete={deleteUser}
                onDeactivate={deactivateUser}
                onActivate={activateUser}
              />
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                  disabled={page === 0}
                  className="px-4 py-2 bg-[#AD03CB] text-white rounded-md disabled:opacity-50"
                >
                  Anterior
                </button>
                <span className="text-white font-semibold">
                  Página {page + 1} de {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 bg-[#AD03CB] text-white rounded-md disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </>
          )}

          <EditUserModal
            isOpen={isModalOpen}
            form={editForm}
            isSaving={isSaving}
            error={editError}
            onClose={closeEditModal}
            onChange={handleChange}
            onSubmit={handleSubmit}
            mode={modalMode}
          />
        </div>
      </div>
    </AdminPageTemplate>
  );
}
