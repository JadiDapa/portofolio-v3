import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignInForm from "@/components/auth/sign-in/SignInForm";
import AuthShell from "@/components/auth/AuthShell";

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) redirect("/dashboard");

  return (
    <AuthShell
      eyebrow="(01) Sign in"
      title="Welcome *back*"
      subtitle="Sign in to manage your work, journal and inbox."
      altText="No account?"
      altHref="/sign-up"
      altLabel="Sign up"
    >
      <SignInForm />
    </AuthShell>
  );
}
