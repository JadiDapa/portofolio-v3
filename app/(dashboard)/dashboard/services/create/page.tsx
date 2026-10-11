import { getCurrentUser } from "@/lib/auth";
import DynamicBreadcrumb from "@/components/dashboard/DynamicBreadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import ServiceForm from "@/components/dashboard/services/ServiceForm";
import { redirect } from "next/navigation";

export default async function CreateServicePage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <main className="w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader eyebrow="Services" title="New service" subtitle="Write on the left, watch the page on the right." />
      </div>

      <ServiceForm />
    </main>
  );
}
