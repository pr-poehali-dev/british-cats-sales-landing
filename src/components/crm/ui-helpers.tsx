export const fmtMoney = (n: number) =>
  n.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });

export const fmtDate = (d: string) => {
  if (!d) return '—';
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
};

const STATUS_STYLES: Record<string, string> = {
  Лид: 'bg-warning/15 text-warning border-warning/30',
  Оплатил: 'bg-primary/15 text-primary border-primary/30',
  Учится: 'bg-neon/15 text-neon border-neon/30',
  Завершил: 'bg-success/15 text-success border-success/30',
  Отказ: 'bg-destructive/15 text-destructive border-destructive/30',
  Получена: 'bg-success/15 text-success border-success/30',
  Ожидает: 'bg-warning/15 text-warning border-warning/30',
};

export const StatusBadge = ({ value }: { value: string }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
      STATUS_STYLES[value] || 'bg-secondary text-muted-foreground border-border'
    }`}
  >
    {value}
  </span>
);

export const SectionHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-5 md:mb-6 gap-3 sm:gap-4">
    <div className="min-w-0">
      <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold">{title}</h1>
      {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
    </div>
    {action && <div className="shrink-0 [&_button]:w-full sm:[&_button]:w-auto">{action}</div>}
  </div>
);