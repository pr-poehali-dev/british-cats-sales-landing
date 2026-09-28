import Reveal from './Reveal';
import Icon from '@/components/ui/icon';
import vitalyRymar from '@/assets/reviews/vitaly-rymar.jpg';
import alenaVinokurova from '@/assets/reviews/alena-vinokurova.jpg';
import marinaMorskaya from '@/assets/reviews/marina-morskaya.jpg';
import annaDubinets from '@/assets/reviews/anna-dubinets.jpg';

const REVIEWS_URL = 'https://2gis.ru/vladivostok/search/%D1%85%D0%B0%D0%BA%D0%BD%D0%B8%20%D0%BD%D0%B5%D0%B9%D1%80%D0%BE%D1%81%D0%B5%D1%82%D0%B8';

const CASES = [
  {
    photo: vitalyRymar,
    name: 'Виталий Рымарь',
    role: 'Выпускник',
    headline: 'Получил первые заказы во время обучения',
    start: 'Пришёл с минимальными знаниями о нейросетях.',
    did: 'Освоил генерацию визуала и видео, начал брать заказы на рекламные и поздравительные ролики, внедрил ИИ-функции в свои бизнес-процессы.',
    result: 'По словам Виталия, полученные заказы компенсировали стоимость обучения. Сейчас обсуждается контракт с государственным учреждением на создание контента.',
  },
  {
    photo: alenaVinokurova,
    name: 'Алёна Винокурова',
    role: 'Выпускница',
    headline: 'Собрала сайт, ассистента и линейку цифровых продуктов',
    start: 'Хотела систематизировать работу в своей нише.',
    did: 'За три месяца сделала анализ рынка и ниши, упаковала бренд, собрала цифровые продукты, ИИ-ассистента, фото- и видеоконтент, музыкальные треки и цифрового аватара.',
    result: 'Полноценный сайт с доменом, подключённым ботом и ассистентом, плюс презентации, методички и гайды.',
  },
  {
    photo: marinaMorskaya,
    name: 'Марина Морская',
    role: 'Выпускница',
    headline: 'Нашла новое направление — ИИ-видеорежиссуру',
    start: 'Пришла разобраться, что происходит с ИИ, без конкретной цели.',
    did: 'Прошла все направления курса и сфокусировалась на видео: ИИ-клипы, визуал, монтаж.',
    result: 'Сертификат, набор работ и новое рабочее направление, которое внедряет в практику.',
  },
  {
    photo: annaDubinets,
    name: 'Анна Дубинец',
    role: 'Выпускница · 4 поток',
    headline: 'Училась в своём темпе — и дошла до результата',
    start: 'Сама себя называет «вечным студентом», который бросает на половине.',
    did: 'Совмещала очные занятия с записями пропущенных уроков, доступными полгода.',
    result: 'Дошла до конца программы и приложила к отзыву собственные работы как доказательство.',
  },
];

const Cases = () => {
  return (
    <section className="sec" id="cases" style={{ background: 'var(--deep)' }}>
      <div className="wrap">
        <Reveal className="eyebrow">// РЕЗУЛЬТАТЫ ВЫПУСКНИКОВ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Реальные люди,<br />проверяемые отзывы</Reveal>
        <Reveal as="p" className="sec-sub">
          Здесь только те выпускники, чьи отзывы вы можете открыть и прочитать целиком на независимой
          площадке. Никаких анонимных историй про «доход вырос втрое».
        </Reveal>

        <div className="case-grid">
          {CASES.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.07}>
              <article className="case-card">
                <header>
                  <img src={c.photo} alt={c.name} loading="lazy" />
                  <div>
                    <b>{c.name}</b>
                    <span>{c.role}</span>
                  </div>
                </header>
                <h3>{c.headline}</h3>
                <dl>
                  <div><dt>С чем пришёл</dt><dd>{c.start}</dd></div>
                  <div><dt>Что сделал на курсе</dt><dd>{c.did}</dd></div>
                  <div><dt>Результат</dt><dd>{c.result}</dd></div>
                </dl>
                <a className="case-link" href={REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                  <Icon name="ExternalLink" size={14} />
                  Читать оригинал отзыва в 2ГИС
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <p className="case-disclaimer">
            Это результаты конкретных учеников, а не гарантия аналогичного результата. Ваш итог зависит
            от исходной задачи, ниши и практики между занятиями. Мы не обещаем трудоустройство или
            определённый доход — мы даём систему, инструменты и помощь в классе.
          </p>
        </Reveal>
      </div>
    </section>
  );
};

export default Cases;
