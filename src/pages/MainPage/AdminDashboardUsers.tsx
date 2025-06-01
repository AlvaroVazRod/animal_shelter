import { AdminPageTemplate } from "../templates/AdminTemplate";
import { EditUserModal } from "../../components/modals/EditUserModal";
import { UsersTable } from "../../components/tables/UsersTable";
import { useAdminUsers } from "../../services/users/useAdminUsers";
import { useState } from "react";
import type { UserDTO } from "../../types/UserDTO";
// import { useUser } from "../../services/users/useUser";

export default function AdminDashboardUsers() {
  const { users, loading, error, deleteUser, updateUser } = useAdminUsers();
  // const { register } = useUser();

  const [editingUser, setEditingUser] = useState<UserDTO | null>(null);
  const [editForm, setEditForm] = useState<Partial<UserDTO>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'create'>('edit');

  // Abrir modal para editar usuario
  const openEditModal = (user: UserDTO) => {
    setEditingUser(user);
    setEditForm(user);
    setEditError(null);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Abrir modal para crear usuario nuevo
  // const openCreateModal = () => {
  //   setEditingUser(null);
  //   setEditForm({});
  //   setEditError(null);
  //   setModalMode('create');
  //   setIsModalOpen(true);
  // };

  // Cerrar modal
  const closeEditModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setEditingUser(null);
      setEditForm({});
      setEditError(null);
    }, 300);
  };

  // Cambios en formulario
  const handleChange = <T extends keyof UserDTO>(field: T, value: UserDTO[T]) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  // Enviar formulario (crear o actualizar)
  const handleSubmit = async () => {
    setIsSaving(true);
    setEditError(null);
    try {
      if (modalMode === 'edit' && editingUser) {
        await updateUser(editingUser.id, editForm as UserDTO);
      } else if (modalMode === 'create') {
        //Activar si pudiesen generarse los usuarios desde administracion

        // await register(editForm.username, editForm.email, editForm);
      }
      closeEditModal();
    } catch (err: any) {
      setEditError(err.message || 'Error al guardar usuario');
    } finally {
      setIsSaving(false);
    }
  };

  // Desactivar usuario (cambia status a inactive)
  const deactivateUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    updateUser(id, { ...user, status: "inactive" });
  };

  // Activar usuario (cambia status a active)
  const activateUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    updateUser(id, { ...user, status: "active" });
  };

  return (
    <AdminPageTemplate>
      <div
        className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-20"
        style={{ backgroundColor: "#2D2A32" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2" style={{ color: "#e8e8e8" }}>
              Panel de Administración
            </h1>
            <p className="text-lg" style={{ color: "#e8e8e8" }}>
              Gestión de usuarios registrados
            </p>
            {/* <button
              onClick={openCreateModal}
              className="mt-4 px-6 py-2 bg-[#48e0af] text-[#294a3f] font-semibold rounded-md hover:bg-[#4ECCA3] transition-colors"
            >
              Crear Usuario Nuevo
            </button> */}
          </div>

          {loading ? (
            <p className="text-center text-2xl" style={{ color: "#4ECCA320" }}>
              Cargando usuarios...
            </p>
          ) : error ? (
            <p className="text-center text-2xl text-red-500">Error: {error}</p>
          ) : (
            <UsersTable
              users={users}
              onEdit={openEditModal}
              onDelete={deleteUser}
              onDeactivate={deactivateUser}
              onActivate={activateUser}
            />
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
