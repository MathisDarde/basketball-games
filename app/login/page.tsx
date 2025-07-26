import Link from "next/link";
import LoginForm from "./_components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <div className="">
        <h2 className="">Login</h2>
        <button className="">
          <Link href="/register">I don&apos;t have an account</Link>
        </button>

        <LoginForm />
      </div>
    </>
  );
}
