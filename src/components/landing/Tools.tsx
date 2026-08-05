import Reveal from './Reveal';

const TOOLS = ['Nano Banana', 'Seedance 2', 'Gemini', 'Perplexity', 'Magnific', 'Kimi', 'Heygen', 'Manus', 'Suno', 'Gamma', 'Lipsync', 'Gpt 2 image', 'Notebooklm', 'Kling Ai', 'Seedream', 'Poehali', 'Elevenlabs'];

const ROW_A = TOOLS.slice(0, 9);
const ROW_B = TOOLS.slice(9);

const ToolsMarquee = ({ items, dir }: { items: string[]; dir: 'left' | 'right' }) => (
  <div className="tools-marquee">
    <div className={`tools-track ${dir}`}>
      {[0, 1].map((copy) => (
        <div className="tools-set" key={copy} aria-hidden={copy === 1}>
          {items.map((t) => (
            <span className="tool" key={`${copy}-${t}`}>{t}</span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const Tools = () => {
  return (
    <section className="sec" id="tools" style={{ background: 'var(--deep)' }}>
      <div className="wrap">
        <Reveal className="eyebrow">// 04 · ИНСТРУМЕНТЫ</Reveal>
        <Reveal as="h2" className="sec-title grad-text">Работаем в тех же<br />нейросетях, что и весь мир</Reveal>
        <div className="tools-rows">
          <ToolsMarquee items={ROW_A} dir="left" />
          <ToolsMarquee items={ROW_B} dir="right" />
        </div>
        <Reveal className="vpn-note">
          <b>Честно про VPN:</b> российские сервисы работают напрямую. Для зарубежных (Gemini, Perplexity, Nano Banana) нужен VPN — бесплатного достаточно, покажем и настроим на первом занятии.
        </Reveal>
      </div>
    </section>
  );
};

export default Tools;