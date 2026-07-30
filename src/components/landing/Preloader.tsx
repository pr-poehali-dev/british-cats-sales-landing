import { useEffect, useState } from 'react';

const DUR = 1600;
const WORDS = ['ЗАГРУЖАЕМ НЕЙРОСЕТИ', 'СТРОИМ ПРОМПТЫ', 'ГОТОВИМ КЛАСС', 'ПОЧТИ ГОТОВО'];

const Preloader = () => {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);
  const [word, setWord] = useState(0);

  useEffect(() => {
    // прогресс через таймер-интервал — не зависит от частоты кадров (устойчиво везде)
    const start = Date.now();
    const iv = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / DUR);
      setProgress(p);
      if (p >= 1) clearInterval(iv);
    }, 40);
    const wordIv = setInterval(() => setWord((w) => (w + 1) % WORDS.length), 450);
    const done = setTimeout(() => setGone(true), DUR + 450);
    return () => { clearInterval(iv); clearInterval(wordIv); clearTimeout(done); };
  }, []);

  if (gone) return null;

  const total = 30 * 60;
  const left = Math.round(total * (1 - progress));
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');

  return (
    <div
      id="preloader"
      style={{
        opacity: progress >= 1 ? 0 : 1,
        transition: 'opacity .4s ease',
        pointerEvents: progress >= 1 ? 'none' : 'auto',
      }}
    >
      <img src="/site/logo.jpg" alt="Хакни Нейросети" />
      <div id="pl-num">{mm}:{ss}</div>
      <div id="pl-bar"><i style={{ width: `${progress * 100}%` }} /></div>
      <div id="pl-word">{WORDS[word]}</div>
    </div>
  );
};

export default Preloader;
