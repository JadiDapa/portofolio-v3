import { getCurrentUser } from "@/app/action/user.action";
import { TestimonialService } from "@/servers/services/testimonial.service";
import PageHeader from "@/components/dashboard/PageHeader";
import CreateTestimonialDialog from "@/components/dashboard/testimonials/CreateTestimonialDialog";
import TestimonialCard from "@/components/dashboard/testimonials/TestimonialCard";
import { redirect } from "next/navigation";

export default async function TestimonialsPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const testimonials = await TestimonialService.getAll();

  return (
    <main className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Testimonials" subtitle="Manage client quotes." />
        <CreateTestimonialDialog />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {testimonials.map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      </div>

      {testimonials.length === 0 && (
        <p className="text-muted-foreground py-16 text-center text-sm">
          No testimonials yet.
        </p>
      )}
    </main>
  );
}
