import { getCurrentUser } from "@/lib/auth";
import { ServiceService } from "@/servers/services/service.service";
import DynamicBreadcrumb from "@/components/dashboard/DynamicBreadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import ServiceForm from "@/components/dashboard/services/ServiceForm";
import { notFound, redirect } from "next/navigation";

export default async function UpdateServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const service = await ServiceService.getBySlug(slug);

  if (!service) notFound();

  return (
    <main className="w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader eyebrow="Services" title="Edit service" subtitle="Write on the left, watch the page on the right." />
      </div>

      <ServiceForm service={service} />
    </main>
  );
}
