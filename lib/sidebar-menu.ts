import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Sparkles,
  Quote,
  GraduationCap,
  Mail,
  LucideIcon,
} from "lucide-react";

export type MenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  roles?: string[];
  submenu?: { title: string; url: string }[];
};

export const overviewItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: Briefcase,
    roles: ["ADMIN"],
  },
  {
    title: "Services",
    url: "/dashboard/services",
    icon: Sparkles,
    roles: ["ADMIN"],
  },
  {
    title: "Testimonials",
    url: "/dashboard/testimonials",
    icon: Quote,
    roles: ["ADMIN"],
  },
  {
    title: "Experience",
    url: "/dashboard/experience",
    icon: GraduationCap,
    roles: ["ADMIN"],
  },
  {
    title: "Journal",
    url: "/dashboard/posts",
    icon: FileText,
    roles: ["ADMIN"],
  },
  {
    title: "Inquiries",
    url: "/dashboard/inquiries",
    icon: Mail,
    roles: ["ADMIN"],
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
    roles: ["ADMIN"],
  },
];

export const settingsItems: MenuItem[] = [];

export function filterMenuByRole(items: MenuItem[], role: string): MenuItem[] {
  return items.filter((item) => !item.roles || item.roles.includes(role));
}
