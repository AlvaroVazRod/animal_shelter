import { FiTrash2, FiEdit, FiMail, FiPhone, FiUser, FiInfo, FiSlash, FiCheck } from "react-icons/fi";
import type { UserDTO } from "../../types/UserDTO";

interface UserRowProps {
    user: UserDTO;
    onEdit: (user: UserDTO) => void;
    onDelete: (id: number) => void;
    onDeactivate: (id: number) => void;
    onActivate: (id: number) => void;
}

export const UserRow: React.FC<UserRowProps> = ({
    user,
    onEdit,
    onDelete,
    onDeactivate,
    onActivate,
}) => {
    const isInactive = user.status === "inactive";
    const inactiveTextClasses = isInactive ? "line-through" : "";

    return (
        <tr className="hover:bg-[#4ECCA320] transition-colors">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#4ECCA3] flex items-center justify-center text-[#e8e8e8]">
                        <FiUser className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex items-center">
                        <div className={`text-sm font-medium text-[#e8e8e8] ${inactiveTextClasses}`}>
                            {user.username}
                        </div>
                        {isInactive && (
                            <FiInfo
                                className="ml-2 text-yellow-400"
                                title="Usuario inactivo"
                                aria-label="Usuario inactivo"
                            />
                        )}
                    </div>
                    <div className={`ml-4 text-sm text-[#e8e8e8]/80 ${inactiveTextClasses}`}>
                        ID: {user.id}
                    </div>
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <div className={`text-sm text-[#e8e8e8] ${inactiveTextClasses}`}>
                    <div className="flex items-center">
                        <FiMail className="mr-2 text-[#a4ebd4]" />
                        {user.email}
                    </div>
                    <div className="flex items-center mt-1">
                        <FiUser className="mr-2 text-[#a4ebd4]" />
                        {user.name} {user.surname}
                    </div>
                    {user.phone && (
                        <div className="flex items-center mt-1">
                            <FiPhone className="mr-2 text-[#a4ebd4]" />
                            {user.phone}
                        </div>
                    )}
                </div>
            </td>

            <td className="px-6 py-4 whitespace-nowrap">
                <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === "ADMIN"
                            ? "bg-[#a4ebd4] text-[#3d5950]"
                            : "bg-[#a4ebad] text-[#3d5950]"
                        } ${inactiveTextClasses}`}
                >
                    {user.role}
                </span>
            </td>

            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                {isInactive ? (
                    <>
                        <button
                            onClick={() => onActivate(user.id)}
                            title="Activar usuario"
                            className="text-green-500 hover:text-green-600"
                        >
                            <FiCheck size={18} />
                        </button>

                        <button
                            onClick={() => onDelete(user.id)}
                            title="Eliminar usuario"
                            className="text-red-600 hover:text-red-700"
                        >
                            <FiTrash2 size={18} />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => onDeactivate(user.id)}
                        title="Desactivar usuario"
                        className="text-yellow-500 hover:text-yellow-600"
                    >
                        <FiSlash size={18} />
                    </button>
                )}

                <button
                    onClick={() => onEdit(user)}
                    title="Editar usuario"
                    className="text-blue-500 hover:text-blue-600"
                >
                    <FiEdit size={18} />
                </button>
            </td>
        </tr>
    );
};
