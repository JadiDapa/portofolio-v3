import { getCurrentUser } from "@/lib/auth";
import PageHeader from "@/components/dashboard/PageHeader";
import ServiceTable from "@/components/dashboard/services/ServiceTable";
import ReorderSheet from "@/components/dashboard/ui/ReorderSheet";
import { reorderServices } from "@/app/action/service.action";
import DbEmpty from "@/components/dashboard/ui/DbEmpty";
import GridButton from "@/components/root/work/GridButton";
import { ServiceService } from "@/servers/services/service.service";
import { redirect } from "next/navigation";

export default async function ServicesPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const items = await ServiceService.getAll();

  return (
    <main className="w-full space-y-6">
      <PageHeader
        eyebrow="(03) Offering"
        title="Services"
        subtitle="What you offer, in the order visitors see it."
        actions={
          <>
            {items.length > 1 && (
              <ReorderSheet
                title="Reorder services"
                description="Drag by the grip. This is the order visitors see on the site."
                items={items.map((s) => ({ id: s.id, title: s.title, sub: s.summary }))}
                onSave={reorderServices}
              />
            )}
            <GridButton href="/dashboard/services/create">New service</GridButton>
          </>
        }
      />

      {items.length === 0 ? (
        <DbEmpty
          title="No *services* listed"
          text="Add what you offer for freelance and contract work."
          href="/dashboard/services/create"
          cta="New service"
        />
      ) : (
        <ServiceTable services={items} />
      )}
    </main>
  );
}
