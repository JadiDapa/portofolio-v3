import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Service } from "@/generated/prisma";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group bg-card block rounded-lg border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-xl font-semibold">{service.title}</h3>
        <ArrowUpRight className="text-muted-foreground size-5 shrink-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>
      <p className="text-muted-foreground text-sm mt-2">{service.summary}</p>
    </Link>
  );
}
