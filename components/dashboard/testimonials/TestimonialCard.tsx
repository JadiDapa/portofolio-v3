import { Testimonial } from "@/generated/prisma";
import TestimonialSheet from "./TestimonialSheet";

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <div className="db-card">
      <div className="db-card_panel">
        <div className="db-card_top">
          <span className="db-quote_mark" aria-hidden>
            “
          </span>
          <div className="flex items-center gap-3">
            <span
              className="db-stamp"
              data-tone={testimonial.published ? "live" : "quiet"}
            >
              {testimonial.published ? "Live" : "Hidden"}
            </span>
            <TestimonialSheet testimonial={testimonial} />
          </div>
        </div>

        <p className="db-quote">{testimonial.quote}</p>

        <div className="db-card_foot">
          <p className="font-extrabold uppercase tracking-tight">
            {testimonial.authorName}
          </p>
          <p className="db-cell-sub">
            {[testimonial.authorTitle, testimonial.company]
              .filter(Boolean)
              .join(" / ")}
          </p>
        </div>
      </div>
    </div>
  );
}
