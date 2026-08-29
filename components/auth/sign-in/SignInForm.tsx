"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useClerk, useSignIn } from "@clerk/nextjs";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
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

  async function onSubmit(values: LoginFormType) {
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
              router.push(decorateUrl("/"));
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          {...register("username")}
          placeholder="Enter your username"
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
            placeholder="Enter your password"
            autoComplete="current-password"
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

      <Button type="submit" disabled={isPending || !loaded} className="w-full">
        {isPending ? <Spinner /> : "Sign in"}
      </Button>
    </form>
  );
}
