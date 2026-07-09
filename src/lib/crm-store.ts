import { useSyncExternalStore } from 'react';

export type Source = 'Instagram' | 'Telegram' | 'Реклама' | 'Реферал';
export type StudentStatus = 'Лид' | 'Оплатил' | 'Учится' | 'Завершил' | 'Отказ';
export type FunnelStage =
  | 'Новый лид'
  | 'Квалифицирован'
  | 'КП отправлено'
  | 'Счёт выставлен'
  | 'Оплата получена'
  | 'Обучается';
export type PaymentStatus = 'Ожидает' | 'Получена';

export interface Student {
  id: string;
  name: string;
  contact: string;
  source: Source;
  course: string;
  status: StudentStatus;
  stage: FunnelStage;
  createdAt: string;
  comment: string;
}

export interface Course {
  id: string;
  title: string;
  price: number;
  startDate: string;
  seats: number;
}

export interface Lesson {
  id: string;
  course: string;
  group: string;
  topic: string;
  date: string;
  time: string;
}

export interface Payment {
  id: string;
  studentId: string;
  course: string;
  amount: number;
  date: string;
  status: PaymentStatus;
}

export interface CRMData {
  students: Student[];
  courses: Course[];
  lessons: Lesson[];
  payments: Payment[];
}

export const SOURCES: Source[] = ['Instagram', 'Telegram', 'Реклама', 'Реферал'];
export const STATUSES: StudentStatus[] = ['Лид', 'Оплатил', 'Учится', 'Завершил', 'Отказ'];
export const STAGES: FunnelStage[] = [
  'Новый лид',
  'Квалифицирован',
  'КП отправлено',
  'Счёт выставлен',
  'Оплата получена',
  'Обучается',
];

const uid = () => Math.random().toString(36).slice(2, 10);

const seed: CRMData = {
  courses: [
    { id: 'c1', title: 'AI-старт: нейросети с нуля', price: 29000, startDate: '2026-08-01', seats: 30 },
    { id: 'c2', title: 'Промпт-инжиниринг PRO', price: 45000, startDate: '2026-08-15', seats: 20 },
    { id: 'c3', title: 'ИИ для бизнеса', price: 68000, startDate: '2026-09-01', seats: 15 },
  ],
  students: [
    { id: 's1', name: 'Алина Хакимова', contact: '@alina_h', source: 'Instagram', course: 'AI-старт: нейросети с нуля', status: 'Учится', stage: 'Обучается', createdAt: '2026-06-12', comment: 'Активная, платит вовремя' },
    { id: 's2', name: 'Дмитрий Орлов', contact: '+7 900 111-22-33', source: 'Telegram', course: 'Промпт-инжиниринг PRO', status: 'Оплатил', stage: 'Оплата получена', createdAt: '2026-06-20', comment: 'Ждёт старт группы' },
    { id: 's3', name: 'Марина Львова', contact: '@marina_lv', source: 'Реклама', course: 'ИИ для бизнеса', status: 'Лид', stage: 'КП отправлено', createdAt: '2026-07-01', comment: 'Думает, перезвонить' },
    { id: 's4', name: 'Игорь Соколов', contact: '+7 921 555-77-88', source: 'Реферал', course: 'AI-старт: нейросети с нуля', status: 'Завершил', stage: 'Обучается', createdAt: '2026-04-05', comment: 'Хочет продвинутый курс' },
    { id: 's5', name: 'Ольга Ким', contact: '@olga_kim', source: 'Instagram', course: 'Промпт-инжиниринг PRO', status: 'Лид', stage: 'Новый лид', createdAt: '2026-07-05', comment: '' },
    { id: 's6', name: 'Артём Белов', contact: '@artem_b', source: 'Telegram', course: 'ИИ для бизнеса', status: 'Лид', stage: 'Квалифицирован', createdAt: '2026-07-07', comment: 'Заинтересован, бюджет есть' },
    { id: 's7', name: 'Ксения Романова', contact: '+7 903 222-33-44', source: 'Реклама', course: 'AI-старт: нейросети с нуля', status: 'Оплатил', stage: 'Счёт выставлен', createdAt: '2026-07-02', comment: 'Выставлен счёт' },
    { id: 's8', name: 'Павел Гусев', contact: '@pavel_g', source: 'Реферал', course: 'ИИ для бизнеса', status: 'Отказ', stage: 'Новый лид', createdAt: '2026-06-28', comment: 'Дорого' },
  ],
  lessons: [
    { id: 'l1', course: 'AI-старт: нейросети с нуля', group: 'Группа A-1', topic: 'Введение в нейросети', date: '2026-08-01', time: '19:00' },
    { id: 'l2', course: 'AI-старт: нейросети с нуля', group: 'Группа A-1', topic: 'Генерация изображений', date: '2026-08-04', time: '19:00' },
    { id: 'l3', course: 'Промпт-инжиниринг PRO', group: 'Группа P-1', topic: 'Основы промптинга', date: '2026-08-15', time: '20:00' },
    { id: 'l4', course: 'ИИ для бизнеса', group: 'Группа B-1', topic: 'Автоматизация процессов', date: '2026-09-01', time: '18:30' },
  ],
  payments: [
    { id: 'p1', studentId: 's1', course: 'AI-старт: нейросети с нуля', amount: 29000, date: '2026-06-12', status: 'Получена' },
    { id: 'p2', studentId: 's2', course: 'Промпт-инжиниринг PRO', amount: 45000, date: '2026-06-20', status: 'Получена' },
    { id: 'p3', studentId: 's4', course: 'AI-старт: нейросети с нуля', amount: 29000, date: '2026-04-05', status: 'Получена' },
    { id: 'p4', studentId: 's7', course: 'AI-старт: нейросети с нуля', amount: 29000, date: '2026-07-02', status: 'Ожидает' },
  ],
};

const KEY = 'khakni-crm-v1';

function load(): CRMData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* noop */
  }
  return seed;
}

let data: CRMData = load();
const listeners = new Set<() => void>();

function persist() {
  localStorage.setItem(KEY, JSON.stringify(data));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useCRM() {
  return useSyncExternalStore(subscribe, () => data);
}

export const actions = {
  addStudent(s: Omit<Student, 'id' | 'createdAt'>) {
    data = { ...data, students: [{ ...s, id: uid(), createdAt: new Date().toISOString().slice(0, 10) }, ...data.students] };
    persist();
  },
  updateStudent(id: string, patch: Partial<Student>) {
    data = { ...data, students: data.students.map((s) => (s.id === id ? { ...s, ...patch } : s)) };
    persist();
  },
  deleteStudent(id: string) {
    data = { ...data, students: data.students.filter((s) => s.id !== id) };
    persist();
  },
  setStage(id: string, stage: FunnelStage) {
    data = { ...data, students: data.students.map((s) => (s.id === id ? { ...s, stage } : s)) };
    persist();
  },
  addCourse(c: Omit<Course, 'id'>) {
    data = { ...data, courses: [...data.courses, { ...c, id: uid() }] };
    persist();
  },
  updateCourse(id: string, patch: Partial<Course>) {
    data = { ...data, courses: data.courses.map((c) => (c.id === id ? { ...c, ...patch } : c)) };
    persist();
  },
  deleteCourse(id: string) {
    data = { ...data, courses: data.courses.filter((c) => c.id !== id) };
    persist();
  },
  addLesson(l: Omit<Lesson, 'id'>) {
    data = { ...data, lessons: [...data.lessons, { ...l, id: uid() }] };
    persist();
  },
  deleteLesson(id: string) {
    data = { ...data, lessons: data.lessons.filter((l) => l.id !== id) };
    persist();
  },
  addPayment(p: Omit<Payment, 'id'>) {
    data = { ...data, payments: [{ ...p, id: uid() }, ...data.payments] };
    persist();
  },
  togglePayment(id: string) {
    data = {
      ...data,
      payments: data.payments.map((p) =>
        p.id === id ? { ...p, status: p.status === 'Получена' ? 'Ожидает' : 'Получена' } : p
      ),
    };
    persist();
  },
  deletePayment(id: string) {
    data = { ...data, payments: data.payments.filter((p) => p.id !== id) };
    persist();
  },
};
