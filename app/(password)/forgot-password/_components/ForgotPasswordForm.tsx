"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { authClient } from "@/utils/auth-client";
import Button from "@/components/CustomButton";

// ✅ Schéma de validation Zod
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  // ✅ Affiche les erreurs RHF avec toasts
  const handleFormErrors = () => {
    if (errors.email) toast.error(errors.email.message);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const { error } = await authClient.forgetPassword({
        email: values.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        toast.error("An error occurred while sending the reset email.");
      } else {
        toast.success("A reset link has been sent to your email address.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error sending reset email. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-center">
      <form
        onSubmit={handleSubmit(onSubmit, handleFormErrors)}
        className="max-w-[600px] mx-auto text-center"
      >
        {/* Champ email */}
        <div className="relative w-full mb-6">
          <label className="font-semibold font-outfit text-sm sm:text-base text-accent-brown block text-left mb-1">
            Mail address :
          </label>
          <input
            type="email"
            {...register("email")}
            className="w-full py-2 sm:py-3 px-3 sm:px-5 rounded-sm border border-gray-600 font-outfit text-xs sm:text-sm"
            placeholder="Enter your email address"
          />
        </div>

        <Button type="submit" disabled={loading} size="default" theme="primary">
          {loading ? "Sending in progress..." : "Send me a password reset link"}
        </Button>
      </form>
    </div>
  );
}
