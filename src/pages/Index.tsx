import Preloader from '@/components/landing/Preloader';
import Cursor from '@/components/landing/Cursor';
import ScrollProgress from '@/components/landing/ScrollProgress';
import Navbar from '@/components/landing/Navbar';

const Index = () => {
  return (
    <>
      <div className="noise" />
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Navbar />

      <div id="hero" style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="wrap" style={{ textAlign: 'center' }}>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>Блок 1 готов</div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,64px)' }}>
            <span className="grad-text">ХАКНИ</span> <span className="cyan">НЕЙРОСЕТИ</span>
          </h1>
          <p className="sec-sub" style={{ margin: '20px auto 0' }}>
            Навбар, прелоадер и курсор развёрнуты. Дальше — первый экран Hero с таймером.
          </p>
        </div>
      </div>
    </>
  );
};

export default Index;
