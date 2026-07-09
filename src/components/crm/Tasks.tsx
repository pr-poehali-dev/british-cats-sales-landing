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
import {
  useTasksData, tasksActions, TASK_STATUS_META, TASK_PRIORITY_META,
  type TaskPriority, type TaskStatus, type Task,
} from '@/lib/tasks-store';
import { CHANNEL_META, type Channel } from '@/lib/chat-store';
import { SectionHeader, fmtDate } from './ui-helpers';
import func2url from '../../../backend/func2url.json';

const Tasks = () => {
  const data = useTasksData();
  const [tab, setTab] = useState<'tasks' | 'managers'>('tasks');

  return (
    <div>
      <SectionHeader
        title="Задачи менеджерам"
        subtitle="Ставьте задачи и отправляйте их менеджерам одной кнопкой"
        action={tab === 'tasks' ? <NewTaskButton /> : <NewManagerButton />}
      />

      <div className="flex gap-2 mb-5">
        <TabBtn active={tab === 'tasks'} onClick={() => setTab('tasks')} icon="ListChecks" label={`Задачи · ${data.tasks.length}`} />
        <TabBtn active={tab === 'managers'} onClick={() => setTab('managers')} icon="UserCog" label={`Менеджеры · ${data.managers.length}`} />
      </div>

      {tab === 'tasks' ? <TaskList /> : <ManagerList />}
    </div>
  );
};

const TabBtn = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
      active ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary'
    }`}
  >
    <Icon name={icon} size={16} /> {label}
  </button>
);

const TaskList = () => {
  const data = useTasksData();
  const [sending, setSending] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: string; ok: boolean; text: string } | null>(null);

  const managerById = (id: string) => data.managers.find((m) => m.id === id);

  const buildText = (t: Task) => {
    const m = managerById(t.managerId);
    const pr = TASK_PRIORITY_META[t.priority].label;
    return `📋 Новая задача\n\n<b>${t.title}</b>\n${t.description || ''}\n\n👤 ${m?.name || ''}\n⚡ Приоритет: ${pr}\n📅 Срок: ${fmtDate(t.dueDate)}`;
  };

  const send = async (t: Task) => {
    const m = managerById(t.managerId);
    if (!m || sending) return;
    setSending(t.id);
    setToast(null);
    try {
      const res = await fetch(func2url['send-task'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel: m.channel, contact: m.contact, text: buildText(t) }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        tasksActions.markSent(t.id);
        setToast({ id: t.id, ok: true, text: `Отправлено в ${CHANNEL_META[m.channel].label}` });
      } else {
        setToast({ id: t.id, ok: false, text: json.detail || json.error || 'Не удалось отправить' });
      }
    } catch {
      setToast({ id: t.id, ok: false, text: 'Ошибка соединения' });
    } finally {
      setSending(null);
    }
  };

  if (data.tasks.length === 0) {
    return <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Пока нет задач. Создайте первую.</div>;
  }

  return (
    <div className="space-y-3">
      {data.tasks.map((t) => {
        const m = managerById(t.managerId);
        const st = TASK_STATUS_META[t.status];
        const pr = TASK_PRIORITY_META[t.priority];
        const ch = m ? CHANNEL_META[m.channel] : null;
        return (
          <div key={t.id} className="glass rounded-2xl p-4 md:p-5">
            <div className="flex items-start gap-3 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-flex items-center gap-1 text-xs ${pr.color}`}>
                    <Icon name={pr.icon} size={14} /> {pr.label}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${st.color}`}>{st.label}</span>
                  {t.sentAt && (
                    <span className="inline-flex items-center gap-1 text-xs text-success">
                      <Icon name="CheckCheck" size={13} /> Отправлено
                    </span>
                  )}
                </div>
                <h3 className="font-medium text-base mt-1.5">{t.title}</h3>
                {t.description && <p className="text-sm text-muted-foreground mt-1">{t.description}</p>}
                <div className="flex items-center gap-4 mt-2.5 text-xs text-muted-foreground flex-wrap">
                  {m && (
                    <span className="flex items-center gap-1.5">
                      <Icon name="User" size={13} /> {m.name}
                      {ch && <span className="flex items-center gap-1"><Icon name={ch.icon} size={12} className={ch.color} /> {m.contact}</span>}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5"><Icon name="CalendarClock" size={13} /> Срок: {fmtDate(t.dueDate)}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="flex gap-2">
                  <Select value={t.status} onValueChange={(v) => tasksActions.updateTask(t.id, { status: v as TaskStatus })}>
                    <SelectTrigger className="h-9 w-[130px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(TASK_STATUS_META) as TaskStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>{TASK_STATUS_META[s].label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => send(t)}
                    disabled={sending === t.id || !m}
                    className="h-9 bg-primary hover:bg-primary/90 neon-glow shrink-0"
                  >
                    {sending === t.id
                      ? <Icon name="Loader2" size={16} className="animate-spin" />
                      : <><Icon name="Send" size={15} className="mr-1" /> Отправить</>}
                  </Button>
                  <button onClick={() => tasksActions.removeTask(t.id)} className="text-muted-foreground hover:text-destructive px-1">
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
                {toast?.id === t.id && (
                  <span className={`text-xs flex items-center gap-1 ${toast.ok ? 'text-success' : 'text-destructive'}`}>
                    <Icon name={toast.ok ? 'CheckCircle2' : 'TriangleAlert'} size={12} /> {toast.text}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const NewTaskButton = () => {
  const data = useTasksData();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', managerId: data.managers[0]?.id || '',
    priority: 'normal' as TaskPriority, dueDate: '',
  });

  const save = () => {
    if (!form.title.trim() || !form.managerId) return;
    tasksActions.addTask(form);
    setForm({ title: '', description: '', managerId: data.managers[0]?.id || '', priority: 'normal', dueDate: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 neon-glow" disabled={data.managers.length === 0}>
          <Icon name="Plus" size={18} className="mr-1" /> Новая задача
        </Button>
      </DialogTrigger>
      <DialogContent className="glass">
        <DialogHeader><DialogTitle className="font-display">Новая задача</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Что нужно сделать" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Textarea placeholder="Описание (необязательно)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Назначить менеджеру</label>
            <Select value={form.managerId} onValueChange={(v) => setForm({ ...form, managerId: v })}>
              <SelectTrigger><SelectValue placeholder="Выберите менеджера" /></SelectTrigger>
              <SelectContent>
                {data.managers.map((m) => (
                  <SelectItem key={m.id} value={m.id}>{m.name} — {m.role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Приоритет</label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as TaskPriority })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(TASK_PRIORITY_META) as TaskPriority[]).map((p) => (
                    <SelectItem key={p} value={p}>{TASK_PRIORITY_META[p].label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Срок</label>
              <Input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </div>
        </div>
        <DialogFooter><Button onClick={save} className="bg-primary hover:bg-primary/90">Создать задачу</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ManagerList = () => {
  const data = useTasksData();
  if (data.managers.length === 0) {
    return <div className="glass rounded-2xl p-10 text-center text-muted-foreground">Добавьте менеджеров, чтобы назначать им задачи.</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {data.managers.map((m) => {
        const ch = CHANNEL_META[m.channel];
        const count = data.tasks.filter((t) => t.managerId === m.id && t.status !== 'done').length;
        return (
          <div key={m.id} className="glass rounded-2xl p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-11 h-11 rounded-full bg-accent/15 flex items-center justify-center text-accent font-semibold">
                {m.name.charAt(0)}
              </div>
              <button onClick={() => tasksActions.removeManager(m.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                <Icon name="Trash2" size={16} />
              </button>
            </div>
            <h3 className="font-medium text-lg">{m.name}</h3>
            <p className="text-sm text-muted-foreground">{m.role}</p>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <Icon name={ch.icon} size={15} className={ch.color} />
              <span className="text-muted-foreground">{ch.label} · {m.contact}</span>
            </div>
            <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1.5">
              <Icon name="ListTodo" size={13} /> Активных задач: {count}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const NewManagerButton = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', channel: 'telegram' as Channel, contact: '' });

  const save = () => {
    if (!form.name.trim()) return;
    tasksActions.addManager(form);
    setForm({ name: '', role: '', channel: 'telegram', contact: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 neon-glow">
          <Icon name="UserPlus" size={18} className="mr-1" /> Добавить менеджера
        </Button>
      </DialogTrigger>
      <DialogContent className="glass">
        <DialogHeader><DialogTitle className="font-display">Новый менеджер</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Роль (напр. Менеджер по продажам)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Мессенджер для задач</label>
            <Select value={form.channel} onValueChange={(v) => setForm({ ...form, channel: v as Channel })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {(Object.keys(CHANNEL_META) as Channel[]).map((c) => (
                  <SelectItem key={c} value={c}>{CHANNEL_META[c].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input placeholder="Контакт (@username или chat id)" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
        </div>
        <DialogFooter><Button onClick={save} className="bg-primary hover:bg-primary/90">Сохранить</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Tasks;
