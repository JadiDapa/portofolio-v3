"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { User } from "@/generated/prisma";
import {
  filterMenuByRole,
  overviewItems,
  settingsItems,
} from "@/lib/sidebar-menu";
import {
  PanelRightOpen,
  LogOut,
  ChevronsUpDown,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { Separator } from "../ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export default function DashboardSidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { signOut } = useClerk();
  const router = useRouter();

  const visibleOverviewItems = filterMenuByRole(overviewItems, user.role);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/sign-in");
  };

  return (
    <Sidebar className="border-none p-0">
      <SidebarContent className="bg-card">
        <div className="border-border bg-card flex h-screen flex-col border-r">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary size-6" />
              <div>
                <p className="text-foreground text-lg font-bold tracking-tight">
                  Daffa Ridovani
                </p>
              </div>
            </div>
            <button
              onClick={toggleSidebar}
              className="text-muted-foreground hover:bg-accent hover:text-foreground rounded-md p-1 transition-colors"
            >
              <PanelRightOpen className="size-5" strokeWidth={1.5} />
            </button>
          </div>

          {/* Scrollable nav area */}
          <ScrollArea className="flex-1 overflow-hidden px-3 py-4">
            {/* MENU section */}
            <SidebarGroup className="p-0 pb-4">
              <SidebarGroupLabel className="text-muted-foreground mb-1 text-[11px] font-semibold uppercase tracking-widest">
                Menu
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {visibleOverviewItems.map((item) => {
                    const active = pathname === item.url;

                    if (item.submenu) {
                      return (
                        <Collapsible
                          key={item.title}
                          className="group/collapsible"
                        >
                          <SidebarMenuItem className="px-1">
                            <CollapsibleTrigger asChild>
                              <SidebarMenuButton className="hover:bg-muted! data-[active=true]:bg-primary! flex h-10 cursor-pointer items-center gap-3 bg-transparent! text-sm data-[active=true]:text-white">
                                <item.icon className="size-4" />
                                <span className="text-sm">{item.title}</span>
                                <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <SidebarMenuSub>
                                {item.submenu.map((sub) => {
                                  const subActive = pathname === sub.url;
                                  return (
                                    <SidebarMenuSubItem
                                      key={sub.title}
                                      className="p-0"
                                    >
                                      <Link
                                        href={sub.url}
                                        className={`flex h-9 items-center gap-3 rounded-lg px-3 pl-8 text-sm font-medium transition-colors ${
                                          subActive
                                            ? "text-primary"
                                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                        }`}
                                      >
                                        {sub.title}
                                      </Link>
                                    </SidebarMenuSubItem>
                                  );
                                })}
                              </SidebarMenuSub>
                            </CollapsibleContent>
                          </SidebarMenuItem>
                        </Collapsible>
                      );
                    }

                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          isActive={active}
                          className="hover:bg-muted! data-[active=true]:bg-primary! bg-transparent! text-sm data-[active=true]:text-white"
                          asChild
                        >
                          <Link
                            href={item.url}
                            className={`flex h-10 items-center gap-3 rounded-lg px-3 font-medium transition-colors ${
                              active
                                ? "text-background"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                          >
                            <item.icon className="size-4 shrink-0" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator />

            {/* General section — logout always shown */}
            <SidebarGroup className="p-0 pt-3">
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {settingsItems.map((item) => {
                    const active = pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title} className="p-0">
                        <SidebarMenuButton
                          asChild
                          className="hover:bg-muted! data-[active=true]:bg-primary! bg-transparent! text-sm"
                        >
                          <Link
                            href={item.url}
                            className={`flex h-10 items-center gap-3 rounded-lg px-3 font-medium transition-colors ${
                              active
                                ? "text-primary"
                                : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                          >
                            <item.icon className="size-4 shrink-0" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                  <SidebarMenuItem className="p-0">
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-muted! bg-transparent! text-sm"
                    >
                      <button
                        onClick={handleSignOut}
                        className="text-muted-foreground hover:bg-accent hover:text-foreground flex h-10 w-full items-center gap-3 rounded-lg px-3 font-medium transition-colors"
                      >
                        <LogOut className="size-4 shrink-0" />
                        <span>Log Out</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </ScrollArea>

          {/* Bottom: User profile */}
          <div className="border-border border-t px-3 py-3">
            <div className="flex w-full items-center gap-3 rounded-lg px-2 py-2">
              <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="text-foreground truncate text-sm font-semibold">
                  {user?.name || user?.username || "User"}
                </span>
                <span className="text-muted-foreground truncate text-xs capitalize">
                  {user?.role?.toLowerCase()}
                </span>
              </div>
              <ChevronsUpDown className="text-muted-foreground size-4 shrink-0" />
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
