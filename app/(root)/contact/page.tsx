import { Mail, MapPin } from "lucide-react";
import ContactForm from "@/components/root/ContactForm";

export default function ContactPage() {
  return (
    <div className="px-gutter py-24">
      <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2">
        <div>
          <p className="text-muted-foreground text-sm font-medium">
            Let&apos;s Talk
          </p>
          <h1 className="text-section mt-2 font-semibold tracking-tight">Contact</h1>
          <p className="text-muted-foreground text-lg mt-4">
            Get in touch, drop me a line, and let&apos;s build something
            great together.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="text-primary size-4" />
              <span>daffa@example.dev</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="text-primary size-4" />
              <span>Based in Indonesia, open to remote work</span>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
