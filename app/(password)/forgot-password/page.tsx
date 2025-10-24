"use client";

import Link from "next/link";
import ForgotPasswordForm from "./_components/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <>
      <div className="text-center bg-light-beige min-h-screen w-screen box-border p-6 sm:p-10">
        <div className="bg-white max-w-[800px] rounded-md mx-auto p-6 flex flex-col gap-4">
          <h1 className="text-center font-righteous text-3xl sm:text-4xl font-semibold uppercase text-dark-purple">
            Reset your password
          </h1>
          <div className="flex flex-col items-center">
            <p className="text-dark-purple underline font-outfit hover:text-fuschia-950 transition-colors text-sm sm:text-base">
              <Link href="/login">Back to login page</Link>
            </p>
          </div>
          <p className="font-outfit text-sm sm:text-base">
            Please write your email adresse below so that we can send you a
            reset link.
          </p>

          <ForgotPasswordForm />
        </div>
      </div>
    </>
  );
}
