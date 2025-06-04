import type { AnimalTag } from "../../types/Animals";

interface AnimalAddTagsProps {
    tags: AnimalTag[] | null;
    onTagAdded: (id: number) => void;
}

export const AnimalAddTags = ({ tags, onTagAdded }: AnimalAddTagsProps) => {
    const hexToRgba = (hex: string, alpha = 0.3) => {
        const cleanHex = hex.replace("#", "");
        const bigint = parseInt(cleanHex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <div
            className="absolute left-0 mt-1 p-2 bg-[#2D2A32] border border-[#4ECCA3] rounded shadow-lg z-50"
            style={{
                height: "150px",
                width: "210px",
                overflowY: "auto",
                marginTop: 0
            }}
        >
            {tags &&
                tags.map((tag) => (
                    <span
                        key={tag.id}
                        title={tag.description}
                        className="inline-flex min-w-[35px] items-center gap-1 text-xs font-medium px-3 py-1 rounded-full animate-slide-in"
                        style={{ backgroundColor: hexToRgba(tag.color, 0.6), color: "#000000", marginRight: 4, marginBottom: 4 }}
                        onClick={(e) => {
                            onTagAdded(tag.id)
                        }}
                    >
                        {tag.icon && (
                            <img
                                src={`http://localhost:8080/tags/${tag.icon}`}
                                alt={tag.name + " icono"}
                                className="w-3 h-3"
                            />
                        )}
                        <span>{tag.name}</span>
                    </span>
                ))}
        </div>
    );
};
