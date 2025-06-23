import handleLoginWithGoogle from "@/actions/login/googlelogin";

export default function LoginForm() {
  return (
    <div>
      <button onClick={handleLoginWithGoogle}>Login with Google</button>

      <form action=""></form>
    </div>
  );
}
