import { FiEdit, FiInfo, FiTrash2 } from "react-icons/fi";
import type { AnimalTag } from "../../types/Animals";

interface TagRowProps {
    tag: AnimalTag;
    onEdit: (tag: AnimalTag) => void;
    onDelete: (id: number) => void;
}

export default function TagRow({ tag, onEdit, onDelete }: TagRowProps) {
    return (
        <tr className="hover:bg-[#4ECCA320]">
            <td className="px-4 py-2 text-[#e8e8e8]">{tag.name}</td>
            <td className="px-4 py-2">
                <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: tag.color }}></div>
            </td>
            <td className="px-4 py-2 text-[#e8e8e8]">{tag.description}</td>
            <td className="px-4 py-2 text-center">
                {tag.icon ? (
                    <img src={`http://localhost:8080/tags/${tag.icon}`} alt="icon" className="h-6 w-6 mx-auto" />
                ) : (
                    <FiInfo className="text-[#4ECCA3] mx-auto" />
                )}
            </td>
            <td className="px-4 py-2 text-right">
                <button onClick={() => onEdit(tag)} className="text-[#4ECCA3] hover:text-white mr-2">
                    <FiEdit />
                </button>
                <button onClick={() => onDelete(tag.id)} className="text-red-500 hover:text-white">
                    <FiTrash2 />
                </button>
            </td>
        </tr>
    );
}
