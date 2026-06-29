import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const NAV = [
  { id: 'home', label: 'Главная' },
  { id: 'kittens', label: 'Котята' },
  { id: 'gallery', label: 'Галерея' },
  { id: 'services', label: 'Услуги' },
  { id: 'guarantee', label: 'Гарантии' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'delivery', label: 'Доставка' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contacts', label: 'Контакты' },
];

const KITTENS = [
  {
    name: 'Аврелий',
    breed: 'Британская короткошёрстная',
    color: 'Серебристо-голубой',
    price: '95 000 ₽',
    img: 'https://cdn.poehali.dev/projects/d3e635a0-73f6-4725-9cb9-7faeace376fe/files/d64266c4-7e0a-4511-8b1c-7dc8efe1b0a2.jpg',
  },
  {
    name: 'Голди',
    breed: 'Британская длинношёрстная',
    color: 'Золотистый шиншилла',
    price: '120 000 ₽',
    img: 'https://cdn.poehali.dev/projects/d3e635a0-73f6-4725-9cb9-7faeace376fe/files/2f344785-8790-47cb-8295-fcb6feb3e59b.jpg',
  },
  {
    name: 'Лилиан',
    breed: 'Британская короткошёрстная',
    color: 'Лиловый',
    price: '110 000 ₽',
    img: 'https://cdn.poehali.dev/projects/d3e635a0-73f6-4725-9cb9-7faeace376fe/files/417032b3-de30-4723-8783-ad9007a48dcb.jpg',
  },
];

const GALLERY = [
  'https://cdn.poehali.dev/projects/d3e635a0-73f6-4725-9cb9-7faeace376fe/files/d64266c4-7e0a-4511-8b1c-7dc8efe1b0a2.jpg',
  'https://cdn.poehali.dev/projects/d3e635a0-73f6-4725-9cb9-7faeace376fe/files/2f344785-8790-47cb-8295-fcb6feb3e59b.jpg',
  'https://cdn.poehali.dev/projects/d3e635a0-73f6-4725-9cb9-7faeace376fe/files/417032b3-de30-4723-8783-ad9007a48dcb.jpg',
];

const SERVICES = [
  { icon: 'FileBadge', title: 'Родословная', text: 'Полный пакет документов WCF и метрика котёнка.' },
  { icon: 'Syringe', title: 'Вакцинация', text: 'Все прививки по возрасту и ветеринарный паспорт.' },
  { icon: 'GraduationCap', title: 'Сопровождение', text: 'Пожизненные консультации по содержанию и уходу.' },
  { icon: 'Scissors', title: 'Груминг', text: 'Подготовка котёнка и рекомендации по грумингу.' },
];

const GUARANTEES = [
  { icon: 'HeartPulse', title: 'Гарантия здоровья', text: 'Каждый котёнок проходит полное обследование и тесты на генетические заболевания. Гарантия здоровья 1 год.' },
  { icon: 'ShieldCheck', title: 'Ветпаспорт и тесты', text: 'Отрицательные тесты на FIV, FeLV и PKD. Все прививки сделаны вовремя.' },
  { icon: 'RotateCcw', title: 'Условия возврата', text: 'Возврат в течение 14 дней, если котёнок не подошёл. При выявлении скрытых заболеваний — замена или возврат средств.' },
];

const REVIEWS = [
  { name: 'Екатерина М.', text: 'Привезли Голди из этого питомника — здоровый, ласковый, с полным пакетом документов. Заводчики на связи до сих пор!', rating: 5 },
  { name: 'Андрей В.', text: 'Премиальный сервис от и до. Помогли с адаптацией, всё прозрачно по здоровью и родословной.', rating: 5 },
  { name: 'Ольга и Дмитрий', text: 'Долго выбирали питомник и не пожалели. Котёнок — настоящий аристократ, как и обещали.', rating: 5 },
];

const FAQ = [
  { q: 'В каком возрасте можно забрать котёнка?', a: 'Котята переезжают в новый дом в возрасте от 3 месяцев — после полной вакцинации и социализации.' },
  { q: 'Входят ли документы в стоимость?', a: 'Да. В стоимость входят метрика, ветпаспорт, договор и стартовый набор корма.' },
  { q: 'Можно ли забронировать котёнка?', a: 'Да, бронь оформляется по предоплате 30%. Котёнок ждёт вас до готовности к переезду.' },
  { q: 'Помогаете ли с доставкой в другой город?', a: 'Да, организуем безопасную доставку по всей России и в страны СНГ.' },
];

function Section({ id, kicker, title, children }: { id: string; kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-24">
      <div className="container">
        <div className="text-center mb-14">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">{kicker}</p>
          <h2 className="font-display text-4xl md:text-5xl">{title}</h2>
          <div className="w-24 h-px gold-line mx-auto mt-5" />
        </div>
        {children}
      </div>
    </section>
  );
}

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground grain relative">
      <div className="paw-bg" />
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/80 border-b border-gold/15">
        <div className="container flex items-center justify-between h-20">
          <button onClick={() => scrollTo('home')} className="flex items-center gap-2">
            <Icon name="Crown" className="text-gold" size={26} />
            <span className="font-display text-2xl font-semibold tracking-wide text-gold-gradient">Royal Cats</span>
          </button>
          <nav className="hidden lg:flex items-center gap-7">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="text-sm text-muted-foreground hover:text-gold transition-colors">
                {n.label}
              </button>
            ))}
          </nav>
          <Button onClick={() => scrollTo('contacts')} className="hidden lg:inline-flex bg-gold text-primary-foreground hover:bg-gold/90 font-medium">
            Связаться
          </Button>
          <button className="lg:hidden text-gold" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'X' : 'Menu'} size={26} />
          </button>
        </div>
        {menuOpen && (
          <nav className="lg:hidden border-t border-gold/15 bg-background/95 animate-fade-in">
            <div className="container flex flex-col py-4">
              {NAV.map((n) => (
                <button key={n.id} onClick={() => scrollTo(n.id)} className="py-3 text-left text-muted-foreground hover:text-gold">
                  {n.label}
                </button>
              ))}
            </div>
          </nav>
        )}
      </header>

      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-gold/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] rounded-full bg-gold/5 blur-[140px]" />
        </div>
        <div className="container grid lg:grid-cols-2 gap-12 items-center py-16">
          <div className="animate-fade-in">
            <p className="flex items-center gap-2 text-gold text-sm tracking-[0.3em] uppercase mb-6">
              <span className="w-10 h-px gold-line" /> Элитный питомник
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.05] mb-6">
              Британские котята <span className="text-gold-gradient animate-shimmer">аристократической</span> крови
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mb-9">
              Породистые котята с безупречной родословной, гарантией здоровья и пожизненным сопровождением заводчика.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => scrollTo('kittens')} size="lg" className="bg-gold text-primary-foreground hover:bg-gold/90 font-medium">
                Выбрать котёнка
                <Icon name="ArrowRight" size={18} className="ml-1" />
              </Button>
              <Button onClick={() => scrollTo('guarantee')} size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
                Гарантии
              </Button>
            </div>
            <div className="flex gap-10 mt-12">
              {[['12', 'лет опыта'], ['400+', 'счастливых семей'], ['100%', 'здоровье']].map(([num, label]) => (
                <div key={label}>
                  <div className="font-display text-3xl text-gold">{num}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative animate-scale-in">
            <div className="absolute -inset-4 rounded-[2rem] border border-gold/20 animate-float" />
            <img src={KITTENS[0].img} alt="Британский котёнок" className="rounded-[1.5rem] w-full object-cover aspect-square shadow-2xl shadow-gold/10" />
          </div>
        </div>
      </section>

      <Section id="kittens" kicker="Доступны к бронированию" title="Наши котята">
        <div className="grid md:grid-cols-3 gap-8">
          {KITTENS.map((k) => (
            <div key={k.name} className="luxe-card rounded-2xl overflow-hidden group">
              <div className="overflow-hidden">
                <img src={k.img} alt={k.name} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-gold mb-1">{k.name}</h3>
                <p className="text-sm text-muted-foreground">{k.breed}</p>
                <p className="text-sm text-muted-foreground mb-4">Окрас: {k.color}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl text-foreground">{k.price}</span>
                  <Button size="sm" onClick={() => scrollTo('contacts')} className="bg-gold text-primary-foreground hover:bg-gold/90">
                    Забронировать
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="gallery" kicker="Портфолио" title="Галерея">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...GALLERY, ...GALLERY].map((src, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-gold/15 group">
              <img src={src} alt="Котёнок" className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
          ))}
        </div>
      </Section>

      <Section id="services" kicker="Премиум-сервис" title="Услуги питомника">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((s) => (
            <div key={s.title} className="luxe-card rounded-2xl p-7 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 border border-gold/30 mb-5">
                <Icon name={s.icon} className="text-gold" size={26} />
              </div>
              <h3 className="font-display text-xl text-gold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="guarantee" kicker="Спокойствие покупателя" title="Гарантии и возврат">
        <div className="grid md:grid-cols-3 gap-6">
          {GUARANTEES.map((g) => (
            <div key={g.title} className="luxe-card rounded-2xl p-8">
              <Icon name={g.icon} className="text-gold mb-5" size={32} />
              <h3 className="font-display text-2xl text-gold mb-3">{g.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{g.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="reviews" kicker="Нам доверяют" title="Отзывы владельцев">
        <div className="grid md:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <div key={r.name} className="luxe-card rounded-2xl p-7">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Icon key={i} name="Star" className="text-gold fill-gold" size={16} />
                ))}
              </div>
              <p className="text-muted-foreground italic mb-5">«{r.text}»</p>
              <p className="font-display text-lg text-gold">{r.name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="delivery" kicker="Бережно довезём" title="Доставка">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: 'MapPin', title: 'По городу', text: 'Личная передача котёнка курьером-зооняней в течение дня.' },
            { icon: 'Truck', title: 'По России', text: 'Доставка в любой регион с сопровождением и контролем температуры.' },
            { icon: 'Plane', title: 'В страны СНГ', text: 'Оформление всех документов и авиаперевозка в спецбоксе.' },
          ].map((d) => (
            <div key={d.title} className="luxe-card rounded-2xl p-8 text-center">
              <Icon name={d.icon} className="text-gold mx-auto mb-4" size={30} />
              <h3 className="font-display text-xl text-gold mb-2">{d.title}</h3>
              <p className="text-sm text-muted-foreground">{d.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="faq" kicker="Вопросы и ответы" title="FAQ">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-3">
            {FAQ.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="luxe-card rounded-xl px-6 border-none">
                <AccordionTrigger className="text-left font-display text-lg text-foreground hover:text-gold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      <section id="contacts" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-80 rounded-full bg-gold/8 blur-[120px]" />
        </div>
        <div className="container max-w-3xl text-center">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-4">Свяжитесь с нами</p>
          <h2 className="font-display text-4xl md:text-5xl mb-6">Подарите себе аристократа</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Оставьте заявку — расскажем о доступных котятах, поможем выбрать и ответим на все вопросы.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button size="lg" className="bg-gold text-primary-foreground hover:bg-gold/90">
              <Icon name="Phone" size={18} className="mr-1" /> +7 (900) 000-00-00
            </Button>
            <Button size="lg" variant="outline" className="border-gold/40 text-gold hover:bg-gold/10">
              <Icon name="Send" size={18} className="mr-1" /> Telegram
            </Button>
          </div>
          <div className="flex justify-center gap-6 text-muted-foreground">
            {['Instagram', 'Send', 'Mail'].map((ic) => (
              <button key={ic} className="w-11 h-11 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold/10 hover:text-gold transition-colors">
                <Icon name={ic} size={18} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-gold/15 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Icon name="Crown" className="text-gold" size={20} />
            <span className="font-display text-lg text-gold-gradient">Royal Cats</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Royal Cats. Питомник элитных британских котят.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;