import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignUpForm from "@/components/auth/sign-up/SignUpForm";
import AuthShell from "@/components/auth/AuthShell";

export default async function SignUpPage() {
  const { userId } = await auth();

  if (userId) redirect("/dashboard");

  return (
    <AuthShell
      eyebrow="(02) Sign up"
      title="Create an *account*"
      subtitle="Fill in your details to get started."
      altText="Already in?"
      altHref="/sign-in"
      altLabel="Sign in"
    >
      <SignUpForm />
    </AuthShell>
  );
}
