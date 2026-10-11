import { getCurrentUser } from "@/lib/auth";
import { ContactService } from "@/servers/services/contact.service";
import PageHeader from "@/components/dashboard/PageHeader";
import InquiryTable from "@/components/dashboard/inquiries/InquiryTable";
import DbEmpty from "@/components/dashboard/ui/DbEmpty";
import { redirect } from "next/navigation";

export default async function InquiriesPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") redirect("/dashboard");

  const inquiries = await ContactService.getAll();

  return (
    <main className="w-full space-y-6">
      <PageHeader
        eyebrow="(08) Inbox"
        title="Inquiries"
        subtitle="Letters from the contact form. Opening one marks it read."
      />

      {inquiries.length === 0 ? (
        <DbEmpty
          title="No *letters* yet"
          text="When someone fills in the contact form, it lands here."
        />
      ) : (
        <InquiryTable inquiries={inquiries} />
      )}
    </main>
  );
}
