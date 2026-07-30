import Reveal from './Reveal';

const INC = [
  { b: 'от 60 000 ₽', h: 'ИИ-копирайтер', p: 'Тексты, сценарии, контент-планы для бизнеса — на фрилансе или в найме.' },
  { b: 'от 80 000 ₽', h: 'ИИ-дизайнер', p: 'Визуал, карточки, презентации и фирменные стили на заказ.' },
  { b: 'от 100 000 ₽', h: 'ИИ-видеограф', p: 'Рекламные ролики и клипы — самая дорогая услуга из тройки.' },
];

const Income = () => {
  return (
    <section className="sec" id="income">
      <div className="wrap">
        <Reveal className="eyebrow">// 07 · ЗАРАБОТОК</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Сколько приносят<br />ИИ-навыки</Reveal>
        <div className="income">
          {INC.map((x, i) => (
            <Reveal key={x.h} className="inc" delay={i * 0.08}>
              <b>{x.b}</b>
              <h3>{x.h}</h3>
              <p>{x.p}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="payoff"><i />Один ИИ-проект стоит от 30 000 ₽ — курс окупается 1–2 заказами. У конкурентов аналогичные программы стоят от 70 000 до 460 000 ₽.</Reveal>
      </div>
    </section>
  );
};

export default Income;
