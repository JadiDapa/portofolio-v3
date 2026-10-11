import { getCurrentUser } from "@/app/action/user.action";
import { RecognitionService } from "@/servers/services/recognition.service";
import PageHeader from "@/components/dashboard/PageHeader";
import RecognitionDialog from "@/components/dashboard/recognition/RecognitionDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";

export default async function RecognitionPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const items = await RecognitionService.getAll();

  return (
    <main className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Recognition"
          subtitle="Awards, certifications and press shown on the About page."
        />
        <RecognitionDialog />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((r) => (
          <Card key={r.id} className="border-border/60">
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-1.5">
                  <Badge variant="outline" className="text-xs">
                    {r.kind.toLowerCase()}
                  </Badge>
                  {!r.published && (
                    <Badge variant="secondary" className="text-xs">
                      Hidden
                    </Badge>
                  )}
                </div>
                <RecognitionDialog recognition={r} />
              </div>
              <p className="text-foreground text-sm font-medium">{r.title}</p>
              <p className="text-muted-foreground text-xs">
                {[r.source, r.year].filter(Boolean).join(" · ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-muted-foreground py-16 text-center text-sm">
          No recognition yet.
        </p>
      )}
    </main>
  );
}
