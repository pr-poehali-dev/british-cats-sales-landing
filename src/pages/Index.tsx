import Preloader from '@/components/landing/Preloader';
import Cursor from '@/components/landing/Cursor';
import ScrollProgress from '@/components/landing/ScrollProgress';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Ticker from '@/components/landing/Ticker';
import Stats from '@/components/landing/Stats';
import GeoAnswers from '@/components/landing/GeoAnswers';
import Professions from '@/components/landing/Professions';
import Program from '@/components/landing/Program';
import Tools from '@/components/landing/Tools';
import Speaker from '@/components/landing/Speaker';
import Awards from '@/components/landing/Awards';
import Cases from '@/components/landing/Cases';
import Income from '@/components/landing/Income';
import Versus from '@/components/landing/Versus';
import ClassPhotos from '@/components/landing/ClassPhotos';
import Streams from '@/components/landing/Streams';
import Pricing from '@/components/landing/Pricing';
import Reviews from '@/components/landing/Reviews';
import Faq from '@/components/landing/Faq';
import FinalCta from '@/components/landing/FinalCta';
import Footer from '@/components/landing/Footer';
import Pill from '@/components/landing/Pill';
import GiftPopup from '@/components/landing/GiftPopup';
import { GEO_ANSWERS } from '@/components/landing/GeoAnswers';
import { QA } from '@/components/landing/Faq';
import { useSeo } from '@/lib/seo';

const TICK1 = ['НЕ ЗНАТЬ AI — ДОРОГО!', 'ПРОДАЖИ ЗАКРЫТЫ', 'СЛЕДУЮЩИЙ ПОТОК · ДЕКАБРЬ 2026', 'ЖИВОЙ КЛАСС', 'ВЛАДИВОСТОК'];
const TICK2 = ['САЙТ ЗА 30 МИНУТ', 'РЕКЛАМНЫЙ РОЛИК', 'ИИ-АГЕНТ В TELEGRAM', 'КОНТЕНТ-ПЛАН', 'НЕЙРО-АВАТАР', 'ВОРОНКА ПРОДАЖ'];

const FAQ_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [...GEO_ANSWERS, ...QA].map((x) => ({
    '@type': 'Question',
    name: x.q,
    acceptedAnswer: { '@type': 'Answer', text: x.a },
  })),
};

const Index = () => {
  useSeo({
    title: 'Курсы нейросетей во Владивостоке — школа «Хакни Нейросети»',
    description:
      'Живые курсы по нейросетям и искусственному интеллекту во Владивостоке. 3 месяца практики: ChatGPT, ИИ-агенты, сайты, дизайн, видео, маркетинг и автоматизация бизнеса. Школа «Хакни Нейросети».',
    path: '/',
    jsonLd: FAQ_LD,
  });

  return (
    <>
      <div className="noise" />
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Navbar />
      <Hero />
      <Ticker items={TICK1} />
      <Stats />
      <GeoAnswers />
      <Professions />
      <Program />
      <Tools />
      <Speaker />
      <Awards />
      <Ticker items={TICK2} reverse />
      <Cases />
      <Income />
      <Versus />
      <ClassPhotos />
      <Streams />
      <Pricing />
      <Reviews />
      <Faq />
      <FinalCta />
      <Footer />
      <Pill />
      <GiftPopup />
    </>
  );
};

export default Index;