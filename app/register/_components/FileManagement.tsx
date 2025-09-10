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
    <div className="relative w-full xl:w-[600px] space-y-2">
      <span className="font-outfit text-black flex items-center">
        <ImageIcon size={18} className="mr-2" />
        Profile Picture :
      </span>

      {previewUrl && (
        <div className="">
          <Image
            src={previewUrl}
            alt="Preview"
            width={100}
            height={100}
            className="rounded-full aspect-square object-cover"
          />
        </div>
      )}

      <input
        type="file"
        onChange={handleFileChange}
        className="w-full xl:w-[600px] py-3 px-4 rounded border border-accent-brown shadow font-outfit text-sm bg-white"
        accept="image/*"
      />
    </div>
  );
}
