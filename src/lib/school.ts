export const SCHOOL = {
  name: 'Хакни Нейросети',
  legalName: 'Школа искусственного интеллекта «Хакни Нейросети»',
  alternateName: ['Хакни Нейросети Владивосток', 'Школа нейросетей Владивосток', 'ChernikovGPT'],
  url: 'https://chernikovgpt.ru',
  logo: 'https://chernikovgpt.ru/site/logo.jpg',
  description:
    '«Хакни Нейросети» — школа практического обучения искусственному интеллекту и нейросетям во Владивостоке. Предприниматели, специалисты, фрилансеры и сотрудники компаний осваивают ChatGPT, ИИ-агентов, генерацию изображений и видео, создание сайтов, маркетинг и автоматизацию бизнес-процессов в живом классе.',
  foundingDate: '2022',
  address: {
    street: 'ул. Русская, 41а, 3 этаж',
    city: 'Владивосток',
    region: 'Приморский край',
    country: 'RU',
    postalCode: '690105',
    full: 'Владивосток, ул. Русская, 41а, 3 этаж',
    lat: 43.1656,
    lon: 131.9216,
  },
  telegram: 'https://t.me/chernikovpsiholog',
  telegramBot: 'https://t.me/ChernikovGPT_Bot',
  hours: 'Пн–Сб 10:00–20:00',
  sameAs: [
    'https://t.me/chernikovpsiholog',
    'https://vk.com/chernikovgpt',
    'https://2gis.ru/vladivostok/search/Хакни%20Нейросети',
  ],
} as const;

export const FOUNDER = {
  name: 'Сергей Черников',
  jobTitle: 'Основатель и преподаватель школы «Хакни Нейросети», эксперт по искусственному интеллекту',
  image: 'https://chernikovgpt.ru/site/speaker.jpg',
  url: 'https://chernikovgpt.ru/sergey-chernikov',
  description:
    'Сергей Черников — предприниматель, эксперт по практическому применению искусственного интеллекта, основатель школы «Хакни Нейросети» во Владивостоке. С 2018 года обучил более 10 000 человек, ведёт корпоративные программы по внедрению ИИ в бизнес.',
  knowsAbout: [
    'Искусственный интеллект',
    'Нейросети',
    'ChatGPT',
    'ИИ-агенты',
    'Промпт-инжиниринг',
    'Автоматизация бизнеса',
    'ИИ в маркетинге',
    'Генерация изображений и видео нейросетями',
  ],
} as const;

export const FACTS = {
  students: 10000,
  rating: 4.9,
  applyRate: 94,
  completionRate: 90,
  hours: 72,
  months: 3,
  groupSize: 30,
  recordsMonths: 6,
  modules: 24,
  priceFrom: 150000,
  installmentFrom: 12500,
} as const;

export interface Stream {
  id: string;
  flow: string;
  date: string;
  dateLabel: string;
  iso: string;
  schedule: string;
  scheduleLong: string;
}

export const STREAMS: Stream[] = [
  {
    id: 'dec-1',
    flow: 'ПОТОК 1',
    date: '07.12',
    dateLabel: '7 декабря 2026',
    iso: '2026-12-07T17:00:00+10:00',
    schedule: 'ПОНЕДЕЛЬНИК + ЧЕТВЕРГ · 17:00–20:00',
    scheduleLong: 'Понедельник и четверг, с 17:00 до 20:00',
  },
  {
    id: 'dec-2',
    flow: 'ПОТОК 2',
    date: '09.12',
    dateLabel: '9 декабря 2026',
    iso: '2026-12-09T17:00:00+10:00',
    schedule: 'ЧТ 17:00–20:00 · СБ 09:00–12:00',
    scheduleLong: 'Четверг с 17:00 до 20:00 и суббота с 09:00 до 12:00',
  },
];

export const SALES_OPEN = false;

export const getNextStream = (): Stream | null => {
  const now = Date.now();
  const upcoming = STREAMS.filter((s) => new Date(s.iso).getTime() > now);
  return upcoming.length ? upcoming[0] : null;
};

export const getStreamEndIso = (stream: Stream): string => {
  const d = new Date(stream.iso);
  d.setMonth(d.getMonth() + FACTS.months);
  return d.toISOString().slice(0, 10);
};

export const CTA_LABEL = SALES_OPEN ? 'Записаться на курс' : 'Оставить заявку на декабрь';
export const CTA_SHORT = SALES_OPEN ? 'Записаться' : 'Заявка на декабрь';
export const SEATS_LABEL = SALES_OPEN ? 'ИДЁТ НАБОР' : 'ПРОДАЖИ ЗАКРЫТЫ';
