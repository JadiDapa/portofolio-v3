import { Asterisk, MessageSquare } from "lucide-react";
import ContactForm from "@/components/root/ContactForm";
import PrioritiesAside from "@/components/root/home/PrioritiesAside";

export default function Enquiry() {
  return (
    <section className="px-gutter py-32">
      {/* Tiles above the panel */}

      <div className="border-foreground relative grid grid-cols-4 justify-between border border-t-0 sm:flex-row sm:items-start">
        <div className="flex flex-col items-end">
          <div className="border-foreground flex size-20 items-center justify-center border">
            <MessageSquare className="size-8" />
          </div>
          <div className="bg-foreground text-background flex size-20 items-center justify-center">
            <Asterisk className="size-8" />
          </div>
        </div>

        <div className="border-foreground col-span-3 grid place-items-center border px-6 py-28 text-center">
          <p className="text-eyebrow flex items-center justify-center gap-3 text-lg font-medium tracking-[0.2em] uppercase">
            <span>Your search</span>
            <Asterisk className="text-primary size-5" />
            <span>ends with me</span>
          </p>

          <h2 className="text-section mt-6 max-w-3xl leading-[0.9] font-bold tracking-tight uppercase">
            Tell me about your <span className="text-primary">project</span>
          </h2>

          <p className="text-lead mt-6 text-lg font-medium text-balance">
            Give me a few key details on the form below and I&apos;ll be in
            touch!
          </p>
        </div>
      </div>

      {/* Form + priorities */}
      <div className="grid grid-cols-4">
        <div className="border-foreground col-span-3 border border-t-0 p-6 sm:p-16">
          <ContactForm />
        </div>

        <PrioritiesAside />
      </div>
    </section>
  );
}
