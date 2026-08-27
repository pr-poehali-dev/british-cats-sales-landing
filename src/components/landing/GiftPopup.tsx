import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/ui/icon';
import { ymGoal } from '@/lib/analytics';
import { GIFT_POPUP_OPEN_EVENT } from '@/lib/giftPopup';

const LINKS = {
  tg: 'https://t.me/HackNeuro_bot?start=s=3803564',
  max: 'https://max.ru/id783801003680_bot?start=s=3803571',
  vk: 'https://vk.ru/app5898182_-41953587#s=3803568',
};

const STORAGE_KEY = 'gift-popup-subscribed';
const SESSION_KEY = 'gift-popup-session-shown';
const OPEN_DELAY = 30000;
const SCROLL_THRESHOLD = 0.5;

type Phase = 'idle' | 'open' | 'collapsed';

const GiftPopup = () => {
  const [phase, setPhase] = useState<Phase>('idle');
  const [clicked, setClicked] = useState(false);

  // Автопоказ: один раз за сессию, через 30 сек или на 50% скролла — что раньше.
  useEffect(() => {
    const subscribed = localStorage.getItem(STORAGE_KEY) === '1';
    if (subscribed) {
      setClicked(true);
      setPhase('collapsed');
      return;
    }
    const alreadyShown = sessionStorage.getItem(SESSION_KEY) === '1';
    if (alreadyShown) {
      setPhase('collapsed');
      return;
    }

    let triggered = false;
    const trigger = () => {
      if (triggered) return;
      triggered = true;
      sessionStorage.setItem(SESSION_KEY, '1');
      setPhase('open');
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total >= SCROLL_THRESHOLD) trigger();
    };
    const timer = window.setTimeout(trigger, OPEN_DELAY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Ручное открытие по клику из других мест сайта (например, кнопка «Записаться»).
  useEffect(() => {
    const handler = () => {
      sessionStorage.setItem(SESSION_KEY, '1');
      setPhase('open');
    };
    window.addEventListener(GIFT_POPUP_OPEN_EVENT, handler);
    return () => window.removeEventListener(GIFT_POPUP_OPEN_EVENT, handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = phase === 'open' ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  const handleClose = () => {
    setPhase('collapsed');
  };

  const handleFabClick = () => {
    setPhase('open');
  };

  const handleLinkClick = (channel: 'telegram' | 'vk' | 'max') => () => {
    ymGoal('gift_popup_click', { channel });
    setClicked(true);
    localStorage.setItem(STORAGE_KEY, '1');
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
        <p className="gift-note">Бот выдаст уроки и пригласит на бесплатный мастер-класс в живом классе</p>

        <div className="gift-btns">
          <a
            href={LINKS.tg}
            target="_blank"
            rel="noopener noreferrer"
            className="gift-card"
            onClick={handleLinkClick('telegram')}
          >
            <span className="gift-card-icon gift-card-icon-tg">
              <Icon name="Send" size={22} />
            </span>
            <span className="gift-card-label">Telegram</span>
          </a>
          <a
            href={LINKS.max}
            target="_blank"
            rel="noopener noreferrer"
            className="gift-card"
            onClick={handleLinkClick('max')}
          >
            <span className="gift-card-icon gift-card-icon-max">
              <Icon name="MessageCircle" size={22} />
            </span>
            <span className="gift-card-label">MAX</span>
          </a>
          <a
            href={LINKS.vk}
            target="_blank"
            rel="noopener noreferrer"
            className="gift-card"
            onClick={handleLinkClick('vk')}
          >
            <span className="gift-card-icon gift-card-icon-vk">VK</span>
            <span className="gift-card-label">ВКонтакте</span>
          </a>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default GiftPopup;