import type { UserDTO } from "../../types/UserDTO";
import { UserRow } from "./UserRow";

interface Props {
    users: UserDTO[];
    onEdit: (user: UserDTO) => void;
    onDelete: (id: number) => void;
    onDeactivate: (id: number) => void;
    onActivate: (id: number) => void;
}

export function UsersTable({ users, onEdit, onDelete, onDeactivate, onActivate }: Props) {
    if (users.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-xl" style={{ color: "#4ECCA320" }}>
                    No hay usuarios registrados
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#4ECCA320]/90 rounded-lg shadow-lg border-2 border-[#4ECCA3] overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-[#4ECCA3]/50">
                    <thead className="bg-[#4ECCA3]">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                Usuario
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                Información
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                Rol
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-[#e8e8e8] uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-[#4ECCA320]/80 divide-y divide-[#a4ebd4]/30">
                        {users.map((user) => (
                            <UserRow
                                key={user.id}
                                user={user}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onDeactivate={onDeactivate}
                                onActivate={onActivate}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
