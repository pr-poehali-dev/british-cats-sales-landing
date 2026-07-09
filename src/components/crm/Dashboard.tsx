import Icon from '@/components/ui/icon';
import { useCRM } from '@/lib/crm-store';
import { fmtMoney, StatusBadge, SectionHeader } from './ui-helpers';

const Dashboard = () => {
  const data = useCRM();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const total = data.students.length;
  const active = data.students.filter((s) => s.status === 'Учится').length;
  const newLeads = data.students.filter(
    (s) => s.status === 'Лид' && new Date(s.createdAt) >= monthStart
  ).length;
  const revenue = data.payments
    .filter((p) => p.status === 'Получена' && new Date(p.date) >= monthStart)
    .reduce((sum, p) => sum + p.amount, 0);

  const cards = [
    { label: 'Всего учеников', value: total, icon: 'Users', color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Активных (учатся)', value: active, icon: 'Zap', color: 'text-neon', bg: 'bg-neon/10' },
    { label: 'Новых лидов за месяц', value: newLeads, icon: 'UserPlus', color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Выручка за месяц', value: fmtMoney(revenue), icon: 'TrendingUp', color: 'text-success', bg: 'bg-success/10' },
  ];

  const recent = [...data.students].slice(0, 6);

  return (
    <div>
      <SectionHeader title="Дашборд" subtitle="Обзор ключевых показателей школы" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-2xl p-5 hover:border-primary/40 transition-colors">
            <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center mb-4`}>
              <Icon name={c.icon} className={c.color} size={22} />
            </div>
            <div className="font-display text-3xl font-bold mb-1">{c.value}</div>
            <div className="text-sm text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="font-display text-lg font-semibold mb-4">Последние добавленные ученики</h2>
        <div className="space-y-2">
          {recent.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent text-sm font-semibold">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-sm">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{s.course}</div>
                </div>
              </div>
              <StatusBadge value={s.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
