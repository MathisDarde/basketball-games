"use client";

import { useEffect, useState } from "react";
import { LoginSchema } from "@/app/schema";
import { LoginSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import submitLoginForm from "@/actions/login/loginuser";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import { X } from "lucide-react";
import handleLoginWithGoogle from "@/actions/login/googlelogin";
import Image from "next/image";
import handleLoginWithTwitter from "@/actions/login/twitterlogin";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const handleSubmitForm = async (data: LoginSchemaType) => {
    const response = await submitLoginForm(data);
    if (response.success) {
      redirect("/");
    } else {
      toast.error(
        response.message ? response.message : response.errors?.[0].message,
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
    <>
      <div className="space-y-2">
        <h2 className="font-outfit">Login with socials</h2>
        <div className="flex items-center gap-2 justify-center">
          <button onClick={handleLoginWithGoogle} className="bg-white w-[2.5rem] h-[2.5rem] rounded-sm shadow flex items-center justify-center">
            <Image src="/logos/Google_Favicon_2025.svg.png" alt="Google logo" width={20} height={20} />
          </button>
          <button onClick={handleLoginWithTwitter} className="bg-white w-[2.5rem] h-[2.5rem] rounded-sm shadow flex items-center justify-center">
            <Image src="/logos/X_Logo_2023.svg" alt="Twitter logo" width={20} height={20} />
          </button>
        </div>
      </div>

      <div className="w-screen xl:w-[600px] mx-auto px-8 pt-4 pb-8 text-center space-y-2">
        <h2 className="font-outfit">Login with credentials</h2>
        <form
          method="POST"
          id="loginform"
          onSubmit={handleSubmit(handleSubmitForm)}
          className="w-full xl:w-[600px] space-y-2"
        >
          <div className="relative w-full xl:w-[600px] space-y-2">
            <input
              {...register("email")}
              className="w-full xl:w-[600px] py-3 px-4 rounded border border-accent-brown shadow font-outfit text-sm bg-white"
              placeholder="Mail address"
            />
          </div>

          <div className="relative w-full xl:w-[600px] space-y-2">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="w-full xl:w-[600px] py-3 px-4 rounded border border-accent-brown shadow font-outfit text-sm bg-white"
              placeholder="Password"
            />
            <span
              onClick={togglePasswordVisibility}
              className="text-gray-600 absolute top-4 right-4 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className="flex justify-center items-center">
          <button
            type="submit"
            className="bg-dark-purple px-4 py-2 rounded font-outfit text-white"
          >
            Login
          </button>
        </div>
        </form>
      </div>
    </>
  );
}
