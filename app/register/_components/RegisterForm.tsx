"use client";

import { RegisterSchema } from "@/app/schema";
import { RegisterSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, KeyRound, Loader2, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import FileManagement from "./FileManagement";
import submitRegisterForm from "@/actions/register/registeruser";
import FavoriteTeamSelect from "./FavoriteTeam";
import Link from "next/link";
import Button from "@/components/CustomButton";
import { toast } from "sonner";
import { useFormErrorToasts } from "@/utils/form-errors-hook";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(RegisterSchema),
  });

  const handleSubmitForm = async (data: RegisterSchemaType) => {
    setLoading(true);
    const response = await submitRegisterForm(data, selectedFile ?? null);

    setLoading(false);

    if (response.success) {
      router.push("/");
    } else {
      toast.error(
        response.message ? response.message : response.errors?.[0].message
      );
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useFormErrorToasts(errors);

  return (
    <div className="w-screen xl:w-[600px] mx-auto px-8 pb-8 text-center">
      <h1 className="font-unbounded text-center text-2xl md:text-3xl 2xl:text-4xl">Register</h1>
      <div className="mt-2 mb-4">
        <Link
          href="/login"
          className="font-outfit underline cursor-pointer text-dark-purple text-base sm:text-lg"
        >
          Already have an account
        </Link>
      </div>

      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        id="inscform"
        className="max-w-[600px] mx-auto space-y-4"
      >
        <FileManagement setSelectedFile={setSelectedFile} />

        <div className="relative w-full space-y-2">
          <span className="font-outfit text-base sm:text-lg text-black flex items-center">
            <User size={18} className="mr-2" />
            Name :
          </span>
          <input
            type="text"
            {...register("name")}
            className={`w-full py-3 px-4 rounded border shadow font-outfit text-sm sm:text-base bg-white ${errors.name
              ? "border-2 border-red-500 focus:ring-red-500"
              : "border-accent-brown"
              }`}
            placeholder="Name"
          />
        </div>

        <FavoriteTeamSelect register={register} setValue={setValue} />

        <div className="relative w-full space-y-2">
          <span className="font-outfit text-base sm:text-lg text-black flex items-center">
            <Mail size={18} className="mr-2" />
            Mail :
          </span>
          <input
            type="email"
            {...register("email")}
            className={`w-full py-3 px-4 rounded border shadow font-outfit text-sm sm:text-base bg-white ${errors.email
              ? "border-2 border-red-500 focus:ring-red-500"
              : "border-accent-brown"
              }`}
            placeholder="Mail address"
          />
        </div>

        <div className="relative w-full space-y-2">
          <span className="font-outfit text-base sm:text-lg text-black flex items-center">
            <KeyRound size={18} className="mr-2" />
            Password :
          </span>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className={`w-full py-3 px-4 rounded border shadow font-outfit text-sm sm:text-base bg-white ${errors.password
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

        <div className="relative w-full space-y-2">
          <span className="font-outfit text-base sm:text-lg text-black flex items-center">
            <KeyRound size={18} className="mr-2" />
            Confirm password :
          </span>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className={`w-full py-3 px-4 rounded border shadow font-outfit text-sm sm:text-base bg-white ${errors.confirmPassword
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
          <Button
            type="submit"
            size="default"
            theme="primary"
            className="m-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Register"}
          </Button>
        </div>
      </form>
    </div>
  );
}
