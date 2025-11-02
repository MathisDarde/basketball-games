"use client";

import { X } from "lucide-react";
import Button from "./CustomButton";

type Action = {
  label: string;
  onClick: () => void;
  theme?: "delete" | "secondary" | "primary" | "discard";
};

export default function ActionPopup({
  onClose,
  title,
  description,
  actions,
}: {
  onClose: () => void;
  title: string;
  description?: string;
  actions: Action[];
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative m-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Contenu */}
        <h2 className="text-xl font-semibold text-center font-unbounded mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-gray-600 mb-4 font-outfit text-center">
            {description}
          </p>
        )}

        {/* Boutons dynamiques */}
        <div className="flex justify-center font-outfit gap-3">
          {actions.map((action, idx) => (
            <Button
              key={idx}
              onClick={action.onClick}
              theme={action.theme}
              size="default"
              className="mx-0"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
