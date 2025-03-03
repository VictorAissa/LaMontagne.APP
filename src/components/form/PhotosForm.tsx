import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { ImageIcon, Trash2, Upload } from 'lucide-react';

interface PhotosFormProps {
    existingPhotos: string[];
    onPhotosChange: (photos: string[]) => void;
    onFilesChange: (files: File[]) => void;
}

const PhotosForm: React.FC<PhotosFormProps> = ({
    existingPhotos = [],
    onPhotosChange,
    onFilesChange,
}) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);

            const updatedFiles = [...selectedFiles, ...newFiles];
            setSelectedFiles(updatedFiles);

            const newPreviewUrls = newFiles.map((file) =>
                URL.createObjectURL(file)
            );
            setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

            onFilesChange(updatedFiles);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveSelectedFile = (index: number) => {
        URL.revokeObjectURL(previewUrls[index]);

        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));

        onFilesChange(updatedFiles);
    };

    const handleRemoveExistingPhoto = (index: number) => {
        const updatedPhotos = existingPhotos.filter((_, i) => i !== index);
        onPhotosChange(updatedPhotos);
    };

    return (
        <div className="w-full">
            {/* Zone de sélection de fichiers */}
            <div className="mb-6">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="photo-upload">Ajouter des photos</Label>
                    <div className="flex items-center gap-4">
                        <Input
                            id="photo-upload"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                            className="flex-1"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                        Formats acceptés: JPG, PNG, GIF - Max 5MB par image
                    </p>
                </div>
            </div>

            {/* Aperçu des fichiers sélectionnés */}
            {previewUrls.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">
                        Nouvelles photos à ajouter:
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {previewUrls.map((url, index) => (
                            <div
                                key={`preview-${index}`}
                                className="relative group"
                            >
                                <div className="aspect-square rounded-md overflow-hidden border">
                                    <img
                                        src={url}
                                        alt={`Aperçu ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveSelectedFile(index)
                                    }
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-80 hover:opacity-100 transition-opacity"
                                    title="Supprimer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Photos existantes */}
            {existingPhotos.length > 0 && (
                <div>
                    <h3 className="text-sm font-medium mb-2">
                        Photos existantes:
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {existingPhotos.map((photoUrl, index) => (
                            <div
                                key={`photo-${index}`}
                                className="relative group"
                            >
                                <div className="aspect-square rounded-md overflow-hidden border">
                                    <img
                                        src={photoUrl}
                                        alt={`Photo ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback si l'image ne peut pas être chargée
                                            const target =
                                                e.target as HTMLImageElement;
                                            target.src =
                                                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+SW1hZ2UgZXJyb3I8L3RleHQ+PC9zdmc+';
                                            target.alt = 'Image non disponible';
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleRemoveExistingPhoto(index)
                                    }
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-80 hover:opacity-100 transition-opacity"
                                    title="Supprimer"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Message si aucune photo */}
            {existingPhotos.length === 0 && previewUrls.length === 0 && (
                <div className="text-center py-8 border border-dashed rounded-lg">
                    <ImageIcon
                        size={36}
                        className="mx-auto text-gray-400 mb-2"
                    />
                    <p className="text-gray-500">Aucune photo</p>
                    <p className="text-gray-400 text-sm">
                        Utilisez le bouton ci-dessus pour ajouter des photos
                    </p>
                </div>
            )}
        </div>
    );
};

export default PhotosForm;
