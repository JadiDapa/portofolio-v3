import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignInForm from "@/components/auth/sign-in/SignInForm";
import Link from "next/link";

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) redirect("/dashboard");

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-foreground text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        <SignInForm />

        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-foreground underline underline-offset-4"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
