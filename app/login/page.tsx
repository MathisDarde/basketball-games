import Link from "next/link";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <div className="text-center min-h-screen">
      <h1 className="font-unbounded text-center text-2xl md:text-3xl 2xl:text-4xl">Login</h1>
        <div className="mt-2 mb-4">
          <Link
            href="/register"
            className="font-outfit underline cursor-pointer text-dark-purple text-base sm:text-lg"
          >
            I don&apos;t have an account
          </Link>
        </div>

        <LoginForm />
      </div>
    </>
  );
}
