"use client";

import Link from "next/link";
import { isVideo, pad2 } from "@/lib/format";
import { useRef } from "react";
import type { Service } from "@/generated/prisma";
import { leanPanel } from "@/components/root/work/GridButton";
import { SkillSchema, parseList } from "@/servers/validators/service.validator";
import { DEFAULT_SERVICE_ICON, SERVICE_ICONS } from "@/components/root/serviceIcons";


/**
 * Grid-button row: the panel leans toward the cursor while the text slides
 * right and the service's media slides in from the left edge.
 */
export default function ServiceRow({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const panel = useRef<HTMLSpanElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const skills = parseList(SkillSchema, service.skills);
  const Icon = SERVICE_ICONS[service.slug] ?? DEFAULT_SERVICE_ICON;
  // Only the first rows carry measurement hooks for the layout checks
  const cmp = (key: string) => (index === 0 ? key : undefined);

  return (
    <li className="flex grow items-start">
      <Link
        href={`/services/${service.slug}`}
        data-cmp={index < 2 ? `row${index + 1}` : undefined}
        className="sv-row wk-btn wk-btn--expand"
        onPointerMove={(e) => leanPanel(panel.current, e)}
        onPointerEnter={() => video.current?.play().catch(() => {})}
        onPointerLeave={() => video.current?.pause()}
      >
        <span ref={panel} className="wk-btn_panel wk-b">
          <span className="wk-btn_inner">
            <span data-cmp={cmp("row1MediaWrap")} className="sv-row-media" aria-hidden>
              {service.media ? (
                <span data-cmp={cmp("row1Media")} className="sv-row-media-inner">
                  {isVideo(service.media) ? (
                    <video
                      ref={video}
                      src={service.media}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={service.media} alt="" />
                  )}
                </span>
              ) : (
                <span
                  data-cmp={cmp("row1Media")}
                  className="sv-row-media-inner sv-tile--dark"
                >
                  <Icon strokeWidth={1} />
                </span>
              )}
            </span>

            <span data-cmp={cmp("row1Text")} className="sv-row-text">
              <span data-cmp={cmp("row1Label")} className="sv-row-num wk-label">
                {pad2(index + 1)}
              </span>
              <span className="block">
                <span data-cmp={cmp("row1Heading")} className="sv-row-heading block">
                  {service.title}
                </span>
                <span data-cmp={cmp("row1Sub")} className="sv-row-sub block">
                  {service.summary}
                </span>
                {skills.length > 0 && (
                  <span className="sv-row-skills wk-label block">
                    {skills.map((k) => k.name.replace(/ (Development|Engineering)$/, "")).join(" · ")}
                  </span>
                )}
              </span>
            </span>
          </span>
        </span>
      </Link>
    </li>
  );
}
