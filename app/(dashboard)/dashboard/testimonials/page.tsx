import { getCurrentUser } from "@/lib/auth";
import { TestimonialService } from "@/servers/services/testimonial.service";
import PageHeader from "@/components/dashboard/PageHeader";
import TestimonialSheet from "@/components/dashboard/testimonials/TestimonialSheet";
import TestimonialCard from "@/components/dashboard/testimonials/TestimonialCard";
import DbEmpty from "@/components/dashboard/ui/DbEmpty";
import { redirect } from "next/navigation";

export default async function TestimonialsPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const items = await TestimonialService.getAll();

  return (
    <main className="w-full space-y-6">
      <PageHeader
        eyebrow="(04) Social proof"
        title="Testimonials"
        subtitle="Client quotes shown on the public site."
        actions={<TestimonialSheet />}
      />

      {items.length === 0 ? (
        <DbEmpty title="No *quotes* yet" text="Add what a client said about working with you." />
      ) : (
        <div className="db-grid">
          {items.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      )}
    </main>
  );
}
