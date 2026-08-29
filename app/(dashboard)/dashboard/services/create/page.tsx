import { getCurrentUser } from "@/app/action/user.action";
import DynamicBreadcrumb from "@/components/dashboard/DynamicBreadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import CreateServiceForm from "@/components/dashboard/services/CreateServiceForm";
import { redirect } from "next/navigation";

export default async function CreateServicePage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <main className="w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader title="New Service" subtitle="Add a service offering." />
      </div>

      <CreateServiceForm />
    </main>
  );
}
