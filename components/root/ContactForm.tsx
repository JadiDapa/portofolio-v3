"use client";

import { useTransition } from "react";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import BoxFrame from "@/components/root/shared/BoxFrame";
import { z } from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import GridButton from "@/components/root/work/GridButton";
import {
  ContactFormType,
  CreateContactSubmissionSchema,
} from "@/servers/validators/contact.validator";
import { submitContactForm } from "@/app/action/contact.action";

type ContactFormValues = z.input<typeof CreateContactSubmissionSchema>;

const PROJECT_TYPES = [
  "Software Development",
  "IoT & AI Systems",
  "Electrical Engineering",
  "Process & Control",
  "Something else...",
];

const MESSAGE_MAX = 1000;

function Label({
  htmlFor,
  id,
  required,
  children,
}: {
  htmlFor?: string;
  id?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} id={id} className="ct-label wk-label">
      <span>{children}</span>
      {required && <span className="ct-required"> *</span>}
    </label>
  );
}

/** Helper text that swaps to the error message and grows/collapses between them. */
function Context({ id, error, hint }: { id?: string; error?: string; hint?: string }) {
  const text = error ?? hint;
  return (
    <div className="ct-context-wrap">
      <AnimatePresence initial={false}>
        {text && (
          <motion.p
            key="context"
            id={id}
            role={error ? "alert" : undefined}
            className="ct-context wk-caption"
            initial={{ maxHeight: 0, marginTop: 0 }}
            animate={{ maxHeight: "6rem", marginTop: "var(--space-3xs-2xs)" }}
            exit={{ maxHeight: 0, marginTop: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Checkbox({
  checked,
  onChange,
  children,
  textClassName = "ct-subtext",
  id,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
  textClassName?: string;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      role="checkbox"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      className="ct-inline"
      onClick={() => onChange(!checked)}
    >
      <span className="ct-box" />
      <span className={textClassName}>{children}</span>
    </button>
  );
}

export default function ContactForm({
  formType = "enquiry",
  framed,
}: {
  formType?: ContactFormType;
  /** Draws the contact page's glass panel around the fields. */
  framed?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const enquiry = formType === "enquiry";

  // Draw the frame the first time the panel scrolls into view
  const [panel, visible] = useInViewOnce({ threshold: 0.1 });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(CreateContactSubmissionSchema),
    defaultValues: {
      formType,
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
  const message = useWatch({ control: form.control, name: "message" }) ?? "";

  function onSubmit(values: ContactFormValues) {
    startTransition(async () => {
      try {
        await submitContactForm({ ...values, formType });
        toast.success("Thanks! I'll be in touch soon.");
        form.reset();
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  const textField = (
    name: "name" | "company" | "email" | "timeline" | "budget",
    label: string,
    placeholder: string,
    opts: { required?: boolean; type?: string; hint?: string } = {},
  ) => (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <div
          className={cn("ct-item", fieldState.error && "ct-invalid")}
          data-cmp={`field-${name}`}
        >
          <Label htmlFor={name} required={opts.required}>
            {label}
          </Label>
          <input
            id={name}
            type={opts.type ?? "text"}
            className="ct-area"
            placeholder={placeholder}
            autoComplete="off"
            aria-required={opts.required}
            aria-invalid={!!fieldState.error}
            aria-describedby={`${name}-context`}
            {...field}
          />
          <Context id={`${name}-context`} error={fieldState.error?.message} hint={opts.hint} />
        </div>
      )}
    />
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div ref={panel} className="relative" data-cmp="panel">
        {framed && <BoxFrame visible={visible} className="ct-glass" />}
        <div className={cn("relative", framed && "ct-panel-pad overflow-hidden")}>
          <div className="ct-form ct-items">
      {enquiry && (
        <Controller
          name="projectTypes"
          control={form.control}
          render={({ field }) => (
            <div className="ct-item" data-cmp="field-projectTypes">
              <Label id="projectTypes-label">What are you looking for?</Label>
              <div className="ct-checkgroup" role="group" aria-labelledby="projectTypes-label">
                {PROJECT_TYPES.map((type) => {
                  const value = field.value ?? [];
                  return (
                    <div key={type}>
                      <Checkbox
                        checked={value.includes(type)}
                        onChange={(checked) =>
                          field.onChange(
                            checked ? [...value, type] : value.filter((t) => t !== type),
                          )
                        }
                      >
                        {type}
                      </Checkbox>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        />
      )}

      {textField("name", "What's your name?", "Your name", { required: true })}
      {enquiry && textField("company", "What's your company name?", "Your company")}
      {textField("email", "What's your email address?", "Your email address", {
        required: true,
        type: "email",
      })}
      {enquiry &&
        textField("timeline", "What's your timeline?", "Your ideal launch date", {
          required: true,
          hint: "A rough deadline lets me plan the work around a schedule that fits",
        })}
      {enquiry &&
        textField("budget", "What's your budget?", "$1k - $10k", {
          required: true,
          hint: "A ballpark range helps me shape the right scope and proposal",
        })}

      <Controller
        name="message"
        control={form.control}
        render={({ field, fieldState }) => (
          <div
            className={cn("ct-item", fieldState.error && "ct-invalid")}
            data-cmp="field-message"
          >
            <Label htmlFor="message" required>
              {enquiry ? "Tell me about your project" : "How can I help?"}
            </Label>
            <div className="ct-textarea">
              <textarea
                id="message"
                className="ct-area"
                placeholder={enquiry ? "Your project details" : "Your message"}
                maxLength={MESSAGE_MAX}
                aria-required
                aria-invalid={!!fieldState.error}
                aria-describedby="message-context"
                {...field}
              />
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" aria-hidden>
                <path d="M17 9 9 17M17 13l-4 4" strokeWidth="1.2" />
              </svg>
            </div>
            <div className="ct-context-wrap">
              <div className="grow">
                <Context id="message-context" error={fieldState.error?.message} />
              </div>
              <p className="ct-counter wk-caption">
                {message.length} / {MESSAGE_MAX}
              </p>
            </div>
          </div>
        )}
      />

      <Controller
        name="consent"
        control={form.control}
        render={({ field, fieldState }) => (
          <div
            className={cn("ct-item", fieldState.error && "ct-invalid")}
            data-cmp="field-consent"
          >
            <Checkbox
              id="consent"
              checked={!!field.value}
              onChange={field.onChange}
              textClassName="wk-type-text ct-text"
            >
              I agree to the processing of my personal data
            </Checkbox>
            <Context id="consent-context" error={fieldState.error?.message} />
          </div>
        )}
      />
          </div>
        </div>
      </div>

      <div className={cn("grid lg:grid-cols-2", !framed && "mt-(--space-m-l) grid-cols-2")} data-cmp="submit">
        <GridButton
          type="submit"
          disabled={isPending}
          className="ct-btn ct-btn--expand ct-submit"
        >
          <span className="ct-btn-text">Submit</span>
          {isPending ? <Spinner /> : <Send strokeWidth={1.5} />}
        </GridButton>
      </div>
    </form>
  );
}
