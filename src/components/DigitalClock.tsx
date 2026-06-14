import React, { useEffect, useRef, useState } from 'react';
import { ClockConfig } from '../types';
import { getTimeParts, formatDate, pad, TimeParts } from '../utils';

interface Props {
  config: ClockConfig;
}

export function DigitalClock({ config }: Props) {
  const [parts, setParts] = useState<TimeParts>(() => getTimeParts(config.tz));
  const tzRef = useRef(config.tz);
  tzRef.current = config.tz;

  // 초가 바뀔 때만 state 업데이트 → 최대 1회/초 리렌더
  useEffect(() => {
    let prevSec = -1;
    let rafId: number;
    const tick = () => {
      const t = getTimeParts(tzRef.current);
      if (t.s !== prevSec) {
        prevSec = t.s;
        setParts(t);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const { colors, logo, seconds, date, h24, font, title, logoSize, ampmInline } = config;
  const logoScale = (logoSize ?? 100) / 100;
  const { h, m, s, date: dateObj } = parts;

  let hh = h;
  let apLabel = '';
  if (!h24) {
    apLabel = h < 12 ? 'AM' : 'PM';
    hh = h % 12 || 12;
  }
  let timeStr = `${pad(hh)}:${pad(m)}`;
  if (seconds) timeStr += `:${pad(s)}`;

  const timeBaseStyle: React.CSSProperties = {
    fontFamily: font,
    color: colors.text,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-0.01em',
    lineHeight: 1,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: '100%',
        userSelect: 'none',
      }}
    >
      {logo.kind !== 'none' && logo.value && (
        <div style={{ marginBottom: '4vmin', maxWidth: `${30 * logoScale}vmin`, maxHeight: `${22 * logoScale}vmin` }}>
          {logo.kind === 'text' ? (
            <div style={{ color: colors.text, fontSize: `${7 * logoScale}vmin`, fontWeight: 700 }}>
              {logo.value}
            </div>
          ) : (
            <img
              src={logo.value}
              alt="로고"
              style={{ maxWidth: `${30 * logoScale}vmin`, maxHeight: `${22 * logoScale}vmin`, objectFit: 'contain' }}
            />
          )}
        </div>
      )}

      {/* 시간 표시 */}
      {ampmInline && !h24 ? (
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '0.25em' }}>
          <span style={{ ...timeBaseStyle, fontSize: '18vmin' }}>{timeStr}</span>
          <span style={{ ...timeBaseStyle, fontSize: '5vmin', marginBottom: '1.8vmin', opacity: 0.85 }}>
            {apLabel}
          </span>
        </div>
      ) : (
        <div style={{ ...timeBaseStyle, fontSize: '18vmin' }}>
          {timeStr}{apLabel ? ` ${apLabel}` : ''}
        </div>
      )}

      {date && (
        <div style={{ color: colors.text, marginTop: '3vmin', fontSize: '4.2vmin', opacity: 0.82 }}>
          {formatDate(dateObj)}
        </div>
      )}

      {title && (
        <div
          style={{
            color: colors.text,
            marginTop: '2.5vmin',
            fontSize: '3.4vmin',
            opacity: 0.55,
            letterSpacing: '0.04em',
          }}
        >
          {title}
        </div>
      )}
    </div>
  );
}
