import Link from "next/link";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <div className="text-center min-h-screen">
        <h1 className="text-center font-unbounded text-2xl">Login</h1>
        <div className="mt-2 mb-4">
          <Link
            href="/register"
            className="font-outfit underline cursor-pointer text-dark-purple"
          >
            I don&apos;t have an account
          </Link>
        </div>

        <LoginForm />
      </div>
    </>
  );
}
