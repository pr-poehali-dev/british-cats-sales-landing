import { useSyncExternalStore } from 'react';
import type { Channel } from './chat-store';

export type TaskStatus = 'new' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'normal' | 'high';

export const TASK_STATUS_META: Record<TaskStatus, { label: string; color: string }> = {
  new: { label: 'Новая', color: 'bg-warning/15 text-warning border-warning/30' },
  in_progress: { label: 'В работе', color: 'bg-primary/15 text-primary border-primary/30' },
  done: { label: 'Выполнена', color: 'bg-success/15 text-success border-success/30' },
};

export const TASK_PRIORITY_META: Record<TaskPriority, { label: string; color: string; icon: string }> = {
  low: { label: 'Низкий', color: 'text-muted-foreground', icon: 'ChevronDown' },
  normal: { label: 'Обычный', color: 'text-primary', icon: 'Minus' },
  high: { label: 'Срочный', color: 'text-destructive', icon: 'ChevronsUp' },
};

export interface Manager {
  id: string;
  name: string;
  role: string;
  channel: Channel;
  contact: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  managerId: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  sentAt?: string;
}

interface TasksData {
  managers: Manager[];
  tasks: Task[];
}

const uid = () => Math.random().toString(36).slice(2, 10);

const seed: TasksData = {
  managers: [
    { id: 'm1', name: 'Ольга Смирнова', role: 'Менеджер по продажам', channel: 'telegram', contact: '@olga_sales' },
    { id: 'm2', name: 'Дмитрий Козлов', role: 'Куратор курсов', channel: 'max', contact: '@dmitry_k' },
    { id: 'm3', name: 'Анна Мороз', role: 'Поддержка', channel: 'whatsapp', contact: '+7 900 222-11-00' },
  ],
  tasks: [
    { id: 't1', title: 'Перезвонить Марине Львовой', description: 'Уточнить решение по КП, предложить рассрочку', managerId: 'm1', priority: 'high', status: 'new', dueDate: '2026-07-10', createdAt: '2026-07-09' },
    { id: 't2', title: 'Проверить домашние задания группы A-1', description: 'Курс «AI-старт», проверить и дать обратную связь', managerId: 'm2', priority: 'normal', status: 'in_progress', dueDate: '2026-07-11', createdAt: '2026-07-08' },
    { id: 't3', title: 'Ответить на вопросы в поддержке', description: 'Разобрать очередь обращений за сегодня', managerId: 'm3', priority: 'normal', status: 'done', dueDate: '2026-07-09', createdAt: '2026-07-09', sentAt: '2026-07-09' },
  ],
};

const KEY = 'khakni-tasks-v1';
let data: TasksData = load();
const listeners = new Set<() => void>();

function load(): TasksData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* noop */
  }
  return seed;
}

function persist() {
  localStorage.setItem(KEY, JSON.stringify(data));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useTasksData(): TasksData {
  return useSyncExternalStore(subscribe, () => data, () => data);
}

export const tasksActions = {
  addManager(m: Omit<Manager, 'id'>) {
    data = { ...data, managers: [...data.managers, { ...m, id: uid() }] };
    persist();
  },
  updateManager(id: string, patch: Partial<Manager>) {
    data = { ...data, managers: data.managers.map((m) => (m.id === id ? { ...m, ...patch } : m)) };
    persist();
  },
  removeManager(id: string) {
    data = { ...data, managers: data.managers.filter((m) => m.id !== id) };
    persist();
  },
  addTask(t: Omit<Task, 'id' | 'createdAt' | 'status'>) {
    const task: Task = { ...t, id: uid(), createdAt: new Date().toISOString().slice(0, 10), status: 'new' };
    data = { ...data, tasks: [task, ...data.tasks] };
    persist();
    return task;
  },
  updateTask(id: string, patch: Partial<Task>) {
    data = { ...data, tasks: data.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) };
    persist();
  },
  removeTask(id: string) {
    data = { ...data, tasks: data.tasks.filter((t) => t.id !== id) };
    persist();
  },
  markSent(id: string) {
    data = { ...data, tasks: data.tasks.map((t) => (t.id === id ? { ...t, sentAt: new Date().toISOString() } : t)) };
    persist();
  },
};
