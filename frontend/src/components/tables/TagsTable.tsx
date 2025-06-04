import type { AnimalTag } from "../../types/Animals";
import TagRow from "./TagRow";

interface TagTableProps {
    tags: AnimalTag[];
    onEdit: (tag: AnimalTag) => void;
    onDelete: (id: number) => void;
}

export default function TagsTable({ tags, onEdit, onDelete }: TagTableProps) {
    return (
        <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold text-[#e8e8e8] mb-6">Etiquetas</h2>
            <div className="overflow-x-auto bg-[#35273a] rounded-lg shadow-lg border border-[#ad03cb]">
                <table className="min-w-full divide-y divide-[#5f4075]/50">
                    <thead className="bg-[#ad03cb]">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-[#e8e8e8] uppercase">Nombre</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-[#e8e8e8] uppercase">Color</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-[#e8e8e8] uppercase">Descripción</th>
                            <th className="px-4 py-2 text-center text-xs font-semibold text-[#e8e8e8] uppercase">Icono</th>
                            <th className="px-4 py-2 text-right text-xs font-semibold text-[#e8e8e8] uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#5f4075]/30">
                        {tags.map((tag) => (
                            <TagRow key={tag.id} tag={tag} onEdit={onEdit} onDelete={onDelete} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
