import Icon from '@/components/ui/icon';
import { useTheme, setTheme, THEMES } from '@/lib/theme';
import { useDialogs } from '@/lib/chat-store';

export type Section = 'dashboard' | 'inbox' | 'students' | 'funnel' | 'courses' | 'schedule' | 'finance';

const ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Дашборд', icon: 'LayoutDashboard' },
  { id: 'inbox', label: 'Чаты', icon: 'MessagesSquare' },
  { id: 'students', label: 'Ученики', icon: 'Users' },
  { id: 'funnel', label: 'Воронка продаж', icon: 'Trello' },
  { id: 'courses', label: 'Курсы', icon: 'GraduationCap' },
  { id: 'schedule', label: 'Расписание', icon: 'CalendarDays' },
  { id: 'finance', label: 'Финансы', icon: 'Wallet' },
];

interface Props {
  active: Section;
  onChange: (s: Section) => void;
}

const Sidebar = ({ active, onChange }: Props) => {
  const theme = useTheme();
  const dialogs = useDialogs();
  const unread = dialogs.reduce((s, d) => s + d.unread, 0);
  return (
    <aside className="w-64 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center neon-glow">
          <Icon name="BrainCircuit" className="text-white" size={22} />
        </div>
        <div>
          <div className="font-display font-bold text-lg leading-tight neon-text">Khakni Neuro</div>
          <div className="text-xs text-muted-foreground">CRM онлайн-школы</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              active === item.id
                ? 'bg-primary text-primary-foreground neon-glow'
                : 'text-sidebar-foreground hover:bg-sidebar-accent'
            }`}
          >
            <Icon name={item.icon} size={19} />
            <span className="flex-1 text-left">{item.label}</span>
            {item.id === 'inbox' && unread > 0 && (
              <span className={`min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                active === item.id ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'
              }`}>
                {unread}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground px-1 mb-2 flex items-center gap-1.5">
          <Icon name="Paintbrush" size={12} /> Тема оформления
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.label}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg text-[11px] transition-all ${
                theme === t.id
                  ? 'bg-primary text-primary-foreground neon-glow'
                  : 'bg-sidebar-accent text-sidebar-foreground hover:bg-secondary'
              }`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-semibold">
            А
          </div>
          <div className="text-sm">
            <div className="font-medium">Администратор</div>
            <div className="text-xs text-muted-foreground">admin@khakni.ai</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;