import { getCurrentUser } from "@/app/action/user.action";
import { ContactService } from "@/servers/services/contact.service";
import PageHeader from "@/components/dashboard/PageHeader";
import InquiryTable from "@/components/dashboard/inquiries/InquiryTable";
import { redirect } from "next/navigation";

export default async function InquiriesPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const inquiries = await ContactService.getAll();

  return (
    <main className="w-full space-y-6">
      <PageHeader title="Inquiries" subtitle="Messages from the contact form." />

      <div className="space-y-2">
        <InquiryTable inquiries={inquiries} />

        {inquiries.length === 0 && (
          <p className="text-muted-foreground py-16 text-center text-sm">
            No inquiries yet.
          </p>
        )}
      </div>
    </main>
  );
}
