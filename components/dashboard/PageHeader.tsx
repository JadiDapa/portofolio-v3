interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-foreground text-2xl font-bold tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      )}
    </div>
  );
}
