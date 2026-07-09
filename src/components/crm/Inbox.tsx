import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDialogs, chatActions, CHANNEL_META, type Channel, type ChatAttachment } from '@/lib/chat-store';
import { SectionHeader } from './ui-helpers';

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const today = new Date().toDateString() === d.toDateString();
  return today
    ? d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' });
};

const fmtSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} Б`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
};

const Inbox = () => {
  const dialogs = useDialogs();
  const [activeId, setActiveId] = useState<string | null>(dialogs[0]?.id ?? null);
  const [filter, setFilter] = useState<Channel | 'all'>('all');
  const [text, setText] = useState('');
  const [pending, setPending] = useState<ChatAttachment | null>(null);
  const [fileError, setFileError] = useState('');
  const [mobileChat, setMobileChat] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = filter === 'all' ? dialogs : dialogs.filter((d) => d.channel === filter);
  const active = dialogs.find((d) => d.id === activeId) || null;
  const totalUnread = dialogs.reduce((s, d) => s + d.unread, 0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages.length, activeId]);

  const openDialog = (id: string) => {
    setActiveId(id);
    setMobileChat(true);
    chatActions.markRead(id);
    setPending(null);
    setFileError('');
  };

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError('');
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`Файл больше 5 МБ (${fmtSize(file.size)})`);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPending({ name: file.name, size: file.size, type: file.type, dataUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const send = () => {
    if ((!text.trim() && !pending) || !active) return;
    chatActions.sendMessage(active.id, text.trim(), pending ?? undefined);
    setText('');
    setPending(null);
    setFileError('');
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

      <div className="grid md:grid-cols-[320px_1fr] gap-4 h-[calc(100vh-13rem)] md:h-[calc(100vh-16rem)] min-h-[420px]">
        <div className={`glass rounded-xl overflow-y-auto ${mobileChat ? 'hidden md:block' : 'block'}`}>
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

        <div className={`glass rounded-xl flex-col overflow-hidden ${mobileChat ? 'flex' : 'hidden md:flex'}`}>
          {active ? (
            <>
              <div className="p-3 md:p-4 border-b border-border/60 flex items-center gap-3">
                <button
                  onClick={() => setMobileChat(false)}
                  className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary shrink-0"
                  aria-label="Назад"
                >
                  <Icon name="ArrowLeft" size={20} />
                </button>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold shrink-0 ${active.avatarColor}`}>
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
                      {m.attachment && (
                        m.attachment.type.startsWith('image/') ? (
                          <a href={m.attachment.dataUrl} download={m.attachment.name} target="_blank" rel="noreferrer" className="block mb-1.5">
                            <img src={m.attachment.dataUrl} alt={m.attachment.name} className="rounded-lg max-h-52 object-cover" />
                          </a>
                        ) : (
                          <a
                            href={m.attachment.dataUrl}
                            download={m.attachment.name}
                            className={`flex items-center gap-2 mb-1.5 p-2 rounded-lg ${m.from === 'me' ? 'bg-primary-foreground/15' : 'bg-background/60'}`}
                          >
                            <Icon name="File" size={22} />
                            <span className="min-w-0">
                              <span className="block truncate max-w-[180px]">{m.attachment.name}</span>
                              <span className="block text-[10px] opacity-70">{fmtSize(m.attachment.size)}</span>
                            </span>
                            <Icon name="Download" size={15} className="ml-1 shrink-0" />
                          </a>
                        )
                      )}
                      {m.text && <div>{m.text}</div>}
                      <div className={`text-[10px] mt-1 ${m.from === 'me' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {fmtTime(m.at)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <div className="p-3 border-t border-border/60">
                {pending && (
                  <div className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-secondary/60 text-sm">
                    {pending.type.startsWith('image/')
                      ? <img src={pending.dataUrl} alt={pending.name} className="w-9 h-9 rounded object-cover" />
                      : <Icon name="File" size={20} className="text-primary" />}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{pending.name}</span>
                      <span className="block text-[11px] text-muted-foreground">{fmtSize(pending.size)}</span>
                    </span>
                    <button onClick={() => setPending(null)} className="text-muted-foreground hover:text-destructive shrink-0">
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                )}
                {fileError && (
                  <div className="text-xs text-destructive mb-2 flex items-center gap-1">
                    <Icon name="TriangleAlert" size={12} /> {fileError}
                  </div>
                )}
                <div className="flex gap-2">
                  <input ref={fileRef} type="file" className="hidden" onChange={pickFile} />
                  <Button
                    variant="secondary"
                    onClick={() => fileRef.current?.click()}
                    className="h-10 w-10 p-0 shrink-0"
                    title="Прикрепить файл (до 5 МБ)"
                  >
                    <Icon name="Paperclip" size={18} />
                  </Button>
                  <Input
                    placeholder={`Ответить в ${CHANNEL_META[active.channel].label}...`}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                    className="h-10"
                  />
                  <Button onClick={send} disabled={!text.trim() && !pending} className="h-10 shrink-0">
                    <Icon name="Send" size={16} className="mr-1" /> Отправить
                  </Button>
                </div>
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