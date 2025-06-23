"use client";

import { RegisterSchema } from "@/app/schema";
import { RegisterSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Mail, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FileManagement from "./FileManagement";
import submitRegisterForm from "@/actions/register/registeruser";
import FavoriteTeamSelect from "./FavoriteTeam";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const { register, handleSubmit, formState, setValue } =
    useForm<RegisterSchemaType>({
      resolver: zodResolver(RegisterSchema),
    });

  const handleSubmitForm = async (data: RegisterSchemaType) => {
    const response = await submitRegisterForm(data, selectedFile ?? null);

    if (response.success) {
      router.push("/");
    } else {
      toast.error(
        response.message
          ? response.message
          : response.errors?.[0]?.message || "Erreur inconnue",
        {
          icon: <X className="text-white" />,
          className: "bg-red-500 border border-red-200 text-white text-base",
        }
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    Object.values(formState.errors).forEach((error) => {
      if (error && "message" in error) {
        toast.error(error.message as string, {
          icon: <X className="text-white" />,
          className:
            "bg-red-500 !important border border-red-200 text-white text-base",
        });
      }
    });
  }, [formState.errors]);

  return (
    <div className="w-[600px] mx-auto">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        id="inscform"
        className="w-[600px]"
      >
        <FileManagement setSelectedFile={setSelectedFile} />

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <User className="mr-4" />
            Name :
          </span>
          <input
            type="text"
            {...register("name")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Pseudo"
          />
        </div>

        <FavoriteTeamSelect register={register} setValue={setValue} />

        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <Mail className="mr-4" />
            Mail :
          </span>
          <input
            type="email"
            {...register("email")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Adresse Mail"
          />
        </div>
        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <KeyRound className="mr-4" />
            Password :
          </span>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Mot de passe"
          />
          <span
            className="text-gray-600 absolute top-14 right-5 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        <div className="relative w-[600px]">
          <span className="font-semibold font-Montserrat text-gray-600 flex items-center">
            <KeyRound className="mr-4" />
            Confirm password :
          </span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className="w-[600px] my-4 py-4 px-6 rounded-full border border-gray-600 font-Montserrat text-sm"
            placeholder="Confirmez votre mot de passe"
          />
          <span
            className="text-gray-600 absolute top-14 right-5 cursor-pointer"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        <div className="flex justify-center items-center">
          <button type="submit">Je m&apos;inscris</button>
        </div>
      </form>
    </div>
  );
}
