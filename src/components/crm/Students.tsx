import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { useCRM, actions, SOURCES, STATUSES, type Source, type StudentStatus } from '@/lib/crm-store';
import { fmtDate, StatusBadge, SectionHeader } from './ui-helpers';

const Students = () => {
  const data = useCRM();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '', contact: '', source: 'Instagram' as Source, course: data.courses[0]?.title || '',
    status: 'Лид' as StudentStatus, comment: '',
  });

  const filtered = data.students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase())
  );

  const save = () => {
    if (!form.name.trim()) return;
    actions.addStudent({ ...form, stage: 'Новый лид' });
    setForm({ name: '', contact: '', source: 'Instagram', course: data.courses[0]?.title || '', status: 'Лид', comment: '' });
    setOpen(false);
  };

  return (
    <div>
      <SectionHeader
        title="Ученики"
        subtitle={`Всего в базе: ${data.students.length}`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 neon-glow">
                <Icon name="Plus" size={18} className="mr-1" /> Добавить ученика
              </Button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader><DialogTitle className="font-display">Новый ученик</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="ФИО" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <Input placeholder="Telegram / телефон" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Select value={form.source} onValueChange={(v) => setForm({ ...form, source: v as Source })}>
                    <SelectTrigger><SelectValue placeholder="Источник" /></SelectTrigger>
                    <SelectContent>{SOURCES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as StudentStatus })}>
                    <SelectTrigger><SelectValue placeholder="Статус" /></SelectTrigger>
                    <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Select value={form.course} onValueChange={(v) => setForm({ ...form, course: v })}>
                  <SelectTrigger><SelectValue placeholder="Курс" /></SelectTrigger>
                  <SelectContent>{data.courses.map((c) => <SelectItem key={c.id} value={c.title}>{c.title}</SelectItem>)}</SelectContent>
                </Select>
                <Textarea placeholder="Комментарий" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} />
              </div>
              <DialogFooter>
                <Button onClick={save} className="bg-primary hover:bg-primary/90">Сохранить</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="relative mb-4 max-w-sm">
        <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Поиск по имени или контакту" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-left">
                <th className="p-4 font-medium">ФИО</th>
                <th className="p-4 font-medium">Контакт</th>
                <th className="p-4 font-medium">Источник</th>
                <th className="p-4 font-medium">Курс</th>
                <th className="p-4 font-medium">Статус</th>
                <th className="p-4 font-medium">Добавлен</th>
                <th className="p-4 font-medium">Комментарий</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="p-4 font-medium whitespace-nowrap">{s.name}</td>
                  <td className="p-4 text-muted-foreground whitespace-nowrap">{s.contact}</td>
                  <td className="p-4 whitespace-nowrap">{s.source}</td>
                  <td className="p-4 text-muted-foreground max-w-[180px] truncate">{s.course}</td>
                  <td className="p-4">
                    <Select value={s.status} onValueChange={(v) => actions.updateStudent(s.id, { status: v as StudentStatus })}>
                      <SelectTrigger className="h-8 w-auto border-none bg-transparent p-0 gap-2"><StatusBadge value={s.status} /></SelectTrigger>
                      <SelectContent>{STATUSES.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                    </Select>
                  </td>
                  <td className="p-4 text-muted-foreground whitespace-nowrap">{fmtDate(s.createdAt)}</td>
                  <td className="p-4 text-muted-foreground max-w-[200px] truncate">{s.comment || '—'}</td>
                  <td className="p-4">
                    <button onClick={() => actions.deleteStudent(s.id)} className="text-muted-foreground hover:text-destructive">
                      <Icon name="Trash2" size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center text-muted-foreground">Ничего не найдено</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Students;
