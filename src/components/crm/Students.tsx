import { useState, Fragment } from 'react';
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
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCRM, actions, SOURCES, STATUSES, type Source, type StudentStatus } from '@/lib/crm-store';
import { fmtDate, StatusBadge, SectionHeader } from './ui-helpers';
import StudentCard from './StudentCard';

const Students = () => {
  const data = useCRM();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);
  const [form, setForm] = useState({
    name: '', contact: '', phone: '', email: '', source: 'Instagram' as Source, course: data.courses[0]?.title || '',
    status: 'Лид' as StudentStatus, comment: '',
  });

  const filtered = data.students.filter(
    (s) => s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase()) ||
      (s.phone || '').includes(search) ||
      (s.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const save = () => {
    if (!form.name.trim()) return;
    actions.addStudent({ ...form, stage: 'Новый лид' });
    setForm({ name: '', contact: '', phone: '', email: '', source: 'Instagram', course: data.courses[0]?.title || '', status: 'Лид', comment: '' });
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
                <Input placeholder="Telegram (@username)" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Телефон" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  <Input placeholder="Почта" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
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
                <th className="p-4 font-medium w-8"></th>
                <th className="p-4 font-medium">ФИО</th>
                <th className="p-4 font-medium">Контакты</th>
                <th className="p-4 font-medium">Источник</th>
                <th className="p-4 font-medium">Курс</th>
                <th className="p-4 font-medium">Статус</th>
                <th className="p-4 font-medium">Перезвонить</th>
                <th className="p-4 font-medium">Добавлен</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <Fragment key={s.id}>
                  <tr
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                    className="border-b border-border/50 hover:bg-secondary/40 transition-colors cursor-pointer"
                  >
                    <td className="p-4">
                      <Icon name="ChevronDown" size={16} className={`text-muted-foreground transition-transform ${expanded === s.id ? 'rotate-180 text-primary' : ''}`} />
                    </td>
                    <td className="p-4 font-medium whitespace-nowrap">{s.name}</td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      <div className="space-y-0.5 text-xs">
                        {s.contact && <div className="flex items-center gap-1.5"><Icon name="Send" size={11} className="text-primary" /> {s.contact}</div>}
                        {s.phone && <div className="flex items-center gap-1.5"><Icon name="Phone" size={11} className="text-success" /> {s.phone}</div>}
                        {s.email && <div className="flex items-center gap-1.5"><Icon name="Mail" size={11} className="text-warning" /> {s.email}</div>}
                        {!s.contact && !s.phone && !s.email && '—'}
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">{s.source}</td>
                    <td className="p-4 text-muted-foreground max-w-[180px] truncate">{s.course}</td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Select value={s.status} onValueChange={(v) => actions.updateStudent(s.id, { status: v as StudentStatus })}>
                        <SelectTrigger className="h-8 w-auto border-none bg-transparent p-0 gap-2"><StatusBadge value={s.status} /></SelectTrigger>
                        <SelectContent>{STATUSES.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {s.nextCallAt
                        ? <span className="inline-flex items-center gap-1.5 text-warning text-xs"><Icon name="CalendarClock" size={13} /> {fmtDate(s.nextCallAt)}</span>
                        : <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="p-4 text-muted-foreground whitespace-nowrap">{fmtDate(s.createdAt)}</td>
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setToDelete({ id: s.id, name: s.name })} className="text-muted-foreground hover:text-destructive">
                        <Icon name="Trash2" size={16} />
                      </button>
                    </td>
                  </tr>
                  {expanded === s.id && (
                    <tr>
                      <td colSpan={9} className="p-3 bg-background/40">
                        <StudentCard student={s} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="p-10 text-center text-muted-foreground">Ничего не найдено</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">Правда ли я хочу удалить?</AlertDialogTitle>
            <AlertDialogDescription>
              Ученик <span className="text-foreground font-medium">{toDelete?.name}</span> и вся история по нему будут удалены без возможности восстановления.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { if (toDelete) actions.deleteStudent(toDelete.id); setToDelete(null); }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Students;