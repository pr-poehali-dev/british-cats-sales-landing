import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { useTheme, setTheme, THEMES } from '@/lib/theme';
import { useDialogs } from '@/lib/chat-store';

export type Section = 'dashboard' | 'inbox' | 'tasks' | 'students' | 'funnel' | 'courses' | 'schedule' | 'finance';

const ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Дашборд', icon: 'LayoutDashboard' },
  { id: 'inbox', label: 'Чаты', icon: 'MessagesSquare' },
  { id: 'tasks', label: 'Задачи', icon: 'ListChecks' },
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
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem = ITEMS.find((i) => i.id === active);

  const handleSelect = (s: Section) => {
    onChange(s);
    setMobileOpen(false);
  };

  const panel = (
    <div className="flex flex-col h-full">
      <div className="p-5 md:p-6 flex items-center gap-3 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center neon-glow shrink-0">
          <Icon name="BrainCircuit" className="text-white" size={22} />
        </div>
        <div className="min-w-0">
          <div className="font-display font-bold text-lg leading-tight neon-text truncate">Khakni Neuro</div>
          <div className="text-xs text-muted-foreground truncate">CRM онлайн-школы</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
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
          <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-semibold shrink-0">
            А
          </div>
          <div className="text-sm min-w-0">
            <div className="font-medium truncate">Администратор</div>
            <div className="text-xs text-muted-foreground truncate">admin@khakni.ai</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Мобильная верхняя панель с бургером */}
      <header className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 bg-sidebar border-b border-sidebar-border">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent shrink-0"
          aria-label="Меню"
        >
          <Icon name="Menu" size={22} />
          {unread > 0 && <span className="absolute top-2 left-8 w-2 h-2 rounded-full bg-primary" />}
        </button>
        <div className="flex items-center gap-2 min-w-0">
          {activeItem && <Icon name={activeItem.icon} size={18} className="text-primary shrink-0" />}
          <span className="font-display font-semibold truncate">{activeItem?.label || 'Khakni Neuro'}</span>
        </div>
      </header>

      {/* Десктопный сайдбар */}
      <aside className="hidden md:flex w-64 shrink-0 bg-sidebar border-r border-sidebar-border flex-col h-screen sticky top-0">
        {panel}
      </aside>

      {/* Мобильный drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-[82vw] max-w-[300px] bg-sidebar border-r border-sidebar-border h-full animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent z-10"
              aria-label="Закрыть"
            >
              <Icon name="X" size={20} />
            </button>
            {panel}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
