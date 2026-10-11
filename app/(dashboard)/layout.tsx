import { ReactNode } from "react";
import { redirect } from "next/navigation";
import DbRail from "@/components/dashboard/ui/DbRail";
import { getCurrentUser } from "@/lib/auth";
import { SearchService } from "@/servers/services/search.service";
import { ContactService } from "@/servers/services/contact.service";

type Props = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/");

  const [unread, entries] = await Promise.all([
    ContactService.countUnread(),
    SearchService.index(),
  ]);

  return (
    <div className="db-root">
      <DbRail user={user} unread={unread} entries={entries} />
      <div className="db-main">
        <div className="db-content">{children}</div>
      </div>
    </div>
  );
}
