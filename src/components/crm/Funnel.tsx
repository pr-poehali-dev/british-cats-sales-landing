import { useState } from 'react';
import Icon from '@/components/ui/icon';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useCRM, actions, STAGES, type FunnelStage } from '@/lib/crm-store';
import { SectionHeader } from './ui-helpers';
import StudentCard from './StudentCard';

const Funnel = () => {
  const data = useCRM();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<FunnelStage | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const drop = (stage: FunnelStage) => {
    if (dragId) actions.setStage(dragId, stage);
    setDragId(null);
    setOverStage(null);
  };

  const activeStudent = data.students.find((s) => s.id === openId) || null;

  return (
    <div>
      <SectionHeader title="Воронка продаж" subtitle="Перетаскивайте карточки между этапами или откройте карточку для редактирования" />

      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const items = data.students.filter((s) => s.stage === stage);
          return (
            <div
              key={stage}
              onDragOver={(e) => { e.preventDefault(); setOverStage(stage); }}
              onDragLeave={() => setOverStage(null)}
              onDrop={() => drop(stage)}
              className={`w-72 shrink-0 rounded-2xl border transition-colors ${
                overStage === stage ? 'border-primary bg-primary/5' : 'border-border bg-card/40'
              }`}
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="font-display font-semibold text-sm">{stage}</span>
                <span className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{items.length}</span>
              </div>
              <div className="p-3 space-y-2 min-h-[120px]">
                {items.map((s) => (
                  <div
                    key={s.id}
                    draggable
                    onDragStart={() => setDragId(s.id)}
                    className="glass rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors group relative"
                  >
                    <button
                      onClick={() => setOpenId(s.id)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-all"
                      title="Открыть карточку"
                    >
                      <Icon name="Pencil" size={14} />
                    </button>
                    <div className="font-medium text-sm mb-1 pr-6">{s.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                      <Icon name="AtSign" size={12} /> {s.contact}
                    </div>
                    <div className="text-xs text-primary flex items-center gap-1">
                      <Icon name="GraduationCap" size={12} /> {s.course}
                    </div>
                    {s.nextCallAt && (
                      <div className="text-xs text-warning flex items-center gap-1 mt-2">
                        <Icon name="CalendarClock" size={12} /> Перезвонить: {s.nextCallAt}
                      </div>
                    )}
                  </div>
                ))}
                {items.length === 0 && (
                  <div className="text-center text-xs text-muted-foreground py-6">Пусто</div>
                )}
              </div>
            </div>
          );
        })}
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

export default Funnel;