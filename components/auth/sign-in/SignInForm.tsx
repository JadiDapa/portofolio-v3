"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignIn } from "@clerk/nextjs";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import DbButton from "@/components/dashboard/ui/DbButton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormType = z.infer<typeof loginSchema>;

export default function SignInForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { signIn } = useSignIn();
  const { loaded } = useClerk();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  function onSubmit(values: LoginFormType) {
    startTransition(async () => {
      if (!loaded) return;

      try {
        const { error } = await signIn.password({
          identifier: values.username,
          password: values.password,
        });

        if (error) {
          toast.error("Invalid username or password");
          console.error(error);
          return;
        }

        if (signIn.status === "complete") {
          await signIn.finalize({
            navigate: ({ decorateUrl }) => {
              router.push(decorateUrl("/dashboard"));
            },
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Sign in failed");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="db-auth_form">
      <div className="db-field">
        <label htmlFor="username" className="db-label">Username</label>
        <input
          id="username"
          {...register("username")}
          className="db-input"
          placeholder="Enter your username"
          autoComplete="username"
          aria-invalid={!!errors.username}
        />
        {errors.username && (
          <p className="db-field_error" role="alert">{errors.username.message}</p>
        )}
      </div>

      <div className="db-field">
        <label htmlFor="password" className="db-label">Password</label>
        <div className="db-auth_pw">
          <input
            id="password"
            {...register("password")}
            className="db-input"
            type={isVisible ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
          />
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="db-auth_eye"
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? <EyeOff size={18} strokeWidth={1.4} /> : <Eye size={18} strokeWidth={1.4} />}
          </button>
        </div>
        {errors.password && (
          <p className="db-field_error" role="alert">{errors.password.message}</p>
        )}
      </div>

      <DbButton
        type="submit"
        dark
        disabled={isPending || !loaded}
        className="wk-btn--expand"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </DbButton>
    </form>
  );
}
