import { Suspense } from "react";
import { ProjectService } from "@/servers/services/project.service";
import ContactTitle from "@/components/root/contact/ContactTitle";
import StudioClock from "@/components/root/contact/StudioClock";
import ContactTabs from "@/components/root/contact/ContactTabs";
import ContactPanel from "@/components/root/contact/ContactPanel";
import ContactShowcase from "@/components/root/contact/ContactShowcase";

export default async function ContactPage() {
  const { items } = await ProjectService.list({ published: true, pageSize: 100 });
  const showcase = items
    .filter((p) => p.coverImage)
    .map(({ id, title, coverImage }) => ({ id, title, coverImage: coverImage! }));

  return (
    // overflow-x-clip (not hidden) trims the bleeding showcase rows without breaking the sticky clock
    <article className="px-gutter overflow-x-clip">
      <div className="space-y-(--space-2xl-3xl)">
        <div className="page-grid">
          <div className="col-span-full lg:col-span-2">
            <ContactTitle />
            <Suspense>
              <ContactTabs />
            </Suspense>
            <div className="mt-(--space-xl-2xl) hidden lg:block">
              <StudioClock />
            </div>
          </div>

          <section className="col-span-full lg:col-span-2" data-cmp="form">
            <Suspense>
              <ContactPanel />
            </Suspense>
          </section>
        </div>

        <ContactShowcase items={showcase} />
      </div>
    </article>
  );
}
