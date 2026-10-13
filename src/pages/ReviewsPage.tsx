import { Link } from 'react-router-dom';
import SeoPage from '@/components/seo/SeoPage';
import SeoLinks from '@/components/seo/SeoLinks';
import { useSeo } from '@/lib/seo';
import { REVIEWS } from '@/components/landing/Reviews';

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Отзывы выпускников школы «Хакни Нейросети»',
  url: 'https://chernikovgpt.ru/reviews',
  numberOfItems: REVIEWS.length,
  itemListElement: REVIEWS.map((r, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Review',
      author: { '@type': 'Person', name: r.name },
      reviewRating: { '@type': 'Rating', ratingValue: r.full, bestRating: 5 },
      reviewBody: r.text.slice(0, 400),
      itemReviewed: { '@id': 'https://chernikovgpt.ru/#school' },
    },
  })),
};

const ReviewsPage = () => {
  useSeo({
    title: 'Отзывы о школе нейросетей «Хакни Нейросети» — Владивосток',
    description:
      'Реальные отзывы выпускников курса нейросетей во Владивостоке: что изменилось в работе и какие навыки освоили. Рейтинг 5 и 33 отзыва в 2ГИС.',
    path: '/reviews',
    jsonLd: JSON_LD,
  });

  return (
    <SeoPage
      eyebrow="// ОТЗЫВЫ"
      h1="Отзывы выпускников школы «Хакни Нейросети»"
      lead="Что говорят студенты курса нейросетей во Владивостоке: какие навыки освоили и как применяют ИИ в работе. Рейтинг школы — 5, на основе 33 отзывов в 2ГИС."
      crumbs={[{ to: '/reviews', label: 'Отзывы' }]}
    >
      <div className="seo-body">
        <div className="seo-answer">
          <b>КОРОТКИЙ ОТВЕТ</b>
          <p>
            У школы «Хакни Нейросети» рейтинг 5 и 33 отзыва в 2ГИС — независимой площадке, где оценки можно проверить
            самостоятельно. Студенты отмечают живой офлайн-формат, поддержку кураторов и практическую подачу материала.
            Часть студентов берётся за первые клиентские задачи уже во время курса — ролики, дизайн, сайты, ИИ-контент.
          </p>
        </div>

        {REVIEWS.map((r) => (
          <article key={r.name} style={{ marginBottom: 44 }}>
            <h2 style={{ marginTop: 32, fontSize: 22 }}>{r.name} — {'★'.repeat(r.full)}</h2>
            <p style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--t3)' }}>{r.role}</p>
            {r.text.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </article>
        ))}

        <h2>Независимые отзывы</h2>
        <p>
          Отзывы о школе также публикуются на карточке организации в 2ГИС:{' '}
          <a href="https://2gis.ru/vladivostok/firm/70000001105602364/tab/reviews" target="_blank" rel="noopener">
            читать отзывы на 2ГИС
          </a>.
        </p>

        <p>
          Посмотреть, чему именно учат студентов, можно на странице <Link to="/course">курса нейросетей</Link>,
          а познакомиться с преподавателем — на странице <Link to="/sergey-chernikov">Сергея Черникова</Link>.
        </p>

        <div className="seo-cta">
          <Link className="btn" to="/#pricing">Подобрать поток →</Link>
          <Link className="btn btn-ghost" to="/about">О школе</Link>
        </div>
        <SeoLinks exclude="/reviews" />
      </div>
    </SeoPage>
  );
};

export default ReviewsPage;