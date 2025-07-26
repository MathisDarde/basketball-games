"use client";

import { ImageIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type FileProps = {
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function FileManagement({ setSelectedFile }: FileProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Nettoyage du blob URL pour éviter des fuites mémoire
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="relative w-[600px]">
      <span className="font-semibold font-Montserrat flex items-center text-gray-600">
        <ImageIcon className="mr-4" />
        Profile Picture :
      </span>
      <input
        type="file"
        onChange={handleFileChange}
        className="w-w-600 my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
        accept="image/*"
      />
      {previewUrl && (
        <div className="mt-4">
          <Image
            src={previewUrl}
            alt="Preview"
            width={100}
            height={100}
            className="rounded-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
