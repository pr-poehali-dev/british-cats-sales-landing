import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useCRM, actions, STAGES, type FunnelStage } from '@/lib/crm-store';
import { SectionHeader } from './ui-helpers';

const Funnel = () => {
  const data = useCRM();
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<FunnelStage | null>(null);

  const drop = (stage: FunnelStage) => {
    if (dragId) actions.setStage(dragId, stage);
    setDragId(null);
    setOverStage(null);
  };

  return (
    <div>
      <SectionHeader title="Воронка продаж" subtitle="Перетаскивайте карточки между этапами" />

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
                    className="glass rounded-xl p-3 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors"
                  >
                    <div className="font-medium text-sm mb-1">{s.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                      <Icon name="AtSign" size={12} /> {s.contact}
                    </div>
                    <div className="text-xs text-primary flex items-center gap-1">
                      <Icon name="GraduationCap" size={12} /> {s.course}
                    </div>
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
    </div>
  );
};

export default Funnel;
