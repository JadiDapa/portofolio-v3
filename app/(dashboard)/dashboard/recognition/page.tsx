import { getCurrentUser } from "@/lib/auth";
import { RecognitionService } from "@/servers/services/recognition.service";
import PageHeader from "@/components/dashboard/PageHeader";
import RecognitionSheet from "@/components/dashboard/recognition/RecognitionSheet";
import RecognitionCard from "@/components/dashboard/recognition/RecognitionCard";
import ReorderSheet from "@/components/dashboard/ui/ReorderSheet";
import { reorderRecognition } from "@/app/action/recognition.action";
import DbEmpty from "@/components/dashboard/ui/DbEmpty";
import { redirect } from "next/navigation";

export default async function RecognitionPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const items = await RecognitionService.getAll();

  return (
    <main className="w-full space-y-6">
      <PageHeader
        eyebrow="(06) Shelf"
        title="Recognition"
        subtitle="Awards, certifications and press shown on the About page."
        actions={
          <>
            {items.length > 1 && (
              <ReorderSheet
                title="Reorder recognition"
                description="Drag by the grip. This is the order on the About page."
                items={items.map((r) => ({
                  id: r.id,
                  title: r.title,
                  sub: [r.source, r.year].filter(Boolean).join(" / "),
                }))}
                onSave={reorderRecognition}
              />
            )}
            <RecognitionSheet />
          </>
        }
      />

      {items.length === 0 ? (
        <DbEmpty title="The shelf is *empty*" text="Add an award, a feature or a certificate." />
      ) : (
        <div className="db-grid">
          {items.map((r) => (
            <RecognitionCard key={r.id} recognition={r} />
          ))}
        </div>
      )}
    </main>
  );
}
