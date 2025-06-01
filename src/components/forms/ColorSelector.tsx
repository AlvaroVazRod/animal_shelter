import React from "react";

interface ColorOption {
    name: string;
    value: string;
}

interface ColorSelectorProps {
    color: string;
    onChange: (color: string) => void;
}

const colorOptions: ColorOption[] = [
    { name: "Verde", value: "#00ff00" },
    { name: "Rojo", value: "#ff0000" },
    { name: "Azul", value: "#4D96FF" },
    { name: "Naranja", value: "#ffa500" },
    { name: "Rosa", value: "#FF87CA" },
];

export default function ColorSelector({ color, onChange }: ColorSelectorProps) {
    return (
        <div className="flex flex-col items-center justify-center border border-[#4ECCA3] rounded-lg p-4 h-full">
            <div
                className="w-16 h-16 rounded-md border border-[#4ECCA3] mb-4"
                style={{ backgroundColor: color }}
            />
            <select
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-2 py-1 rounded border text-black border-[#4ECCA3]"
            >
                {colorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
