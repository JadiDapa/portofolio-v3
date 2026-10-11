"use client";

import { useSyncExternalStore } from "react";
import RevealHeading from "@/components/root/work/RevealHeading";

const TIME_ZONE = "Asia/Jakarta";
const ZONE_LABEL = "WIB";
const OPEN_DAYS = [1, 2, 3, 4, 5]; // Mon - Fri
const OPEN_FROM = 9;
const OPEN_UNTIL = 17;

/** Wall-clock parts in Jakarta, independent of the visitor's own zone. */
function jakartaNow(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return {
    day: days.indexOf(get("weekday")),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    second: Number(get("second")),
    label: new Intl.DateTimeFormat("en-US", {
      timeZone: TIME_ZONE,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(date),
  };
}

// Ticks once a second; the snapshot is the current whole second so React
// only re-renders when the displayed time actually changes.
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}
const getSecond = () => Math.floor(Date.now() / 1000);
const getServerSecond = () => null;

/** Current time, or null during SSR/hydration so the markup always matches. */
function useNow() {
  const second = useSyncExternalStore(subscribe, getSecond, getServerSecond);
  return second === null ? null : new Date(second * 1000);
}

/** Square tile with an analogue clock showing Jakarta time. */
function ClockTile({ hour, minute }: { hour: number; minute: number }) {
  const minuteDeg = minute * 6;
  const hourDeg = (hour % 12) * 30 + minute * 0.5;

  return (
    <div className="ct-tile ct-tile-glass wk-b" aria-hidden>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10.25" />
        <line
          x1="12"
          y1="12"
          x2="12"
          y2="6.5"
          strokeLinecap="round"
          style={{ transform: `rotate(${hourDeg}deg)` }}
        />
        <line
          x1="12"
          y1="12"
          x2="12"
          y2="4.5"
          strokeLinecap="round"
          style={{ transform: `rotate(${minuteDeg}deg)` }}
        />
      </svg>
    </div>
  );
}

export default function StudioClock() {
  const now = useNow();
  const t = now ? jakartaNow(now) : null;
  const open =
    !!t && OPEN_DAYS.includes(t.day) && t.hour >= OPEN_FROM && t.hour < OPEN_UNTIL;

  return (
    <section className="ct-sticky" data-cmp="sticky">
      <div>
        <ClockTile hour={t?.hour ?? 10} minute={t?.minute ?? 10} />
      </div>

      <div className="ct-time space-y-(--space-s-m) text-center" data-cmp="time">
        <div>
          <div className="wk-b ct-tile-glass ct-p-sm wk-type-text ct-text" data-cmp="clock">
            {t ? `${ZONE_LABEL} ${t.label}` : " "}
          </div>
          <div className="wk-b ct-dark ct-p-sm" data-cmp="status">
            <p className="wk-label">I&apos;m currently</p>
            <p className="ct-subheading">
              {t && (
                <RevealHeading key={String(open)} text={open ? "Available" : "Offline"} inView />
              )}
              {!t && <span className="block">&nbsp;</span>}
            </p>
          </div>
        </div>

        <div data-cmp="hours">
          <div className="wk-b ct-tile-glass ct-p-sm wk-label ct-black">
            Working Hours
          </div>
          <div className="wk-type-text ct-text flex uppercase">
            <div className="wk-b ct-tile-glass ct-p-sm grow">Mon - Fri</div>
            <div className="wk-b ct-tile-glass ct-p-sm grow">
              {String(OPEN_FROM).padStart(2, "0")}:00 - {OPEN_UNTIL}:00
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
