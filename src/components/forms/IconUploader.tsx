import React, { useEffect, useId, useMemo, useState } from "react";

interface IconUploaderProps {
    icon: File | null;
    iconUrl?: string | null;
    onIconChange: (file: File | null) => void;
    error?: string | null;
}

export default function IconUploader({ icon, iconUrl, onIconChange, error }: IconUploaderProps) {
    const inputId = useId();
    const [initialUrlUsed, setInitialUrlUsed] = useState<string | null>(iconUrl || null);

    const objectUrl = useMemo(() => {
        return icon ? URL.createObjectURL(icon) : null;
    }, [icon]);

    useEffect(() => {
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [objectUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onIconChange(file);
        setInitialUrlUsed(null); // ya no usamos la URL inicial
    };

    const handleRemoveIcon = (e: React.MouseEvent) => {
        e.stopPropagation();
        onIconChange(null);
        setInitialUrlUsed(null); // ya no usamos la URL inicial
    };

    const imageSrc = objectUrl || initialUrlUsed;

    return (
        <div
            className="relative flex flex-col items-center justify-center border border-[#c27aff] bg-[#35273a] rounded-lg w-40 h-40 cursor-pointer"
            onClick={() => document.getElementById(inputId)?.click()}
        >
            {imageSrc ? (
                <>
                    <img
                        src={
                            initialUrlUsed && !objectUrl
                                ? `http://localhost:8080/tags/${initialUrlUsed}`
                                : imageSrc
                        }
                        alt="Icono seleccionado"
                        className="w-16 h-16 object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        type="button"
                        onClick={handleRemoveIcon}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center pb-1 hover:bg-red-700"
                        aria-label="Eliminar icono"
                    >
                        &times;
                    </button>
                </>
            ) : (
                <div className="w-16 h-16 flex items-center justify-center text-[#c27aff] border border-dashed border-[#c27aff] rounded-md mb-4">
                    + Icono
                </div>
            )}
            <input
                type="file"
                id={inputId}
                accept="image/png, image/jpeg"
                className="hidden"
                onChange={handleFileChange}
            />
            {error && <div className="text-red-500 mt-2 text-center">{error}</div>}
            <span className="text-sm text-[#e8e8e8] text-center select-none mt-2">
                Subir icono<br></br> (PNG/JPG max 1MB)
            </span>
        </div>
    );
}
