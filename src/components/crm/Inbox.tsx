import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDialogs, chatActions, CHANNEL_META, type Channel } from '@/lib/chat-store';
import { SectionHeader } from './ui-helpers';

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const today = new Date().toDateString() === d.toDateString();
  return today
    ? d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
};

const Inbox = () => {
  const dialogs = useDialogs();
  const [activeId, setActiveId] = useState<string | null>(dialogs[0]?.id ?? null);
  const [filter, setFilter] = useState<Channel | 'all'>('all');
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  const filtered = filter === 'all' ? dialogs : dialogs.filter((d) => d.channel === filter);
  const active = dialogs.find((d) => d.id === activeId) || null;
  const totalUnread = dialogs.reduce((s, d) => s + d.unread, 0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages.length, activeId]);

  const openDialog = (id: string) => {
    setActiveId(id);
    chatActions.markRead(id);
  };

  const send = () => {
    if (!text.trim() || !active) return;
    chatActions.sendMessage(active.id, text.trim());
    setText('');
  };

  return (
    <div>
      <SectionHeader
        title="Чаты"
        subtitle="Единое окно для всех мессенджеров — отвечайте клиентам из одного места"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} icon="Inbox" label={`Все${totalUnread ? ` · ${totalUnread}` : ''}`} />
        {(Object.keys(CHANNEL_META) as Channel[]).map((ch) => (
          <FilterChip key={ch} active={filter === ch} onClick={() => setFilter(ch)} icon={CHANNEL_META[ch].icon} label={CHANNEL_META[ch].label} />
        ))}
      </div>

      <div className="grid md:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-16rem)] min-h-[480px]">
        <div className="glass rounded-xl overflow-y-auto">
          {filtered.length === 0 && (
            <div className="p-6 text-center text-muted-foreground text-sm">Нет диалогов в этом канале</div>
          )}
          {filtered.map((d) => {
            const last = d.messages[d.messages.length - 1];
            const meta = CHANNEL_META[d.channel];
            return (
              <button
                key={d.id}
                onClick={() => openDialog(d.id)}
                className={`w-full text-left p-3 flex gap-3 border-b border-border/50 transition-colors ${
                  activeId === d.id ? 'bg-secondary/60' : 'hover:bg-secondary/30'
                }`}
              >
                <div className={`relative w-11 h-11 rounded-full flex items-center justify-center font-semibold shrink-0 ${d.avatarColor}`}>
                  {d.name.charAt(0)}
                  <span className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-card flex items-center justify-center">
                    <Icon name={meta.icon} size={11} className={meta.color} />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate">{d.name}</span>
                    <span className="text-[11px] text-muted-foreground shrink-0">{last ? fmtTime(last.at) : ''}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground truncate">{last?.text || 'Нет сообщений'}</span>
                    {d.unread > 0 && (
                      <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                        {d.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="glass rounded-xl flex flex-col overflow-hidden">
          {active ? (
            <>
              <div className="p-4 border-b border-border/60 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${active.avatarColor}`}>
                  {active.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{active.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Icon name={CHANNEL_META[active.channel].icon} size={12} className={CHANNEL_META[active.channel].color} />
                    {CHANNEL_META[active.channel].label} · {active.handle}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {active.messages.map((m) => (
                  <div key={m.id} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                        m.from === 'me'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-secondary text-foreground rounded-bl-sm'
                      }`}
                    >
                      <div>{m.text}</div>
                      <div className={`text-[10px] mt-1 ${m.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {fmtTime(m.at)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <div className="p-3 border-t border-border/60 flex gap-2">
                <Input
                  placeholder={`Ответить в ${CHANNEL_META[active.channel].label}...`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                  className="h-10"
                />
                <Button onClick={send} disabled={!text.trim()} className="h-10 shrink-0">
                  <Icon name="Send" size={16} className="mr-1" /> Отправить
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Icon name="MessagesSquare" size={40} />
              <span className="text-sm">Выберите диалог слева</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterChip = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
      active ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary/50 text-muted-foreground border-border hover:bg-secondary'
    }`}
  >
    <Icon name={icon} size={13} /> {label}
  </button>
);

export default Inbox;
