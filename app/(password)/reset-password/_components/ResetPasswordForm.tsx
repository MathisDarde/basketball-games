"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/utils/auth-client";
import Button from "@/components/CustomButton";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "The password must be at least 8 characters long."),
    confirmPassword: z
      .string()
      .min(8, "The password must be at least 8 characters long."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "The passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // afficher les erreurs via toast
  const handleFormErrors = () => {
    if (errors.password) {
      toast.error(errors.password.message);
    }
    if (errors.confirmPassword) {
      toast.error(errors.confirmPassword.message);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!token) {
      toast.error("The reset token is missing or invalid.");
      return;
    }

    setLoading(true);

    const { error } = await authClient.resetPassword({
      newPassword: values.password,
      token,
    });

    if (error) {
      toast.error("An error occurred while resetting the password.");
    } else {
      toast.success("The password has been reset successfully.");
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <div className="w-full mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit, handleFormErrors)}
        className="max-w-[600px] mx-auto text-center"
      >
        {/* Mot de passe */}
        <div className="relative w-full mb-6">
          <label className="font-semibold font-outfit text-gray-600 block text-sm sm:text-base text-left mb-1">
            New password :
          </label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className="w-full py-2 sm:py-3 px-3 sm:px-5 rounded-sm border border-gray-600 font-outfit text-xs sm:text-sm"
            placeholder="Enter your new password"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="cursor-pointer absolute top-[30px] sm:top-10 right-4 sm:right-5 text-dark-purple"
          >
            {showPassword ? (
              <EyeOff className="w-5 sm:w-6" />
            ) : (
              <Eye className="w-5 sm:w-6" />
            )}
          </span>
        </div>

        {/* Confirmation */}
        <div className="relative w-full mb-6">
          <label className="font-semibold font-outfit text-gray-600 block text-sm sm:text-base text-left mb-1">
            Confirm new password :
          </label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className="w-full py-2 sm:py-3 px-3 sm:px-5 rounded-sm border border-gray-600 font-outfit text-xs sm:text-sm"
            placeholder="Confirm your new password"
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="cursor-pointer absolute top-[30px] sm:top-10 right-4 sm:right-5 text-dark-purple"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 sm:w-6" />
            ) : (
              <Eye className="w-5 sm:w-6" />
            )}
          </span>
        </div>

        <Button type="submit" disabled={loading} size="default" theme="primary">
          {loading ? "Resetting..." : "Confirm new password"}
        </Button>
      </form>
    </div>
  );
}
