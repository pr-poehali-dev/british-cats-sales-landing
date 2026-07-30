import Reveal from './Reveal';

const TOOLS = ['ChatGPT', 'Nano Banana', 'Seedance 2', 'GigaChat', 'Claude', 'Gemini', 'Kandinsky', 'Яндекс', 'Salebot'];

const Tools = () => {
  return (
    <section className="sec" id="tools" style={{ background: 'var(--deep)' }}>
      <div className="wrap">
        <Reveal className="eyebrow">// 04 · ИНСТРУМЕНТЫ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Работаем в тех же<br />нейросетях, что и весь мир</Reveal>
        <div className="tools-row">
          {TOOLS.map((t, i) => (
            <Reveal key={t} as="span" className="tool" delay={i * 0.04}>{t}</Reveal>
          ))}
        </div>
        <Reveal className="vpn-note">
          <b>Честно про VPN:</b> российские сервисы работают напрямую. Для зарубежных (ChatGPT, Claude, Nano Banana) нужен VPN — бесплатного достаточно, покажем и настроим на первом занятии.
        </Reveal>
      </div>
    </section>
  );
};

export default Tools;
