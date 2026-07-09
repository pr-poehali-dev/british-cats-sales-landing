import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import { useCRM, actions } from '@/lib/crm-store';
import { fmtMoney, fmtDate, SectionHeader } from './ui-helpers';

const Courses = () => {
  const data = useCRM();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', price: '', startDate: '', seats: '' });

  const save = () => {
    if (!form.title.trim()) return;
    actions.addCourse({
      title: form.title,
      price: Number(form.price) || 0,
      startDate: form.startDate,
      seats: Number(form.seats) || 0,
    });
    setForm({ title: '', price: '', startDate: '', seats: '' });
    setOpen(false);
  };

  return (
    <div>
      <SectionHeader
        title="Курсы"
        subtitle={`Активных программ: ${data.courses.length}`}
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 neon-glow">
                <Icon name="Plus" size={18} className="mr-1" /> Добавить курс
              </Button>
            </DialogTrigger>
            <DialogContent className="glass">
              <DialogHeader><DialogTitle className="font-display">Новый курс</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Название курса" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <Input type="number" placeholder="Цена, ₽" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                  <Input type="number" placeholder="Кол-во мест" value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} />
                </div>
              </div>
              <DialogFooter><Button onClick={save} className="bg-primary hover:bg-primary/90">Сохранить</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.courses.map((c) => {
          const enrolled = data.students.filter((s) => s.course === c.title).length;
          return (
            <div key={c.id} className="glass rounded-2xl p-5 hover:border-primary/40 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon name="GraduationCap" className="text-primary" size={22} />
                </div>
                <button onClick={() => actions.deleteCourse(c.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
              <h3 className="font-display font-semibold text-lg mb-3">{c.title}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Icon name="Tag" size={14} /> Стоимость</span>
                  <span className="font-semibold text-primary">{fmtMoney(c.price)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Icon name="Calendar" size={14} /> Старт</span>
                  <span>{fmtDate(c.startDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-2"><Icon name="Users" size={14} /> Записано / мест</span>
                  <span>{enrolled} / {c.seats}</span>
                </div>
              </div>
              <div className="mt-4 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-primary neon-glow" style={{ width: `${c.seats ? Math.min(100, (enrolled / c.seats) * 100) : 0}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;
