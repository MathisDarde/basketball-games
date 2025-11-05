"use client";

import { useState } from "react";
import { LoginSchema } from "@/app/schema";
import { LoginSchemaType } from "@/types/forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import submitLoginForm from "@/actions/login/loginuser";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import handleLoginWithGoogle from "@/actions/login/googlelogin";
import Image from "next/image";
import handleLoginWithTwitter from "@/actions/login/twitterlogin";
import Link from "next/link";
import Button from "@/components/CustomButton";
import { toast } from "sonner";
import { useFormErrorToasts } from "@/utils/form-errors-hook";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const handleSubmitForm = async (data: LoginSchemaType) => {
    const response = await submitLoginForm(data);

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

  useFormErrorToasts(errors);

  return (
    <>
      <div className="space-y-2">
        <h2 className="font-outfit text-base sm:text-lg">Login with socials</h2>
        <div className="flex items-center gap-2 justify-center">
          <button
            onClick={handleLoginWithGoogle}
            className="bg-white size-[2.5rem] md:size-fit rounded-sm shadow flex items-center justify-center gap-4 md:p-3 cursor-pointer"
          >
            <Image
              src="/logos/Google_Favicon_2025.svg.png"
              alt="Google logo"
              width={20}
              height={20}
              className="size-5 md:size-6"
            />
            <span className="hidden md:block font-outfit">Login with Google</span>
          </button>
          <button
            onClick={handleLoginWithTwitter}
            className="bg-white size-[2.5rem] md:size-fit rounded-sm shadow flex items-center justify-center gap-4 md:p-3 cursor-pointer"
          >
            <Image
              src="/logos/X_Logo_2023.svg"
              alt="Twitter logo"
              width={20}
              height={20}
              className="size-5 md:size-6"
            />
            <span className="hidden md:block font-outfit">Login with X (Twitter)</span>
          </button>
        </div>
      </div>

      <div className="w-screen xl:w-[600px] mx-auto px-4 pt-4 pb-8 text-center space-y-2">
      <h2 className="font-outfit text-base sm:text-lg">Login with credentials</h2>
        <form
          method="POST"
          id="loginform"
          onSubmit={handleSubmit(handleSubmitForm)}
          className="max-w-[600px] mx-auto space-y-2"
        >
          <div className="relative w-full space-y-2">
            <input
              {...register("email")}
              className={`w-full py-3 px-4 rounded border shadow font-outfit text-sm sm:text-base bg-white ${errors.email
                  ? "border-2 border-red-500 focus:ring-red-500"
                  : "border-accent-brown"
                }`}
              placeholder="Mail address"
            />
          </div>

          <div className="relative w-full space-y-2">
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
              onClick={togglePasswordVisibility}
              className="text-gray-600 absolute top-4 right-4 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
            <Link href={"/forgot-password"}>
              <p className="text-sm sm:text-base text-dark-purple hover:underline font-outfit cursor-pointer flex justify-end transition-all">
                Forgot your password ?
              </p>
            </Link>
          </div>

          <div className="flex justify-center items-center">
            <Button
              type="submit"
              size="default"
              theme="primary"
              className="m-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
