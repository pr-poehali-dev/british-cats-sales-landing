import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { actions, STAGES, STATUSES, type Student, type StudentStatus, type FunnelStage } from '@/lib/crm-store';
import { fmtDate } from './ui-helpers';
import func2url from '../../../backend/func2url.json';

const NOTE_META: Record<string, { icon: string; color: string; label: string }> = {
  comment: { icon: 'MessageSquare', color: 'text-primary', label: 'Комментарий' },
  call: { icon: 'Phone', color: 'text-success', label: 'Звонок' },
  stage: { icon: 'GitBranch', color: 'text-neon', label: 'Этап' },
  transcript: { icon: 'FileAudio', color: 'text-accent', label: 'Расшифровка звонка' },
};

const fmtDateTime = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const StudentCard = ({ student }: { student: Student }) => {
  const [comment, setComment] = useState('');
  const [callText, setCallText] = useState('');
  const [recordUrl, setRecordUrl] = useState('');
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState('');

  const addComment = () => {
    if (!comment.trim()) return;
    actions.addNote(student.id, 'comment', comment.trim());
    setComment('');
  };

  const transcribe = async () => {
    if (!recordUrl.trim() || transcribing) return;
    setTranscribing(true);
    setError('');
    try {
      const res = await fetch(func2url.transcribe, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl: recordUrl.trim() }),
      });
      const json = await res.json();
      if (res.ok && json.transcript) {
        actions.addNote(student.id, 'transcript', json.transcript);
        setRecordUrl('');
      } else {
        setError(json.detail || json.error || 'Не удалось расшифровать');
      }
    } catch {
      setError('Ошибка соединения с сервером');
    } finally {
      setTranscribing(false);
    }
  };

  const logCall = () => {
    actions.addNote(student.id, 'call', callText.trim() || 'Состоялся звонок');
    actions.updateStudent(student.id, { lastCallAt: new Date().toISOString().slice(0, 10) });
    setCallText('');
  };

  const changeStage = (stage: FunnelStage) => {
    actions.updateStudent(student.id, { stage });
    actions.addNote(student.id, 'stage', `Этап изменён на «${stage}»`);
  };

  return (
    <div className="grid md:grid-cols-2 gap-5 md:gap-6 p-3 sm:p-5 bg-secondary/30 rounded-xl border border-border/60">
      {/* Левая колонка — управление */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Статус</label>
            <Select value={student.status} onValueChange={(v) => actions.updateStudent(student.id, { status: v as StudentStatus })}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Этап воронки</label>
            <Select value={student.stage} onValueChange={(v) => changeStage(v as FunnelStage)}>
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>{STAGES.map((x) => <SelectItem key={x} value={x}>{x}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Icon name="Contact" size={13} /> Контакты
          </div>
          <div className="relative">
            <Icon name="Send" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
            <Input placeholder="Telegram (@username)" value={student.contact || ''} onChange={(e) => actions.updateStudent(student.id, { contact: e.target.value })} className="h-9 pl-9" />
          </div>
          <div className="relative">
            <Icon name="Phone" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-success" />
            <Input placeholder="Телефон" value={student.phone || ''} onChange={(e) => actions.updateStudent(student.id, { phone: e.target.value })} className="h-9 pl-9" />
          </div>
          <div className="relative">
            <Icon name="Mail" size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-warning" />
            <Input type="email" placeholder="Почта" value={student.email || ''} onChange={(e) => actions.updateStudent(student.id, { email: e.target.value })} className="h-9 pl-9" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <Icon name="PhoneCall" size={12} /> Когда звонили
            </label>
            <Input type="date" value={student.lastCallAt || ''} onChange={(e) => actions.updateStudent(student.id, { lastCallAt: e.target.value })} className="h-9" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
              <Icon name="CalendarClock" size={12} /> Перезвонить
            </label>
            <Input type="date" value={student.nextCallAt || ''} onChange={(e) => actions.updateStudent(student.id, { nextCallAt: e.target.value })} className="h-9" />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Зафиксировать звонок</label>
          <div className="flex gap-2">
            <Input placeholder="Итог разговора" value={callText} onChange={(e) => setCallText(e.target.value)} className="h-9" onKeyDown={(e) => e.key === 'Enter' && logCall()} />
            <Button onClick={logCall} size="sm" variant="secondary" className="h-9 shrink-0">
              <Icon name="Phone" size={15} className="mr-1" /> Звонок
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-accent/25 bg-accent/5 p-3">
          <label className="text-xs text-accent mb-1.5 flex items-center gap-1.5">
            <Icon name="FileAudio" size={13} /> Расшифровка звонка (МегаФон + SpeechKit)
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Ссылка на запись разговора"
              value={recordUrl}
              onChange={(e) => setRecordUrl(e.target.value)}
              className="h-9"
              onKeyDown={(e) => e.key === 'Enter' && transcribe()}
            />
            <Button onClick={transcribe} disabled={transcribing || !recordUrl.trim()} size="sm" className="h-9 shrink-0 bg-accent hover:bg-accent/90 text-accent-foreground">
              {transcribing
                ? <Icon name="Loader2" size={15} className="animate-spin" />
                : <><Icon name="AudioLines" size={15} className="mr-1" /> Расшифровать</>}
            </Button>
          </div>
          {error && <div className="text-xs text-destructive mt-2 flex items-start gap-1"><Icon name="TriangleAlert" size={12} className="mt-0.5 shrink-0" /> {error}</div>}
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1.5 block">Комментарий</label>
          <Textarea placeholder="Напишите заметку..." value={comment} onChange={(e) => setComment(e.target.value)} rows={2} />
          <Button onClick={addComment} size="sm" className="mt-2 bg-primary hover:bg-primary/90">
            <Icon name="Plus" size={15} className="mr-1" /> Добавить
          </Button>
        </div>
      </div>

      {/* Правая колонка — история */}
      <div>
        <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
          <Icon name="History" size={13} /> История активности
        </div>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {student.comment && (
            <div className="glass rounded-lg p-3 text-sm">
              <div className="text-xs text-muted-foreground mb-1">Начальный комментарий</div>
              {student.comment}
            </div>
          )}
          {(student.notes || []).map((n) => {
            const m = NOTE_META[n.type];
            return (
              <div key={n.id} className="glass rounded-lg p-3 group">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs flex items-center gap-1.5 ${m.color}`}>
                    <Icon name={m.icon} size={13} /> {m.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{fmtDateTime(n.createdAt)}</span>
                    <button onClick={() => actions.deleteNote(student.id, n.id)} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100">
                      <Icon name="X" size={13} />
                    </button>
                  </div>
                </div>
                <div className="text-sm">{n.text}</div>
              </div>
            );
          })}
          {!student.comment && (student.notes || []).length === 0 && (
            <div className="text-center text-xs text-muted-foreground py-8">Пока нет записей. Добавьте комментарий или звонок.</div>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50 flex items-center gap-1.5">
          <Icon name="UserPlus" size={12} /> В базе с {fmtDate(student.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default StudentCard;