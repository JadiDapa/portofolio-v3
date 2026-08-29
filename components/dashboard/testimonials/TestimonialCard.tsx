import { Testimonial } from "@/generated/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import EditTestimonialDialog from "./EditTestimonialDialog";

export default function TestimonialCard({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  return (
    <Card className="border-border/60">
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <Badge variant="outline" className="text-xs">
            {testimonial.published ? "Published" : "Hidden"}
          </Badge>
          <EditTestimonialDialog testimonial={testimonial} />
        </div>

        <p className="text-foreground line-clamp-4 text-sm">
          &ldquo;{testimonial.quote}&rdquo;
        </p>

        <div>
          <p className="text-foreground text-sm font-medium">
            {testimonial.authorName}
          </p>
          <p className="text-muted-foreground text-xs">
            {[testimonial.authorTitle, testimonial.company]
              .filter(Boolean)
              .join(", ")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
