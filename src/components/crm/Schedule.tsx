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
import { useCRM, actions } from '@/lib/crm-store';
import { fmtDate, SectionHeader } from './ui-helpers';

const Schedule = () => {
  const data = useCRM();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    course: data.courses[0]?.title || '', group: '', topic: '', date: '', time: '',
  });

  const save = () => {
    if (!form.topic.trim() || !form.date) return;
    actions.addLesson(form);
    setForm({ course: data.courses[0]?.title || '', group: '', topic: '', date: '', time: '' });
    setOpen(false);
  };

  const sorted = [...data.lessons].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return (
    <div>
      <SectionHeader
        title="Расписание"
        subtitle={`Запланировано занятий: ${data.lessons.length}`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 neon-glow">
                <Icon name="Plus" size={18} className="mr-1" /> Добавить занятие
              </Button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader><DialogTitle className="font-display">Новое занятие</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Select value={form.course} onValueChange={(v) => setForm({ ...form, course: v })}>
                  <SelectTrigger><SelectValue placeholder="Курс" /></SelectTrigger>
                  <SelectContent>{data.courses.map((c) => <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="Группа (например, A-1)" value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} />
                <Input placeholder="Тема занятия" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>
              <DialogFooter><Button onClick={save} className="bg-primary hover:bg-primary/90">Сохранить</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-left">
                <th className="p-4 font-medium">Дата</th>
                <th className="p-4 font-medium">Время</th>
                <th className="p-4 font-medium">Курс</th>
                <th className="p-4 font-medium">Группа</th>
                <th className="p-4 font-medium">Тема</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((l) => (
                <tr key={l.id} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="p-4 whitespace-nowrap">{fmtDate(l.date)}</td>
                  <td className="p-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 text-primary"><Icon name="Clock" size={14} /> {l.time}</span>
                  </td>
                  <td className="p-4 text-muted-foreground max-w-[200px] truncate">{l.course}</td>
                  <td className="p-4 whitespace-nowrap">{l.group || '—'}</td>
                  <td className="p-4 font-medium">{l.topic}</td>
                  <td className="p-4">
                    <button onClick={() => actions.deleteLesson(l.id)} className="text-muted-foreground hover:text-destructive">
                      <Icon name="Trash2" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={6} className="p-10 text-center text-muted-foreground">Занятий пока нет</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
