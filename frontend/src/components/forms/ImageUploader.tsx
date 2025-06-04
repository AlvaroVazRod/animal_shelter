import React, { useId, useMemo, useState, useEffect } from "react";

interface ImageUploaderProps {
    imageFile: File | null;
    imageUrl?: string | null;
    onImageChange: (file: File | null) => void;
    error?: string | null;
}

export function ImageUploader({ imageFile, imageUrl, onImageChange, error }: ImageUploaderProps) {
    const inputId = useId();
    const [initialUrlUsed, setInitialUrlUsed] = useState<string | null>(imageUrl || null);

    const objectUrl = useMemo(() => {
        return imageFile ? URL.createObjectURL(imageFile) : null;
    }, [imageFile]);

    useEffect(() => {
        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [objectUrl]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        // console.log(file)
        onImageChange(file);
        setInitialUrlUsed(null);
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        onImageChange(null);
        setInitialUrlUsed(null);
    };

    const imageSrc = objectUrl || initialUrlUsed;

    return (
        <div
            className="relative flex flex-col items-center justify-center border border-[#4ECCA3] rounded-lg p-4 w-40 h-40 cursor-pointer"
            onClick={() => document.getElementById(inputId)?.click()}
        >
            {imageSrc ? (
                <>
                    <img
                        src={imageFile ? imageSrc :"http://localhost:8080/images/animal/"+imageSrc}
                        alt="Imagen seleccionada"
                        className="w-22 h-22 object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center pb-1 hover:bg-red-700"
                        aria-label="Eliminar imagen"
                    >
                        &times;
                    </button>
                </>
            ) : (
                <div className="w-18 h-16 flex items-center justify-center text-[#4ECCA3] border border-dashed border-[#4ECCA3] rounded-md mb-4">
                    +
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
                Haz click para subir (PNG/JPG max 1MB)
            </span>
        </div>
    );
}
