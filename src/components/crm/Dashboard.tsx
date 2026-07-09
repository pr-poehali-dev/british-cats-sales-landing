import { useState } from 'react';
import Icon from '@/components/ui/icon';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useCRM } from '@/lib/crm-store';
import { fmtMoney, fmtDate, StatusBadge, SectionHeader } from './ui-helpers';
import StudentCard from './StudentCard';

const Dashboard = () => {
  const data = useCRM();
  const [openId, setOpenId] = useState<string | null>(null);
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const today = now.toISOString().slice(0, 10);
  const activeStudent = data.students.find((s) => s.id === openId) || null;

  const callList = data.students
    .filter((s) => s.nextCallAt && s.nextCallAt <= today)
    .sort((a, b) => (a.nextCallAt || '').localeCompare(b.nextCallAt || ''));

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Icon name="PhoneCall" size={18} className="text-warning" />
            Кому перезвонить сегодня
            {callList.length > 0 && (
              <span className="text-xs bg-warning/15 text-warning border border-warning/30 px-2 py-0.5 rounded-full">{callList.length}</span>
            )}
          </h2>
          <div className="space-y-2">
            {callList.map((s) => {
              const overdue = (s.nextCallAt || '') < today;
              return (
                <button
                  key={s.id}
                  onClick={() => setOpenId(s.id)}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-secondary/50 text-left transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-warning/15 border border-warning/30 flex items-center justify-center text-warning text-sm font-semibold shrink-0">
                      {s.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{s.name}</div>
                      <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                        <Icon name="AtSign" size={11} /> {s.contact}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs whitespace-nowrap flex items-center gap-1 ${overdue ? 'text-destructive' : 'text-warning'}`}>
                    <Icon name={overdue ? 'AlarmClock' : 'CalendarClock'} size={13} />
                    {overdue ? 'Просрочено' : fmtDate(s.nextCallAt || '')}
                  </span>
                </button>
              );
            })}
            {callList.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8 flex flex-col items-center gap-2">
                <Icon name="CheckCircle2" size={28} className="text-success" />
                На сегодня звонков не запланировано
              </div>
            )}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <h2 className="font-display text-lg font-semibold mb-4">Последние добавленные ученики</h2>
          <div className="space-y-2">
            {recent.map((s) => (
              <button
                key={s.id}
                onClick={() => setOpenId(s.id)}
                className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-secondary/50 text-left transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-accent text-sm font-semibold shrink-0">
                    {s.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">{s.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{s.course}</div>
                  </div>
                </div>
                <StatusBadge value={s.status} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="glass max-w-3xl">
          <DialogHeader>
            <DialogTitle className="font-display flex items-center gap-2">
              <Icon name="User" size={18} className="text-primary" />
              {activeStudent?.name}
            </DialogTitle>
          </DialogHeader>
          {activeStudent && <StudentCard student={activeStudent} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;