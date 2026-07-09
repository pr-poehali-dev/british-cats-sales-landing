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

export interface ActivityNote {
  id: string;
  type: 'comment' | 'call' | 'stage';
  text: string;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  contact: string;
  phone?: string;
  email?: string;
  source: Source;
  course: string;
  status: StudentStatus;
  stage: FunnelStage;
  createdAt: string;
  comment: string;
  lastCallAt?: string;
  nextCallAt?: string;
  notes?: ActivityNote[];
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
    { id: 's1', name: 'Алина Хакимова', contact: '@alina_h', phone: '+7 900 100-10-11', email: 'alina@mail.ru', source: 'Instagram', course: 'AI-старт: нейросети с нуля', status: 'Учится', stage: 'Обучается', createdAt: '2026-06-12', comment: 'Активная, платит вовремя' },
    { id: 's2', name: 'Дмитрий Орлов', contact: '@dmitry_o', phone: '+7 900 111-22-33', email: 'orlov.d@gmail.com', source: 'Telegram', course: 'Промпт-инжиниринг PRO', status: 'Оплатил', stage: 'Оплата получена', createdAt: '2026-06-20', comment: 'Ждёт старт группы' },
    { id: 's3', name: 'Марина Львова', contact: '@marina_lv', phone: '+7 905 333-44-55', email: 'marina.lv@yandex.ru', source: 'Реклама', course: 'ИИ для бизнеса', status: 'Лид', stage: 'КП отправлено', createdAt: '2026-07-01', comment: 'Думает, перезвонить' },
    { id: 's4', name: 'Игорь Соколов', contact: '@igor_s', phone: '+7 921 555-77-88', email: 'sokolov@mail.ru', source: 'Реферал', course: 'AI-старт: нейросети с нуля', status: 'Завершил', stage: 'Обучается', createdAt: '2026-04-05', comment: 'Хочет продвинутый курс' },
    { id: 's5', name: 'Ольга Ким', contact: '@olga_kim', phone: '+7 926 777-88-99', email: 'olga.kim@gmail.com', source: 'Instagram', course: 'Промпт-инжиниринг PRO', status: 'Лид', stage: 'Новый лид', createdAt: '2026-07-05', comment: '' },
    { id: 's6', name: 'Артём Белов', contact: '@artem_b', phone: '+7 903 121-31-41', email: 'belov.a@yandex.ru', source: 'Telegram', course: 'ИИ для бизнеса', status: 'Лид', stage: 'Квалифицирован', createdAt: '2026-07-07', comment: 'Заинтересован, бюджет есть' },
    { id: 's7', name: 'Ксения Романова', contact: '@ksenia_r', phone: '+7 903 222-33-44', email: 'romanova@mail.ru', source: 'Реклама', course: 'AI-старт: нейросети с нуля', status: 'Оплатил', stage: 'Счёт выставлен', createdAt: '2026-07-02', comment: 'Выставлен счёт' },
    { id: 's8', name: 'Павел Гусев', contact: '@pavel_g', phone: '+7 911 909-80-70', email: 'gusev.p@gmail.com', source: 'Реферал', course: 'ИИ для бизнеса', status: 'Отказ', stage: 'Новый лид', createdAt: '2026-06-28', comment: 'Дорого' },
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

const KEY = 'khakni-crm-v3';

function normalize(d: CRMData): CRMData {
  return {
    ...d,
    students: d.students.map((s) => ({ ...s, notes: Array.isArray(s.notes) ? s.notes : [] })),
  };
}

function load(): CRMData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return normalize(JSON.parse(raw));
  } catch {
    /* noop */
  }
  return normalize(seed);
}

let data: CRMData = load();
const listeners = new Set<() => void>();

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

export function useCRM() {
  return useSyncExternalStore(subscribe, () => data);
}

export const actions = {
  addStudent(s: Omit<Student, 'id' | 'createdAt' | 'notes'>) {
    data = { ...data, students: [{ ...s, id: uid(), createdAt: new Date().toISOString().slice(0, 10), notes: [] }, ...data.students] };
    persist();
  },
  addNote(id: string, type: ActivityNote['type'], text: string) {
    const note: ActivityNote = { id: uid(), type, text, createdAt: new Date().toISOString() };
    data = {
      ...data,
      students: data.students.map((s) => (s.id === id ? { ...s, notes: [note, ...(s.notes || [])] } : s)),
    };
    persist();
  },
  deleteNote(studentId: string, noteId: string) {
    data = {
      ...data,
      students: data.students.map((s) =>
        s.id === studentId ? { ...s, notes: (s.notes || []).filter((n) => n.id !== noteId) } : s
      ),
    };
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