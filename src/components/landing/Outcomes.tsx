import Reveal from './Reveal';
import Icon from '@/components/ui/icon';

const OUTCOMES = [
  {
    icon: 'Bot',
    title: 'Персональный ИИ-ассистент',
    text: 'Знает ваш продукт, аудиторию и стиль, помогает выполнять повторяющиеся задачи каждый день.',
  },
  {
    icon: 'FileText',
    title: 'Контент-система',
    text: 'Темы, контент-план, тексты, сценарии и шаблоны под вашу нишу — не разовые посты, а работающий процесс.',
  },
  {
    icon: 'Image',
    title: 'Визуал и видео',
    text: 'Комплект готовых работ для рекламы, соцсетей, продукта или портфолио.',
  },
  {
    icon: 'Globe',
    title: 'Рабочий сайт',
    text: 'Структура, тексты, дизайн, публикация и подключённая форма или бот.',
  },
  {
    icon: 'Filter',
    title: 'Воронка или бот',
    text: 'Путь клиента от первого касания до заявки — собранный и проверенный на практике.',
  },
  {
    icon: 'Workflow',
    title: 'План автоматизации',
    text: 'Список процессов, которые можно передать ИИ, и первый внедрённый сценарий.',
  },
];

const Outcomes = () => (
  <section id="outcomes" className="sec">
    <div className="wrap">
      <Reveal>
        <div className="sec-head">
          <span className="eyebrow">// РЕЗУЛЬТАТ ОБУЧЕНИЯ</span>
          <h2>Вы закончите курс не с конспектом, а с работающими ИИ-инструментами</h2>
          <p className="sec-sub">
            Все шесть результатов вы собираете на своих материалах — на реальной задаче своей работы или бизнеса.
          </p>
        </div>
      </Reveal>

      <div className="out-grid">
        {OUTCOMES.map((o, i) => (
          <Reveal key={o.title} delay={i * 0.06}>
            <article className="out-card">
              <div className="out-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="out-icon"><Icon name={o.icon} size={24} /></div>
              <h3>{o.title}</h3>
              <p>{o.text}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120}>
        <p className="out-foot">
          Каждый результат создаётся на ваших материалах. Все файлы, инструкции, промпты и записи занятий
          остаются у вас навсегда. Все осваивают общую базу и доводят до финала два итоговых проекта —
          те, что важнее для вашей задачи.
        </p>
      </Reveal>
    </div>
  </section>
);

export default Outcomes;