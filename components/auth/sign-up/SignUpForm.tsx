"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUser } from "@/app/action/user.action";

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

  async function onSubmit(values: SignUpFormType) {
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
          await createUser({
            username: values.username,
            name: values.name,
            role: "USER",
          });
          await signUp.finalize({
            navigate: ({ decorateUrl }) => {
              router.push(decorateUrl("/"));
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Your full name"
          autoComplete="name"
        />
        {errors.name && (
          <p className="text-destructive text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...register("username")}
          placeholder="Choose a username"
          autoComplete="username"
        />
        {errors.username && (
          <p className="text-destructive text-sm">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            {...register("password")}
            type={isVisible ? "text" : "password"}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
          >
            {isVisible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-destructive text-sm">{errors.password.message}</p>
        )}
      </div>

      <div id="clerk-captcha" />

      <Button type="submit" disabled={isPending || !loaded} className="w-full">
        {isPending ? <Spinner /> : "Create account"}
      </Button>
    </form>
  );
}
