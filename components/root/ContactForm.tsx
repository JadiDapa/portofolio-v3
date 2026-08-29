"use client";

import { useTransition } from "react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { CreateContactSubmissionSchema } from "@/servers/validators/contact.validator";
import { submitContactForm } from "@/app/action/contact.action";

type ContactFormType = z.input<typeof CreateContactSubmissionSchema>;

const PROJECT_TYPES = [
  "Web Development",
  "App Development",
  "AI & Machine Learning",
  "IoT & Hardware",
  "Electronics Engineering",
  "Something else",
];

// Shared styling so every field looks identical
const INPUT_CLASS =
  "border-foreground rounded-none border input:text-lg placeholder:text-lg py-10 px-6";
const LABEL_CLASS = "text-lg uppercase";
const CHECKBOX_CLASS = "border-foreground rounded-none border";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactFormType>({
    resolver: zodResolver(CreateContactSubmissionSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      timeline: "",
      budget: "",
      message: "",
      projectTypes: [],
      consent: false,
    },
  });

  async function onSubmit(values: ContactFormType) {
    startTransition(async () => {
      try {
        await submitContactForm(values);
        toast.success("Thanks! I'll be in touch soon.");
        form.reset();
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
      <Controller
        name="projectTypes"
        control={form.control}
        render={({ field }) => (
          <div className="space-y-4">
            <Label className={LABEL_CLASS}>What are you looking for?</Label>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              {PROJECT_TYPES.map((type) => {
                const checked = (field.value ?? []).includes(type);

                return (
                  <label
                    key={type}
                    className="flex cursor-pointer items-center gap-4 font-medium"
                  >
                    <Checkbox
                      className={`${CHECKBOX_CLASS} size-14`}
                      checked={checked}
                      onCheckedChange={(value) => {
                        const current = field.value ?? [];
                        field.onChange(
                          value
                            ? [...current, type]
                            : current.filter((t) => t !== type),
                        );
                      }}
                    />
                    {type}
                  </label>
                );
              })}
            </div>
          </div>
        )}
      />
      <div className="grid gap-8 sm:grid-cols-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label className={LABEL_CLASS} htmlFor="name">
                What&apos;s your name? <span className="text-primary">*</span>
              </Label>
              <Input
                className={INPUT_CLASS}
                id="name"
                {...field}
                placeholder="Your name"
              />
              {fieldState.error && (
                <p className="text-destructive text-sm">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          name="company"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label className={LABEL_CLASS} htmlFor="company">
                What&apos;s your company name?
              </Label>
              <Input
                className={INPUT_CLASS}
                id="company"
                {...field}
                placeholder="Your company"
              />
            </div>
          )}
        />
      </div>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label className={LABEL_CLASS} htmlFor="email">
              What&apos;s your email address?{" "}
              <span className="text-primary">*</span>
            </Label>
            <Input
              className={INPUT_CLASS}
              id="email"
              type="email"
              {...field}
              placeholder="you@company.com"
            />
            {fieldState.error && (
              <p className="text-destructive text-sm">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
      <div className="grid gap-8 sm:grid-cols-2">
        <Controller
          name="timeline"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label className={LABEL_CLASS} htmlFor="timeline">
                What&apos;s your timeline?
              </Label>
              <Input
                className={INPUT_CLASS}
                id="timeline"
                {...field}
                placeholder="Your ideal launch date"
              />
            </div>
          )}
        />

        <Controller
          name="budget"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label className={LABEL_CLASS} htmlFor="budget">
                What&apos;s your budget?
              </Label>
              <Input
                className={INPUT_CLASS}
                id="budget"
                {...field}
                placeholder="$1k - $10k"
              />
            </div>
          )}
        />
      </div>
      <Controller
        name="message"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <Label className={LABEL_CLASS} htmlFor="message">
              Tell me about your project <span className="text-primary">*</span>
            </Label>
            <Textarea
              className={`${INPUT_CLASS} min-h-52 resize-y`}
              id="message"
              {...field}
              placeholder="Your project details"
            />
            {fieldState.error && (
              <p className="text-destructive text-sm">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
      <Controller
        name="consent"
        control={form.control}
        render={({ field, fieldState }) => (
          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-3 text-lg font-medium">
              <Checkbox
                className={`${CHECKBOX_CLASS} mt-0.5 size-12`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              I agree with the processing of my personal data
            </label>
            {fieldState.error && (
              <p className="text-destructive text-sm">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
      <Button
        type="submit"
        disabled={isPending}
        size="lg"
        className="w-full sm:w-auto"
      >
        {isPending ? <Spinner /> : "Submit Enquiry"}
      </Button>
    </form>
  );
}
