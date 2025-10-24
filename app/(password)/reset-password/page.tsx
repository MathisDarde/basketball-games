"use client";

import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import ResetPasswordForm from "./_components/ResetPasswordForm";

export default function ResetPassword() {
  return (
    <>
      <div className="text-center bg-light-beige min-h-screen w-screen box-border p-6 sm:p-10">
        <div className="bg-white max-w-[800px] rounded-md mx-auto p-6 flex flex-col gap-4">
          <h1 className="text-center font-righteous text-3xl sm:text-4xl font-bold uppercase text-dark-purple">
            Type your new password
          </h1>

          <Suspense
            fallback={
              <div className="animate-spin">
                <Loader2 />
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}
