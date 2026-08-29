import { getCurrentUser } from "@/app/action/user.action";
import PageHeader from "@/components/dashboard/PageHeader";
import ServiceTable from "@/components/dashboard/services/ServiceTable";
import { Button } from "@/components/ui/button";
import { ServiceService } from "@/servers/services/service.service";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const services = await ServiceService.getAll();

  return (
    <main className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Services" subtitle="Manage the services you offer." />
        <Button asChild>
          <Link href="/dashboard/services/create">
            <Plus className="size-4" />
            New Service
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <ServiceTable services={services} />

        {services.length === 0 && (
          <p className="text-muted-foreground py-16 text-center text-sm">
            No services yet.{" "}
            <Link
              href="/dashboard/services/create"
              className="text-foreground underline underline-offset-4"
            >
              Add your first service →
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}
