import { useCallback, useEffect, useRef, useState } from 'react';
import { ClockConfig } from '../types';
import { AnalogClock } from './AnalogClock';
import { DigitalClock } from './DigitalClock';
import { useWakeLock } from '../hooks/useWakeLock';

interface Props {
  config: ClockConfig;
  panelOpen: boolean;
  onOpenPanel: () => void;
}

export function ClockStage({ config, panelOpen, onOpenPanel }: Props) {
  const [faded, setFaded] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const panelOpenRef = useRef(panelOpen);
  panelOpenRef.current = panelOpen;

  // 패널이 닫혀있는 동안 절전 방지
  useWakeLock(!panelOpen);

  const scheduleHide = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    setFaded(false);
    hideTimerRef.current = setTimeout(() => {
      if (!panelOpenRef.current) setFaded(true);
    }, 3000);
  }, []);

  useEffect(() => {
    scheduleHide();
    const events = ['mousemove', 'touchstart', 'click'] as const;
    events.forEach((ev) => document.addEventListener(ev, scheduleHide, { passive: true }));
    return () => {
      events.forEach((ev) => document.removeEventListener(ev, scheduleHide));
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [scheduleHide]);

  useEffect(() => {
    if (panelOpen) {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      setFaded(false);
    }
  }, [panelOpen]);

  function toggleFs() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: config.colors.bg,
        transition: 'background-color 0.25s ease',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 'min(82vmin, 82vh)',
          aspectRatio: '1 / 1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {config.type === 'analog' ? (
          <AnalogClock config={config} />
        ) : (
          <DigitalClock config={config} />
        )}
      </div>

      <button
        className={`fab${faded ? ' faded' : ''}`}
        style={{ top: 18, right: 76 }}
        onClick={toggleFs}
        title="전체화면"
        aria-label="전체화면"
      >
        ⛶
      </button>
      <button
        className={`fab${faded ? ' faded' : ''}`}
        style={{ top: 18, right: 18 }}
        onClick={onOpenPanel}
        title="설정"
        aria-label="설정"
      >
        ⚙
      </button>
    </div>
  );
}
