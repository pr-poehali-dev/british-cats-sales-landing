interface Props {
  items: string[];
  reverse?: boolean;
}

const Ticker = ({ items, reverse }: Props) => {
  const seq = [...items, ...items, ...items];
  const cell = (t: string, i: number) => {
    const hot = t.includes('ДОРОГО') || t.includes('ОСТАЛОСЬ');
    const cls = hot ? 'hot' : i % 2 ? 'c' : '';
    return (
      <span key={`${t}-${i}`} style={{ display: 'contents' }}>
        <span className={cls}>{t}</span>
        <span style={{ color: 'var(--t3)' }}>✦</span>
      </span>
    );
  };
  return (
    <div className={`ticker${reverse ? ' rev' : ''}`}>
      <div className="ticker-track">
        {seq.map(cell)}
        {seq.map((t, i) => cell(t, i + 100))}
      </div>
    </div>
  );
};

export default Ticker;
