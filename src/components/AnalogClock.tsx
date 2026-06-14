import { useEffect, useMemo, useRef } from 'react';
import { ClockConfig } from '../types';
import { getTimeParts, escapeHtml, escapeAttr } from '../utils';

interface Props {
  config: ClockConfig;
}

function buildTicksSvg(tickColor: string, handColor: string, face: string): string {
  let t = '';
  for (let i = 0; i < 60; i++) {
    const ang = (i * 6 * Math.PI) / 180;
    const isHour = i % 5 === 0;
    const sinA = Math.sin(ang), cosA = Math.cos(ang);
    const deg = i * 6;

    if (face === 'sport') {
      if (isHour) {
        t += `<rect x="97" y="7" width="6" height="13" rx="3" fill="${handColor}" transform="rotate(${deg} 100 100)" />`;
      } else {
        t += `<rect x="98.5" y="8" width="3" height="6" rx="1.5" fill="${tickColor}" opacity="0.55" transform="rotate(${deg} 100 100)" />`;
      }
    } else if (face === 'minimal') {
      if (!isHour) continue;
      const x = (100 + 84 * sinA).toFixed(2);
      const y = (100 - 84 * cosA).toFixed(2);
      t += `<circle cx="${x}" cy="${y}" r="2" fill="${tickColor}" />`;
    } else if (face === 'modern') {
      if (!isHour) continue;
      const x1 = (100 + 84 * sinA).toFixed(2);
      const y1 = (100 - 84 * cosA).toFixed(2);
      const x2 = (100 + 91 * sinA).toFixed(2);
      const y2 = (100 - 91 * cosA).toFixed(2);
      t += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${tickColor}" stroke-width="3" stroke-linecap="square" />`;
    } else if (face === 'retro') {
      const r1 = isHour ? 79 : 86;
      const w = isHour ? 2.8 : 1.2;
      const x1 = (100 + r1 * sinA).toFixed(2);
      const y1 = (100 - r1 * cosA).toFixed(2);
      const x2 = (100 + 90 * sinA).toFixed(2);
      const y2 = (100 - 90 * cosA).toFixed(2);
      t += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${tickColor}" stroke-width="${w}" />`;
    } else {
      // classic
      const r1 = isHour ? 82 : 86;
      const x1 = (100 + r1 * sinA).toFixed(2);
      const y1 = (100 - r1 * cosA).toFixed(2);
      const x2 = (100 + 90 * sinA).toFixed(2);
      const y2 = (100 - 90 * cosA).toFixed(2);
      t += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${tickColor}" stroke-width="${isHour ? 2.2 : 1}" />`;
    }
  }
  return t;
}

function buildNumeralsSvg(color: string): string {
  let n = '';
  for (let h = 1; h <= 12; h++) {
    const a = (h * 30 * Math.PI) / 180;
    const x = (100 + 70 * Math.sin(a)).toFixed(2);
    const y = (100 - 70 * Math.cos(a) + 4.5).toFixed(2);
    n += `<text x="${x}" y="${y}" text-anchor="middle" font-size="13" font-weight="600" font-family="sans-serif" fill="${color}">${h}</text>`;
  }
  return n;
}

function buildLogoSvg(config: ClockConfig): string {
  const { logo, colors, logoY, logoSize } = config;
  if (logo.kind === 'none' || !logo.value) return '';
  const cx = 100, cy = logoY;
  const scale = logoSize / 100;
  if (logo.kind === 'text') {
    const fs = (13 * scale).toFixed(1);
    return `<text x="${cx}" y="${cy + 5 * scale}" text-anchor="middle" font-size="${fs}" font-weight="700" font-family="sans-serif" fill="${colors.hand}" opacity="0.92">${escapeHtml(logo.value)}</text>`;
  }
  const w = 52 * scale, h = 36 * scale;
  return `<image href="${escapeAttr(logo.value)}" x="${cx - w / 2}" y="${cy - h / 2}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" preserveAspectRatio="xMidYMid meet" opacity="0.95" />`;
}

export function AnalogClock({ config }: Props) {
  const hRef = useRef<SVGGElement>(null);
  const mRef = useRef<SVGGElement>(null);
  const sRef = useRef<SVGGElement>(null);
  const configRef = useRef(config);
  configRef.current = config;

  const face = config.clockFace ?? 'classic';
  const { colors } = config;

  const ticksSvg = useMemo(
    () => buildTicksSvg(colors.tick, colors.hand, face),
    [colors.tick, colors.hand, face],
  );
  const numeralsSvg = useMemo(() => buildNumeralsSvg(colors.tick), [colors.tick]);
  const logoSvg = useMemo(
    () => buildLogoSvg(config),
    [config, config.logoY, config.logoSize],
  );

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      const cfg = configRef.current;
      const { h, m, s, ms } = getTimeParts(cfg.tz);
      const hrAng = (h % 12) * 30 + m * 0.5;
      const minAng = m * 6 + s * 0.1;
      const secAng = cfg.seconds ? (s + ms / 1000) * 6 : s * 6;

      hRef.current?.setAttribute('transform', `rotate(${hrAng} 100 100)`);
      mRef.current?.setAttribute('transform', `rotate(${minAng} 100 100)`);
      if (sRef.current) {
        sRef.current.style.display = cfg.seconds ? '' : 'none';
        if (cfg.seconds) {
          sRef.current.setAttribute('transform', `rotate(${secAng} 100 100)`);
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Hand shapes per face
  const hourHand = face === 'sport' ? (
    <rect x="92" y="58" width="16" height="52" rx="8" fill={colors.hand} />
  ) : face === 'modern' ? (
    <polygon points="97,103 103,103 101,57 99,57" fill={colors.hand} />
  ) : face === 'minimal' ? (
    <line x1="100" y1="100" x2="100" y2="60" stroke={colors.hand} strokeWidth="2.5" strokeLinecap="round" />
  ) : face === 'retro' ? (
    <line x1="100" y1="108" x2="100" y2="54" stroke={colors.hand} strokeWidth="6.5" strokeLinecap="round" />
  ) : (
    <line x1="100" y1="100" x2="100" y2="55" stroke={colors.hand} strokeWidth="5" strokeLinecap="round" />
  );

  const minuteHand = face === 'sport' ? (
    <rect x="94" y="32" width="12" height="82" rx="6" fill={colors.hand} />
  ) : face === 'modern' ? (
    <polygon points="98.5,106 101.5,106 100.3,31 99.7,31" fill={colors.hand} />
  ) : face === 'minimal' ? (
    <line x1="100" y1="100" x2="100" y2="37" stroke={colors.hand} strokeWidth="1.5" strokeLinecap="round" />
  ) : face === 'retro' ? (
    <line x1="100" y1="112" x2="100" y2="30" stroke={colors.hand} strokeWidth="4.5" strokeLinecap="round" />
  ) : (
    <line x1="100" y1="100" x2="100" y2="32" stroke={colors.hand} strokeWidth="3.5" strokeLinecap="round" />
  );

  const secondHand = face === 'sport' ? (
    <>
      <line x1="100" y1="118" x2="100" y2="26" stroke={colors.accent} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="100" cy="37" r="4.5" fill="none" stroke={colors.accent} strokeWidth="1.5" />
    </>
  ) : face === 'minimal' ? (
    <line x1="100" y1="108" x2="100" y2="27" stroke={colors.accent} strokeWidth="0.9" strokeLinecap="round" />
  ) : face === 'modern' ? (
    <>
      <line x1="100" y1="118" x2="100" y2="27" stroke={colors.accent} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="100" cy="113" r="5" fill={colors.accent} />
      <circle cx="100" cy="113" r="2.5" fill={colors.face} />
    </>
  ) : (
    <line x1="100" y1="112" x2="100" y2="26" stroke={colors.accent} strokeWidth="1.6" strokeLinecap="round" />
  );

  // Center cap per face
  const centerCap = face === 'sport' ? (
    <>
      <circle cx="100" cy="100" r="5.5" fill={colors.accent} />
      <circle cx="100" cy="100" r="2" fill={colors.face} />
    </>
  ) : face === 'minimal' ? (
    <circle cx="100" cy="100" r="2.5" fill={colors.accent} />
  ) : face === 'modern' ? (
    <circle cx="100" cy="100" r="6" fill={colors.hand} />
  ) : face === 'retro' ? (
    <>
      <circle cx="100" cy="100" r="5.5" fill={colors.accent} />
      <circle cx="100" cy="100" r="2.5" fill={colors.face} />
    </>
  ) : (
    <circle cx="100" cy="100" r="4.5" fill={colors.accent} />
  );

  return (
    <svg viewBox="0 0 200 200" style={{ width: '100%', height: '100%' }} aria-label="아날로그 시계">
      {/* 베젤 */}
      {face === 'minimal' && (
        <circle cx="100" cy="100" r="96" fill="none" stroke={colors.face} strokeWidth="0.8" />
      )}
      {face === 'classic' && (
        <circle cx="100" cy="100" r="98" fill="none" stroke={colors.face} strokeWidth="2" />
      )}
      {face === 'modern' && (
        <circle cx="100" cy="100" r="93" fill="none" stroke={colors.face} strokeWidth="10" />
      )}
      {face === 'retro' && (
        <>
          <circle cx="100" cy="100" r="98" fill="none" stroke={colors.face} strokeWidth="1.5" />
          <circle cx="100" cy="100" r="91" fill="none" stroke={colors.face} strokeWidth="0.8" opacity="0.6" />
        </>
      )}
      {/* sport: 베젤 없음 */}

      {/* 눈금 */}
      <g dangerouslySetInnerHTML={{ __html: ticksSvg }} />

      {/* 숫자 */}
      {config.numerals && <g dangerouslySetInnerHTML={{ __html: numeralsSvg }} />}

      {/* 로고 */}
      {logoSvg && <g dangerouslySetInnerHTML={{ __html: logoSvg }} />}

      {/* 시침 */}
      <g ref={hRef}>{hourHand}</g>
      {/* 분침 */}
      <g ref={mRef}>{minuteHand}</g>
      {/* 초침 */}
      <g ref={sRef} style={{ display: config.seconds ? '' : 'none' }}>
        {secondHand}
      </g>

      {/* 중앙 캡 */}
      {centerCap}
    </svg>
  );
}
