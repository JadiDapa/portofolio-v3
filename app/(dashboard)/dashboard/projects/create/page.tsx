import { getCurrentUser } from "@/app/action/user.action";
import DynamicBreadcrumb from "@/components/dashboard/DynamicBreadcrumb";
import PageHeader from "@/components/dashboard/PageHeader";
import CreateProjectForm from "@/components/dashboard/projects/CreateProjectForm";
import { redirect } from "next/navigation";

export default async function CreateProjectPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  return (
    <main className="w-full space-y-6">
      <div className="space-y-2">
        <DynamicBreadcrumb />
        <PageHeader title="New Project" subtitle="Add a project to your portfolio." />
      </div>

      <CreateProjectForm />
    </main>
  );
}
