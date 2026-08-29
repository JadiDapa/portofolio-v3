import { getCurrentUser } from "@/app/action/user.action";
import { ServiceService } from "@/servers/services/service.service";
import DynamicBreadcrumb from "@/components/dashboard/DynamicBreadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import UpdateServiceForm from "@/components/dashboard/services/UpdateServiceForm";
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
        <PageHeader title="Update Service" subtitle="Edit this service." />
      </div>

      <UpdateServiceForm service={service} />
    </main>
  );
}
