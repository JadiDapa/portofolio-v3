"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import DbButton from "@/components/dashboard/ui/DbButton";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser } from "@/app/action/user.action";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormType = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { signUp } = useSignUp();
  const { loaded } = useClerk();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", username: "", password: "" },
  });

  function onSubmit(values: SignUpFormType) {
    startTransition(async () => {
      if (!loaded) return;

      try {
        const { error } = await signUp.create({
          username: values.username,
          firstName: values.name,
          password: values.password,
        });

        if (error) {
          toast.error("Registration failed. Please try again.");
          console.error(error);
          return;
        }

        if (signUp.status === "complete") {
          await registerUser({
            username: values.username,
            name: values.name,
          });
          await signUp.finalize({
            navigate: ({ decorateUrl }) => {
              router.push(decorateUrl("/dashboard"));
            },
          });
        } else {
          toast.error("Additional verification required");
        }
      } catch (err) {
        console.error(err);
        toast.error("Registration failed. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="db-auth_form">
      <div className="db-field">
        <label htmlFor="name" className="db-label">Full name</label>
        <input
          id="name"
          {...register("name")}
          className="db-input"
          placeholder="Your full name"
          autoComplete="name"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="db-field_error" role="alert">{errors.name.message}</p>
        )}
      </div>

      <div className="db-field">
        <label htmlFor="username" className="db-label">Username</label>
        <input
          id="username"
          {...register("username")}
          className="db-input"
          placeholder="Choose a username"
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
            placeholder="At least 8 characters"
            autoComplete="new-password"
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

      <div id="clerk-captcha" />

      <DbButton
        type="submit"
        dark
        disabled={isPending || !loaded}
        className="wk-btn--expand"
      >
        {isPending ? "Creating…" : "Create account"}
      </DbButton>
    </form>
  );
}
