import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/ui/icon';

const FULL_VIDEO = 'https://cdn.poehali.dev/projects/d3e635a0-73f6-4725-9cb9-7faeace376fe/bucket/9fc90f75-1c5c-47c0-88aa-ab9e74df08f1.mp4';

const HeroVideo = () => {
  const [open, setOpen] = useState(false);
  const fullRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    fullRef.current?.play().catch(() => undefined);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button type="button" className="hv-card" onClick={() => setOpen(true)} aria-label="Смотреть сюжет о школе">
        <div className="hv-media">
          <video
            className="hv-video"
            src="/hero-preview.mp4"
            poster="/hero-video-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <div className="hv-shade" />
          <span className="hv-live"><i />В ЭФИРЕ «ВЕСТИ ПРИМОРЬЕ»</span>
          <span className="hv-play">
            <Icon name="Play" size={26} />
          </span>
          <div className="hv-caption">
            <b>Как проходят занятия в нашем классе</b>
            <span>Сюжет телеканала «Россия 1» · 1:13</span>
          </div>
        </div>
        <div className="brackets"><i /><i /><i /><i /></div>
      </button>

      {open && createPortal(
        <div className="hv-modal" role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className="hv-modal-box" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="hv-close" onClick={() => setOpen(false)} aria-label="Закрыть">
              <Icon name="X" size={22} />
            </button>
            <video
              ref={fullRef}
              src={FULL_VIDEO}
              poster="/hero-video-poster.jpg"
              controls
              playsInline
              autoPlay
            />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default HeroVideo;
