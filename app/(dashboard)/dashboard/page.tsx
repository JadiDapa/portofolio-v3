import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Briefcase,
  Quote,
  Mail,
  FileText,
  CalendarDays,
  PenSquare,
} from "lucide-react";
import { format } from "date-fns";
import prisma from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [totalProjects, totalTestimonials, newInquiries, publishedPosts, recentPosts] =
    await Promise.all([
      prisma.project.count(),
      prisma.testimonial.count(),
      prisma.contactSubmission.count({ where: { read: false } }),
      prisma.post.count({ where: { published: true } }),
      prisma.post.findMany({
        take: 5,
        orderBy: { id: "desc" },
        include: { author: true },
      }),
    ]);

  const statCards = [
    { label: "Projects", value: totalProjects, icon: Briefcase },
    { label: "Testimonials", value: totalTestimonials, icon: Quote },
    { label: "New Inquiries", value: newInquiries, icon: Mail },
    { label: "Published Journal", value: publishedPosts, icon: FileText },
  ];

  return (
    <main className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Overview of your studio&apos;s content.
          </p>
        </div>

        <div className="text-muted-foreground flex items-center gap-1.5 text-sm">
          <CalendarDays className="size-4" />
          {format(new Date(), "dd MMMM yyyy")}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map((s) => (
          <Card key={s.label} className="border-border/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="bg-muted flex h-11 w-11 items-center justify-center rounded-full">
                <s.icon className="text-muted-foreground size-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">{s.label}</p>
                <p className="text-foreground text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent journal entries */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">
            Recent Journal Entries
          </h2>
          <Link
            href="/dashboard/posts"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            View all →
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {recentPosts.map((post) => (
            <Link key={post.id} href={`/dashboard/posts/update/${post.slug}`}>
              <div className="border-border/60 bg-card hover:bg-accent/30 flex items-center justify-between rounded-xl border px-4 py-3 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <PenSquare className="text-muted-foreground size-4 shrink-0" />
                    <p className="text-foreground truncate text-sm font-medium">
                      {post.title}
                    </p>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {post.author.name ?? post.author.username}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={
                    post.published
                      ? "border-primary/20 bg-primary/10 text-primary"
                      : "border-border bg-muted text-muted-foreground"
                  }
                >
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </div>
            </Link>
          ))}

          {recentPosts.length === 0 && (
            <p className="text-muted-foreground py-8 text-center text-sm">
              No journal entries yet.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
