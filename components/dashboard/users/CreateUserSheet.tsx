"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import DbButton from "@/components/dashboard/ui/DbButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { CreateUserSchema } from "@/servers/validators/user.validator";
import { createUser } from "@/app/action/user.action";
import { getErrorMessage } from "@/lib/utils";

type UserFormType = z.infer<typeof CreateUserSchema>;

export default function CreateUserSheet() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<UserFormType>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      name: "",
      username: "",
      role: "USER",
    },
  });

  function onSubmit(values: UserFormType) {
    startTransition(async () => {
      try {
        await createUser(values);
        toast.success("User created!");
        form.reset();
        setOpen(false);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <DbButton>Add User</DbButton>
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} className="db-dialog db-sheetpanel" aria-describedby={undefined}>
        <SheetHeader>
          <SheetClose className="db-sheet_close" aria-label="Close">
            <X size={18} strokeWidth={1.4} />
          </SheetClose>
          <SheetTitle>Add User</SheetTitle>
          <p className="text-muted-foreground text-sm">
            Create a new user account.
          </p>
        </SheetHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label htmlFor="name">
                  Name{" "}
                  <span className="text-muted-foreground text-xs font-normal">
                    (optional)
                  </span>
                </Label>
                <Input id="name" {...field} placeholder="Full name" />
              </div>
            )}
          />

          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input id="username" {...field} placeholder="username" />
                {fieldState.error && (
                  <p className="text-destructive text-sm">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="role"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1.5">
                <Label>Role</Label>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <SheetFooter className="db-sheetfoot">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Spinner /> : "Create"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
