import { Recognition } from "@/generated/prisma";
import RecognitionSheet from "./RecognitionSheet";

export default function RecognitionCard({
  recognition: r,
}: {
  recognition: Recognition;
}) {
  return (
    <div className="db-card">
      <div className="db-card_panel">
        <div className="db-card_top">
          <span className="db-chip">{r.kind.toLowerCase()}</span>
          <div className="flex items-center gap-3">
            {!r.published && (
              <span className="db-stamp" data-tone="quiet">
                Hidden
              </span>
            )}
            <RecognitionSheet recognition={r} />
          </div>
        </div>

        <p className="db-reco_title">{r.title}</p>

        <div className="db-card_foot">
          <p className="db-cell-sub font-semibold uppercase tracking-widest">
            {[r.source, r.year].filter(Boolean).join(" / ")}
          </p>
        </div>
      </div>
    </div>
  );
}
