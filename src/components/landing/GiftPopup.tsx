import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/ui/icon';
import { ymGoal } from '@/lib/analytics';

const LINKS = {
  tg: 'https://t.me/HackNeuro_bot?start=s=3803564',
  max: 'https://max.ru/id783801003680_bot?start=s=3803571',
  vk: 'https://vk.ru/app5898182_-41953587#s=3803568',
};

const STORAGE_KEY = 'gift-popup-subscribed';
const OPEN_DELAY = 30000;
const REOPEN_DELAY = 45000;

type Phase = 'idle' | 'open' | 'collapsed';

const GiftPopup = () => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [clicked, setClicked] = useState(false);
  const reopenTimer = useRef<number>();

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === '1') {
      setClicked(true);
      return;
    }
    const t = window.setTimeout(() => setPhase('open'), OPEN_DELAY);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = phase === 'open' ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  useEffect(() => () => {
    if (reopenTimer.current) window.clearTimeout(reopenTimer.current);
  }, []);

  const clearReopenTimer = () => {
    if (reopenTimer.current) {
      window.clearTimeout(reopenTimer.current);
      reopenTimer.current = undefined;
    }
  };

  const handleClose = () => {
    setPhase('collapsed');
    clearReopenTimer();
    reopenTimer.current = window.setTimeout(() => setPhase('open'), REOPEN_DELAY);
  };

  const handleFabClick = () => {
    clearReopenTimer();
    setPhase('open');
  };

  const handleLinkClick = (channel: 'telegram' | 'vk' | 'max') => () => {
    ymGoal('gift_popup_click', { channel });
    setClicked(true);
    localStorage.setItem(STORAGE_KEY, '1');
    clearReopenTimer();
    setPhase('collapsed');
  };

  if (phase === 'idle') return null;

  if (phase === 'collapsed') {
    return createPortal(
      <button
        type="button"
        className={`gift-fab${clicked ? '' : ' gift-fab-pulse'}`}
        onClick={handleFabClick}
        aria-label="Открыть подарок"
      >
        <Icon name="Gift" size={26} />
      </button>,
      document.body,
    );
  }

  return createPortal(
    <div className="gift-overlay" role="dialog" aria-modal="true" onClick={handleClose}>
      <div className="gift-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="gift-close" onClick={handleClose} aria-label="Закрыть">
          <Icon name="X" size={20} />
        </button>

        <div className="gift-icon">
          <Icon name="Gift" size={40} />
        </div>
        <span className="gift-eyebrow">Вам подарок</span>
        <h3 className="gift-title">Получи первые 3 урока бесплатно</h3>
        <p className="gift-sub">Подпишись на нашего бота в Telegram, ВКонтакте или MAX</p>

        <div className="gift-btns">
          <a
            href={LINKS.tg}
            target="_blank"
            rel="noopener noreferrer"
            className="gift-btn gift-btn-tg"
            onClick={handleLinkClick('telegram')}
          >
            <Icon name="Send" size={22} />
            Telegram
          </a>
          <a
            href={LINKS.vk}
            target="_blank"
            rel="noopener noreferrer"
            className="gift-btn gift-btn-vk"
            onClick={handleLinkClick('vk')}
          >
            <Icon name="MessageCircle" size={22} />
            ВКонтакте
          </a>
          <a
            href={LINKS.max}
            target="_blank"
            rel="noopener noreferrer"
            className="gift-btn gift-btn-max"
            onClick={handleLinkClick('max')}
          >
            <Icon name="MessageSquare" size={22} />
            MAX
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default GiftPopup;