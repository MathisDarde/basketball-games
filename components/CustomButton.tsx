import { ButtonProps } from "@/interfaces/Interfaces";
import { cn } from "@/utils/cn";
import React from "react";

type ButtonSize = "default" | "slim" | "large";

type ButtonTheme = "primary" | "secondary" | "delete" | "discard";

interface CustomButtonProps extends ButtonProps {
  size?: ButtonSize;
  theme?: ButtonTheme;
}

const Button = ({
  children,
  onClick,
  type,
  className,
  disabled = false,
  size = "default",
  theme = "primary",
}: CustomButtonProps) => {
  const sizeClasses = {
    default: "py-2 sm:py-3 px-4 sm:px-6 text-sm sm:text-base",
    slim: "py-1 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm",
    large: "py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg",
  }[size];

  const colorsClasses = {
    primary: "bg-dark-purple text-white hover:bg-fuschia-950",
    secondary: "bg-accent-brown text-white hover:bg-brown-800",
    delete: "bg-red-700 text-white hover:bg-red-800",
    discard: "bg-gray-300 text-black hover:bg-gray-400",
  }[theme];

  return (
    <button
      disabled={disabled}
      type={type}
      onClick={onClick}
      className={cn(
        `
        text-sm sm:text-base font-outfit text-center rounded-sm mx-auto
        transition-all cursor-pointer duration-300 flex items-center justify-center gap-2
        `,
        sizeClasses,
        colorsClasses,
        disabled && "cursor-not-allowed opacity-40",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
