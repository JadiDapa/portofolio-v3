import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignUpForm from "@/components/auth/sign-up/SignUpForm";
import Link from "next/link";

export default async function SignUpPage() {
  const { userId } = await auth();

  if (userId) redirect("/dashboard");

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-foreground text-2xl font-bold">Create account</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Fill in your details to get started
          </p>
        </div>

        <SignUpForm />

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-foreground underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
