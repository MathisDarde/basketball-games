import Button from "@/components/CustomButton";
import Link from "next/link";

export default function NotFound() {
  if (typeof document !== "undefined") {
    document.body.setAttribute("data-page", "404");
  }

  return (
    <div className="text-center bg-light-beige h-screen flex flex-col justify-center items-center p-10">
      <h1 className="font-righteous text-[9rem] sm:text-[15rem] text-dark-purple leading-none font-semibold">
        404
      </h1>
      <p className="font-outfit text-lg sm:text-2xl uppercase font-bold text-aja-blue">
        Page not found !
      </p>
      <p className="font-outfit text-sm sm:text-base mt-2">
        The page you are looking for does not exist or has been moved.
      </p>
      <p className="font-outfit text-sm sm:text-base mt-2">
        Please check the button below to return to the homepage.
      </p>

      <Link href={"/"}>
        <Button type="button" size="default" theme="primary" className="m-6">
          Back to home
        </Button>
      </Link>
    </div>
  );
}
