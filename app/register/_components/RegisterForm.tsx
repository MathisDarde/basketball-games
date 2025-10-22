"use client";

import { RegisterSchema } from "@/app/schema";
import { RegisterSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FileManagement from "./FileManagement";
import submitRegisterForm from "@/actions/register/registeruser";
import FavoriteTeamSelect from "./FavoriteTeam";
import Link from "next/link";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });

  const handleSubmitForm = async (data: RegisterSchemaType) => {
    setServerError(null);
    const response = await submitRegisterForm(data, selectedFile ?? null);

    if (response.success) {
      router.push("/");
    } else {
      setServerError(
        response.message
          ? response.message
          : response.errors?.[0].message ?? null
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="w-screen xl:w-[600px] mx-auto px-8 pb-8 text-center">
      <h1 className="text-center font-unbounded text-2xl">Register</h1>
      <div className="mt-2 mb-4">
        <Link
          href="/login"
          className="font-outfit underline cursor-pointer text-dark-purple"
        >
          Already have an account
        </Link>
      </div>

      {/* Bloc erreurs */}
      {(Object.keys(errors).length > 0 || serverError) && (
        <div className="bg-red-200 border border-red-700 rounded-md p-4 mb-4 text-sm text-red-900 space-y-1 text-left">
          {Object.values(errors).map((error, i) => (
            <div key={i} className="font-outfit text-center">
              {error?.message}
            </div>
          ))}
          {serverError && (
            <div className="font-outfit text-center">{serverError}</div>
          )}
        </div>
      )}

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
            className={`w-full xl:w-[600px] py-3 px-4 rounded border shadow font-outfit text-sm bg-white ${
              errors.name
                ? "border-2 border-red-500 focus:ring-red-500"
                : "border-accent-brown"
            }`}
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
            className={`w-full xl:w-[600px] py-3 px-4 rounded border shadow font-outfit text-sm bg-white ${
              errors.email
                ? "border-2 border-red-500 focus:ring-red-500"
                : "border-accent-brown"
            }`}
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
            className={`w-full xl:w-[600px] py-3 px-4 rounded border shadow font-outfit text-sm bg-white ${
              errors.password
                ? "border-2 border-red-500 focus:ring-red-500"
                : "border-accent-brown"
            }`}
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
            className={`w-full xl:w-[600px] py-3 px-4 rounded border shadow font-outfit text-sm bg-white ${
              errors.confirmPassword
                ? "border-2 border-red-500 focus:ring-red-500"
                : "border-accent-brown"
            }`}
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
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
