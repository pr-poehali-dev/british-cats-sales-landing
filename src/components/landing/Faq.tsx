import { useRef, useState } from 'react';
import Reveal from './Reveal';

const QA = [
  { q: 'Нужен ли опыт в IT или программировании?', a: 'Нет. 90% студентов приходят с нуля. Программа построена от базовых понятий, а кураторы помогают на каждом занятии — застрять не получится.' },
  { q: 'Нужен ли VPN для нейросетей?', a: 'Только для зарубежных сервисов (ChatGPT, Claude, Nano Banana). Бесплатного VPN достаточно — покажем, какой выбрать и как настроить, на первом занятии. Российские инструменты (GigaChat, Kandinsky, Яндекс) работают напрямую.' },
  { q: 'Можно ли оплатить в рассрочку или кредит?', a: 'Да. Рассрочка от 12 500 ₽/мес, кредит на 3, 6 или 12 месяцев. Юридические лица оплачивают по реквизитам с договором и закрывающими документами.' },
  { q: 'Что если я пропущу занятие?', a: 'Записи всех занятий доступны 6 месяцев (можно продлить). Плюс кураторы помогут наверстать материал в чате потока.' },
  { q: 'Вы точно научите зарабатывать?', a: 'Мы даём рабочие инструменты и разбираем модели заработка: услуги, фриланс, внедрение в бизнес. Один ИИ-проект стоит от 30 000 ₽ — при выполнении заданий курс окупается 1–2 заказами. 94% выпускников применяют ИИ в работе уже через месяц.' },
  { q: 'Есть обучение для компаний?', a: 'Да, проводим корпоративное обучение для компаний Владивостока и Приморья. Напишите нам в Telegram — соберём программу под вашу команду.' },
];

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-q" onClick={() => setOpen((o) => !o)}>
        {q}<span className="ic">+</span>
      </button>
      <div className="faq-a" ref={ref} style={{ maxHeight: open ? ref.current?.scrollHeight ?? 300 : 0 }}>
        <p>{a}</p>
      </div>
    </div>
  );
};

const Faq = () => {
  return (
    <section className="sec" id="faq" style={{ background: 'var(--deep)' }}>
      <div className="wrap">
        <Reveal className="eyebrow">// 12 · ВОПРОСЫ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Частые вопросы</Reveal>
        <Reveal className="faq">
          {QA.map((x) => <FaqItem key={x.q} {...x} />)}
        </Reveal>
      </div>
    </section>
  );
};

export default Faq;
