import Preloader from '@/components/landing/Preloader';
import Cursor from '@/components/landing/Cursor';
import ScrollProgress from '@/components/landing/ScrollProgress';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Ticker from '@/components/landing/Ticker';
import Stats from '@/components/landing/Stats';
import Outcomes from '@/components/landing/Outcomes';
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
import Contacts from '@/components/landing/Contacts';
import Footer from '@/components/landing/Footer';
import Pill from '@/components/landing/Pill';
import GiftPopup from '@/components/landing/GiftPopup';
import { GEO_ANSWERS } from '@/components/landing/GeoAnswers';
import { QA } from '@/components/landing/Faq';
import { useSeo } from '@/lib/seo';

const TICK1 = ['ОЧНО ВО ВЛАДИВОСТОКЕ', '72 ЧАСА ЖИВОЙ ПРАКТИКИ', 'СПИКЕР И ДВА КУРАТОРА', 'СТАРТ ПОТОКА · ДЕКАБРЬ 2026', 'БЕЗ ПРОГРАММИРОВАНИЯ'];
const TICK2 = ['ИИ-АССИСТЕНТ', 'КОНТЕНТ-СИСТЕМА', 'ВИЗУАЛ И ВИДЕО', 'РАБОЧИЙ САЙТ', 'ВОРОНКА ИЛИ БОТ', 'ПЛАН АВТОМАТИЗАЦИИ'];

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
      <Outcomes />
      <Professions />
      <Versus />
      <ClassPhotos />
      <Ticker items={TICK2} reverse />
      <Program />
      <Tools />
      <Cases />
      <Reviews />
      <Speaker />
      <Awards />
      <Stats />
      <Income />
      <Streams />
      <Pricing />
      <GeoAnswers />
      <Faq />
      <FinalCta />
      <Contacts />
      <Footer />
      <Pill />
      <GiftPopup />
    </>
  );
};

export default Index;