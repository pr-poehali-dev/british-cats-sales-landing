import { useSyncExternalStore } from 'react';

export type Channel = 'telegram' | 'max' | 'vk' | 'whatsapp' | 'instagram' | 'web';

export const CHANNEL_META: Record<Channel, { label: string; icon: string; color: string }> = {
  telegram: { label: 'Telegram', icon: 'Send', color: 'text-sky-400' },
  max: { label: 'MAX', icon: 'MessageSquareText', color: 'text-violet-400' },
  vk: { label: 'ВКонтакте', icon: 'Users', color: 'text-blue-400' },
  whatsapp: { label: 'WhatsApp', icon: 'MessageCircle', color: 'text-green-400' },
  instagram: { label: 'Instagram', icon: 'Instagram', color: 'text-pink-400' },
  web: { label: 'Сайт', icon: 'Globe', color: 'text-primary' },
};

export interface ChatMessage {
  id: string;
  from: 'client' | 'me';
  text: string;
  at: string;
}

export interface Dialog {
  id: string;
  name: string;
  channel: Channel;
  handle: string;
  avatarColor: string;
  unread: number;
  messages: ChatMessage[];
}

const uid = () => Math.random().toString(36).slice(2, 10);
const nowMinus = (min: number) => new Date(Date.now() - min * 60000).toISOString();

const seed: Dialog[] = [
  {
    id: 'd1', name: 'Анна Петрова', channel: 'telegram', handle: '@anna_p',
    avatarColor: 'bg-sky-500/25 text-sky-300', unread: 2,
    messages: [
      { id: uid(), from: 'client', text: 'Здравствуйте! Расскажите про курс по нейросетям', at: nowMinus(48) },
      { id: uid(), from: 'me', text: 'Добрый день! Конечно, старт 1 августа, длительность 8 недель', at: nowMinus(40) },
      { id: uid(), from: 'client', text: 'А есть рассрочка?', at: nowMinus(6) },
      { id: uid(), from: 'client', text: 'И сколько стоит?', at: nowMinus(5) },
    ],
  },
  {
    id: 'd2', name: 'Максим Ковалёв', channel: 'whatsapp', handle: '+7 900 555-33-11',
    avatarColor: 'bg-green-500/25 text-green-300', unread: 0,
    messages: [
      { id: uid(), from: 'client', text: 'Оплатил курс, когда пришлют доступ?', at: nowMinus(180) },
      { id: uid(), from: 'me', text: 'Спасибо! Доступ придёт на почту в течение часа', at: nowMinus(170) },
    ],
  },
  {
    id: 'd3', name: 'Елена Сидорова', channel: 'vk', handle: 'id2841902',
    avatarColor: 'bg-blue-500/25 text-blue-300', unread: 1,
    messages: [
      { id: uid(), from: 'client', text: 'Подскажите, будет ли запись занятий?', at: nowMinus(20) },
    ],
  },
  {
    id: 'd5', name: 'Ирина Волкова', channel: 'max', handle: '@irina_v',
    avatarColor: 'bg-violet-500/25 text-violet-300', unread: 2,
    messages: [
      { id: uid(), from: 'client', text: 'Добрый день! Увидела вас в MAX, интересует курс для бизнеса', at: nowMinus(15) },
      { id: uid(), from: 'client', text: 'Можно программу посмотреть?', at: nowMinus(14) },
    ],
  },
  {
    id: 'd4', name: 'Гость с сайта', channel: 'web', handle: 'посетитель #4821',
    avatarColor: 'bg-primary/25 text-primary', unread: 3,
    messages: [
      { id: uid(), from: 'client', text: 'Здравствуйте, вы работаете с юрлицами?', at: nowMinus(12) },
      { id: uid(), from: 'client', text: 'Нужен счёт для оплаты от компании', at: nowMinus(11) },
      { id: uid(), from: 'client', text: 'Это возможно?', at: nowMinus(10) },
    ],
  },
];

const KEY = 'khakni-chat-v2';
let dialogs: Dialog[] = load();
const listeners = new Set<() => void>();

function load(): Dialog[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* noop */
  }
  return seed;
}

function persist() {
  localStorage.setItem(KEY, JSON.stringify(dialogs));
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function useDialogs(): Dialog[] {
  return useSyncExternalStore(subscribe, () => dialogs, () => dialogs);
}

export const chatActions = {
  sendMessage(dialogId: string, text: string) {
    dialogs = dialogs.map((d) =>
      d.id === dialogId
        ? { ...d, messages: [...d.messages, { id: uid(), from: 'me', text, at: new Date().toISOString() }] }
        : d
    );
    persist();
  },
  markRead(dialogId: string) {
    dialogs = dialogs.map((d) => (d.id === dialogId ? { ...d, unread: 0 } : d));
    persist();
  },
};