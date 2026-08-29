import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { getCurrentUser } from "../action/user.action";

type Props = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  const user = await getCurrentUser();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar user={user} />

        {/* Main area */}
        <main className="bg-background flex flex-1 flex-col">
          <DashboardNavbar user={user} />

          {/* Content takes remaining space */}
          <div className="flex-1 overflow-auto p-6">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
