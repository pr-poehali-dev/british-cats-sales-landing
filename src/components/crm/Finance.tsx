import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCRM, actions, type PaymentStatus } from '@/lib/crm-store';
import { fmtMoney, fmtDate, StatusBadge, SectionHeader } from './ui-helpers';

const Finance = () => {
  const data = useCRM();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    studentId: data.students[0]?.id || '', course: data.courses[0]?.title || '',
    amount: '', date: '', status: 'Ожидает' as PaymentStatus,
  });

  const studentName = (id: string) => data.students.find((s) => s.id === id)?.name || '—';

  const received = data.payments.filter((p) => p.status === 'Получена').reduce((s, p) => s + p.amount, 0);
  const pending = data.payments.filter((p) => p.status === 'Ожидает').reduce((s, p) => s + p.amount, 0);

  const save = () => {
    if (!form.studentId || !form.amount) return;
    actions.addPayment({
      studentId: form.studentId, course: form.course,
      amount: Number(form.amount) || 0, date: form.date || new Date().toISOString().slice(0, 10),
      status: form.status,
    });
    setForm({ studentId: data.students[0]?.id || '', course: data.courses[0]?.title || '', amount: '', date: '', status: 'Ожидает' });
    setOpen(false);
  };

  return (
    <div>
      <SectionHeader
        title="Финансы"
        subtitle="Учёт платежей учеников"
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 neon-glow">
                <Icon name="Plus" size={18} className="mr-1" /> Добавить платёж
              </Button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader><DialogTitle className="font-display">Новый платёж</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={form.studentId} onValueChange={(v) => setForm({ ...form, studentId: v })}>
                  <SelectTrigger><SelectValue placeholder="Ученик" /></SelectTrigger>
                  <SelectContent>{data.students.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={form.course} onValueChange={(v) => setForm({ ...form, course: v })}>
                  <SelectTrigger><SelectValue placeholder="Курс" /></SelectTrigger>
                  <SelectContent>{data.courses.map((c) => <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>)}</SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-3">
                  <Input type="number" placeholder="Сумма, ₽" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as PaymentStatus })}>
                  <SelectTrigger><SelectValue placeholder="Статус" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ожидает">Ожидает</SelectItem>
                    <SelectItem value="Получена">Получена</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter><Button onClick={save} className="bg-primary hover:bg-primary/90">Сохранить</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-2xl p-5">
          <div className="text-sm text-muted-foreground mb-1">Получено всего</div>
          <div className="font-display text-2xl font-bold text-success">{fmtMoney(received)}</div>
        </div>
        <div className="glass rounded-2xl p-5">
          <div className="text-sm text-muted-foreground mb-1">Ожидает оплаты</div>
          <div className="font-display text-2xl font-bold text-warning">{fmtMoney(pending)}</div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-left">
                <th className="p-4 font-medium">Ученик</th>
                <th className="p-4 font-medium">Курс</th>
                <th className="p-4 font-medium">Сумма</th>
                <th className="p-4 font-medium">Дата</th>
                <th className="p-4 font-medium">Статус</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map((p) => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="p-4 font-medium whitespace-nowrap">{studentName(p.studentId)}</td>
                  <td className="p-4 text-muted-foreground max-w-[200px] truncate">{p.course}</td>
                  <td className="p-4 font-semibold whitespace-nowrap">{fmtMoney(p.amount)}</td>
                  <td className="p-4 text-muted-foreground whitespace-nowrap">{fmtDate(p.date)}</td>
                  <td className="p-4">
                    <button onClick={() => actions.togglePayment(p.id)}><StatusBadge value={p.status} /></button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => actions.deletePayment(p.id)} className="text-muted-foreground hover:text-destructive">
                      <Icon name="Trash2" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {data.payments.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">Платежей пока нет</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;
