import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { ProjectService } from "@/servers/services/project.service";
import { TestimonialService } from "@/servers/services/testimonial.service";
import { ContactService } from "@/servers/services/contact.service";
import { PostService } from "@/servers/services/post.service";
import { PublishedBadge } from "@/components/dashboard/table-columns";
import GridButton from "@/components/root/work/GridButton";
import DbEmpty from "@/components/dashboard/ui/DbEmpty";

const pad2 = (n: number) => String(n).padStart(2, "0");

function greeting(hour: number) {
  if (hour < 5) return "Still up";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function AdminDashboardPage() {
  const [
    user,
    totalProjects,
    totalTestimonials,
    newInquiries,
    publishedPosts,
    recentPosts,
    byMonth,
  ] = await Promise.all([
    getCurrentUser(),
    ProjectService.count(),
    TestimonialService.count(),
    ContactService.countUnread(),
    PostService.countPublished(),
    PostService.getRecent(5),
    ContactService.countByMonth(12),
  ]);

  const now = new Date();
  const firstName = (user.name || user.username).split(" ")[0];
  const peak = Math.max(1, ...byMonth.map((m) => m.count));
  const total = byMonth.reduce((n, m) => n + m.count, 0);

  const metrics = [
    { label: "Projects", value: totalProjects, href: "/dashboard/projects" },
    { label: "Published journal", value: publishedPosts, href: "/dashboard/posts" },
    {
      label: "Unread inquiries",
      value: newInquiries,
      href: "/dashboard/inquiries",
      tone: newInquiries > 0 ? "alert" : undefined,
    },
    { label: "Testimonials", value: totalTestimonials, href: "/dashboard/testimonials" },
  ];

  return (
    <main className="w-full">
      <section className="db-hello">
        <div className="db-hello_date wk-label">
          <span>
            {now.toLocaleDateString("en-GB", { weekday: "long" })}
          </span>
          <span>
            {now.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>V 3.0 / Back office</span>
        </div>
        <h1 className="db-hello_title">
          {greeting(now.getHours())},
          <br />
          <em>{firstName}.</em>
        </h1>
        <p className="db-hello_line">
          {newInquiries > 0
            ? `${newInquiries} ${newInquiries === 1 ? "letter is" : "letters are"} waiting in the inbox.`
            : "Inbox zero. Nothing is waiting on you."}
        </p>
      </section>

      <section className="db-metrics" aria-label="Totals">
        {metrics.map((m, i) => (
          <Link
            key={m.label}
            href={m.href}
            className="db-metric"
            data-tone={m.tone}
          >
            <span className="wk-label text-[#b3b3b3]">({pad2(i + 1)})</span>
            <span className="db-metric_num">{pad2(m.value)}</span>
            <span className="db-metric_foot">
              <span className="wk-label">{m.label}</span>
              <ArrowUpRight className="db-metric_arrow" size={22} strokeWidth={1.4} />
            </span>
          </Link>
        ))}
      </section>

      <div className="db-band">
        <section>
          <div className="db-section_head">
            <h2 className="db-section_title">Inquiries / 12 mo</h2>
            <span className="wk-label text-[#b3b3b3]">{pad2(total)} total</span>
          </div>
          <div className="db-bars" role="img" aria-label={`Inquiries per month, ${total} in the last 12 months`}>
            {byMonth.map((m, i) => (
              <div
                key={`${m.year}-${m.month}`}
                className="db-bar_col"
                data-now={i === byMonth.length - 1}
                title={`${m.count} in ${new Date(m.year, m.month).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`}
              >
                <span className="db-bar_val">{m.count}</span>
                <span
                  className="db-bar_fill"
                  style={{ "--h": (m.count / peak) * 82, "--i": i } as React.CSSProperties}
                />
                <span className="db-bar_lbl">
                  {new Date(m.year, m.month).toLocaleDateString("en-GB", { month: "narrow" })}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="db-section_head">
            <h2 className="db-section_title">Latest journal</h2>
            <Link href="/dashboard/posts" className="db-act">
              All entries
            </Link>
          </div>

          {recentPosts.length === 0 ? (
            <div className="pt-6">
              <DbEmpty
                title="The page is *blank*"
                href="/dashboard/posts/create"
                cta="New entry"
              />
            </div>
          ) : (
            <table className="db-recent">
              <tbody>
                {recentPosts.map((post, i) => (
                  <tr key={post.id} className="db-row" style={{ "--i": i } as React.CSSProperties}>
                    <td className="w-px">
                      <span className="db-idx">{pad2(i + 1)}</span>
                    </td>
                    <td>
                      <Link
                        href={`/dashboard/posts/update/${post.slug}`}
                        className="db-cell-title line-clamp-1"
                      >
                        {post.title}
                      </Link>
                      <span className="db-cell-sub">
                        {post.author.name ?? post.author.username}
                      </span>
                    </td>
                    <td className="w-px">
                      <PublishedBadge published={post.published} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>

      <div className="db-quick">
        <span className="wk-label self-center text-[#b3b3b3]">Start something</span>
        <GridButton href="/dashboard/projects/create">New project</GridButton>
        <GridButton href="/dashboard/posts/create">New entry</GridButton>
        <GridButton href="/dashboard/services/create">New service</GridButton>
      </div>
    </main>
  );
}
