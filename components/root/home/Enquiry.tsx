import { Asterisk, MessageSquare } from "lucide-react";
import ContactForm from "@/components/root/ContactForm";
import PrioritiesAside from "@/components/root/home/PrioritiesAside";
import SectionTitle from "@/components/root/home/SectionTitle";
import { ChatArt } from "@/components/root/work/WorkArt";

/**
 * Title box (icon tiles hanging off its top-left), then the framed enquiry
 * form with the quality / deadline / cost switches beside it.
 */
export default function Enquiry() {
  return (
    <section className="px-gutter hidden pt-(--gutter-pad) lg:block" data-sec="enquiry">
      <div className="page-grid">
        <div className="hidden flex-col items-end lg:flex">
          <div className="sv-tile wk-b flex">
            <MessageSquare strokeWidth={1.3} aria-hidden />
          </div>
          <div className="sv-tile sv-tile--dark flex">
            <Asterisk strokeWidth={2.2} aria-hidden />
          </div>
        </div>

        <div className="col-span-full lg:col-span-3">
          <SectionTitle
            boxed
            labelLeft="Your search"
            labelRight="ends with me"
            art={<ChatArt />}
            heading="Tell me about your *project*"
            opening="Give me a few key details on the form below and I'll be in touch!"
          />
        </div>
      </div>

      <div className="page-grid">
        <div className="hm-enq-form col-span-full lg:col-span-3 lg:pr-(--sv-grid)">
          <ContactForm framed />
        </div>
        <PrioritiesAside />
      </div>
    </section>
  );
}
