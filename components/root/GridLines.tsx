export default function GridLines() {
  return (
    <div
      aria-hidden
      className="px-gutter pointer-events-none fixed inset-0 z-0"
    >
      <div className="hm-gl page-grid border-grid h-full border-r">
        <div className="border-grid border-l" />
        <div className="border-grid hidden border-l lg:block" />
        <div className="border-grid hidden border-l md:block" />
        <div className="border-grid hidden border-l lg:block" />
      </div>
    </div>
  );
}
