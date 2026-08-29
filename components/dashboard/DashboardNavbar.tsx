import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bell, Search } from "lucide-react";
import { ToggleTheme } from "./ToggleTheme";
import Link from "next/link";
import { User } from "@/generated/prisma";

export default async function DashboardNavbar({ user }: { user: User }) {
  return (
    <nav className="border-border bg-card sticky top-0 z-50 flex items-center justify-between border-b px-24 py-3">
      {/* Search */}
      <div className="border-border bg-background flex w-72 items-center gap-2 rounded-lg border px-3 py-2">
        <Search className="text-muted-foreground h-4 w-4 shrink-0" />
        <Input
          type="text"
          placeholder="Search..."
          className="placeholder:text-muted-foreground h-auto border-none bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
        />
        <Badge
          variant="outline"
          className="border-border text-muted-foreground shrink-0 rounded-md px-1.5 py-0.5 text-xs"
        >
          ⌘K
        </Badge>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <button className="border-border text-muted-foreground hover:bg-accent hover:text-foreground rounded-lg border p-2 transition-colors">
          <Bell className="h-4 w-4" />
        </button>

        <ToggleTheme />

        <div className="bg-border mx-1 h-6 w-px" />

        {/* User profile */}
        <Link
          href="/dashboard"
          className="hover:bg-accent flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors"
        >
          <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold">
            {(user?.name || user?.username || "U").charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-foreground text-sm font-semibold">
              {user?.name || user?.username || "User"}
            </span>
            <span className="text-muted-foreground text-xs capitalize">
              {user?.role?.toLowerCase()}
            </span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
