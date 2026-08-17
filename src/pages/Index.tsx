import Preloader from '@/components/landing/Preloader';
import Cursor from '@/components/landing/Cursor';
import ScrollProgress from '@/components/landing/ScrollProgress';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Ticker from '@/components/landing/Ticker';
import Stats from '@/components/landing/Stats';
import Professions from '@/components/landing/Professions';
import Program from '@/components/landing/Program';
import Tools from '@/components/landing/Tools';
import Speaker from '@/components/landing/Speaker';
import Cases from '@/components/landing/Cases';
import Income from '@/components/landing/Income';
import Versus from '@/components/landing/Versus';
import Streams from '@/components/landing/Streams';
import Pricing from '@/components/landing/Pricing';
import Reviews from '@/components/landing/Reviews';
import Faq from '@/components/landing/Faq';
import FinalCta from '@/components/landing/FinalCta';
import Footer from '@/components/landing/Footer';
import Pill from '@/components/landing/Pill';
import GiftPopup from '@/components/landing/GiftPopup';

const TICK1 = ['НЕ ЗНАТЬ AI — ДОРОГО!', 'СТАРТ 14.09.2026', 'ОСТАЛОСЬ 7 МЕСТ', 'ЖИВОЙ КЛАСС', 'ВЛАДИВОСТОК'];
const TICK2 = ['САЙТ ЗА 30 МИНУТ', 'РЕКЛАМНЫЙ РОЛИК', 'ИИ-АГЕНТ В TELEGRAM', 'КОНТЕНТ-ПЛАН', 'НЕЙРО-АВАТАР', 'ВОРОНКА ПРОДАЖ'];

const Index = () => {
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
      <Professions />
      <Program />
      <Tools />
      <Speaker />
      <Ticker items={TICK2} reverse />
      <Cases />
      <Income />
      <Versus />
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