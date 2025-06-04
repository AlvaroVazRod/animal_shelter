import type { AnimalTag } from "../../types/Animals";

interface AnimalTagsEditorProps {
    tags: AnimalTag[] | null;
    onTagDeleted: (id:number) => void;
}

export const AnimalTagsEditor = ({ tags, onTagDeleted }: AnimalTagsEditorProps) => {

    const darkenHexColor = (hex: string, amount = 30) => {
        const cleanHex = hex.replace('#', '');
        const num = parseInt(cleanHex, 16);
        let r = (num >> 16) - amount;
        let g = ((num >> 8) & 0x00FF) - amount;
        let b = (num & 0x0000FF) - amount;

        r = Math.max(0, r);
        g = Math.max(0, g);
        b = Math.max(0, b);

        return `rgb(${r}, ${g}, ${b})`;
    };

    const hexToRgba = (hex: string, alpha = 0.3) => {
        const cleanHex = hex.replace('#', '');
        const bigint = parseInt(cleanHex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    

    return (
        <>
            {tags && tags.map((tag) => (
                <span
                    key={tag.id}
                    title={tag.description}
                    className="inline-flex min-w-[35px] items-center gap-1 text-xs font-medium px-3 py-1 rounded-full animate-slide-in"
                    style={{ backgroundColor: hexToRgba(tag.color, 0.6), color: "#000000" }}
                >
                    {tag.icon && (
                        <img
                            src={`http://localhost:8080/tags/${tag.icon}`}
                            alt={tag.name + " icono"}
                            className="w-3 h-3"
                        />
                    )}
                    <span>{tag.name}</span>
                    <button
                        onClick={(e) => {
                            onTagDeleted(tag.id)
                        }}
                        className="ml-1 text-xs text-gray-700 hover:text-red-600 font-bold"
                        title="Eliminar etiqueta"
                    >
                        ✕
                    </button>
                </span>
            ))}
        </>
    );
};
