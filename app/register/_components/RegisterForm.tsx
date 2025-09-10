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
    <div className="w-screen xl:w-[600px] mx-auto px-8 pb-8 text-center">
      <h1 className="text-center font-unbounded text-2xl">Register</h1>
      <p className="font-outfit mt-2 mb-4 underline cursor-pointer text-dark-purple">
        Already have an account
      </p>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        id="inscform"
        className="w-full xl:w-[600px] space-y-2"
      >
        <FileManagement setSelectedFile={setSelectedFile} />

        <div className="relative w-full xl:w-[600px] space-y-2">
          <span className="font-outfit text-black flex items-center">
            <User size={18} className="mr-2" />
            Name :
          </span>
          <input
            type="text"
            {...register("name")}
            className="w-full xl:w-[600px] py-3 px-4 rounded border border-accent-brown shadow font-outfit text-sm bg-white"
            placeholder="Name"
          />
        </div>

        <FavoriteTeamSelect register={register} setValue={setValue} />

        <div className="relative w-full xl:w-[600px] space-y-3">
          <span className="font-outfit text-black flex items-center">
            <Mail size={18} className="mr-2" />
            Mail :
          </span>
          <input
            type="email"
            {...register("email")}
            className="w-full xl:w-[600px] py-3 px-4 rounded border border-accent-brown shadow font-outfit text-sm bg-white"
            placeholder="Mail address"
          />
        </div>

        <div className="relative w-full xl:w-[600px] space-y-2">
          <span className="font-outfit text-black flex items-center">
            <KeyRound size={18} className="mr-2" />
            Password :
          </span>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-full xl:w-[600px] py-3 px-4 rounded border border-accent-brown shadow font-outfit text-sm bg-white"
            placeholder="Password"
          />
          <span
            className="text-gray-600 absolute top-[2.85rem] right-4 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <div className="relative w-full xl:w-[600px] space-y-2">
          <span className="font-outfit text-black flex items-center">
            <KeyRound size={18} className="mr-2" />
            Confirm password :
          </span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className="w-full xl:w-[600px] py-3 px-4 rounded border border-accent-brown shadow font-outfit text-sm bg-white"
            placeholder="Confirm password"
          />
          <span
            className="text-gray-600 absolute top-[2.85rem] right-4 cursor-pointer"
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        <div className="flex justify-center items-center">
          <button
            type="submit"
            className="bg-dark-purple px-4 py-2 rounded font-outfit text-white"
          >
            Je m&apos;inscris
          </button>
        </div>
      </form>
    </div>
  );
}
