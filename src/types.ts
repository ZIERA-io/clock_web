export interface ClockColors {
  bg: string;
  face: string;
  tick: string;
  hand: string;
  accent: string;
  text: string;
}

export interface ClockLogo {
  kind: 'none' | 'text' | 'url' | 'image';
  value: string;
}

export interface ClockConfig {
  type: 'analog' | 'digital';
  clockFace: 'classic' | 'minimal' | 'modern' | 'retro' | 'sport';
  colors: ClockColors;
  logo: ClockLogo;
  logoY: number;    // 아날로그 로고 세로 위치 (SVG viewBox 기준, 기본 62)
  logoSize: number; // 로고 크기 % (기본 100)
  seconds: boolean;
  date: boolean;
  numerals: boolean;
  h24: boolean;
  ampmInline: boolean;
  font: string;
  tz: string;
  title: string;
}

export const DEFAULT_CONFIG: ClockConfig = {
  type: 'analog',
  clockFace: 'classic',
  colors: {
    bg: '#0e0e12',
    face: '#3a3a4a',
    tick: '#9a9aa8',
    hand: '#ededf2',
    accent: '#6c63ff',
    text: '#ededf2',
  },
  logo: { kind: 'none', value: '' },
  logoY: 62,
  logoSize: 100,
  seconds: true,
  date: false,
  numerals: true,
  h24: false,
  ampmInline: false,
  font: "-apple-system, 'Pretendard', sans-serif",
  tz: 'local',
  title: '',
};

export interface Preset {
  name: string;
  colors: ClockColors;
}

export const PRESETS: Preset[] = [
  { name: '다크', colors: { bg: '#0e0e12', face: '#3a3a4a', tick: '#9a9aa8', hand: '#ededf2', accent: '#6c63ff', text: '#ededf2' } },
  { name: '라이트', colors: { bg: '#f5f5f7', face: '#c9c9d1', tick: '#6b6b78', hand: '#1a1a22', accent: '#e2453c', text: '#1a1a22' } },
  { name: '미드나잇', colors: { bg: '#0a1929', face: '#1c4566', tick: '#5b89b3', hand: '#e8f1ff', accent: '#36c2ff', text: '#e8f1ff' } },
  { name: '포레스트', colors: { bg: '#10231a', face: '#2c5440', tick: '#6fae8c', hand: '#eafff3', accent: '#2dd47f', text: '#eafff3' } },
  { name: '선셋', colors: { bg: '#1a0f14', face: '#56242f', tick: '#c97a8c', hand: '#fff0f3', accent: '#ff6f91', text: '#fff0f3' } },
  { name: '모노', colors: { bg: '#161616', face: '#444444', tick: '#888888', hand: '#fafafa', accent: '#fafafa', text: '#fafafa' } },
  { name: '골드', colors: { bg: '#15130d', face: '#6b5a2c', tick: '#c2a45a', hand: '#fff7e0', accent: '#ffcb47', text: '#fff7e0' } },
  { name: '오션', colors: { bg: '#041520', face: '#0c3d6b', tick: '#4a9eca', hand: '#ddf0ff', accent: '#00c8ff', text: '#ddf0ff' } },
  { name: '로즈', colors: { bg: '#1a0812', face: '#5c1a3a', tick: '#c97aa0', hand: '#fff0f6', accent: '#ff4d8f', text: '#fff0f6' } },
  { name: '민트', colors: { bg: '#041a18', face: '#0d4a40', tick: '#3dbfa8', hand: '#e0fff8', accent: '#00e8c8', text: '#e0fff8' } },
  { name: '라벤더', colors: { bg: '#120f1e', face: '#3a2f6e', tick: '#9a8fcc', hand: '#f2eeff', accent: '#b89aff', text: '#f2eeff' } },
  { name: '커피', colors: { bg: '#120c06', face: '#4a2e12', tick: '#a07050', hand: '#fff0e0', accent: '#c8783c', text: '#fff0e0' } },
];

export const TIMEZONES: [string, string][] = [
  ['local', '기기 시간 (자동)'],
  ['Asia/Seoul', '서울 (KST)'],
  ['Asia/Tokyo', '도쿄'],
  ['Asia/Shanghai', '상하이/베이징'],
  ['Asia/Singapore', '싱가포르'],
  ['Europe/London', '런던'],
  ['Europe/Paris', '파리/베를린'],
  ['America/New_York', '뉴욕'],
  ['America/Los_Angeles', '로스앤젤레스'],
  ['America/Chicago', '시카고'],
  ['Australia/Sydney', '시드니'],
  ['UTC', 'UTC'],
];

export const FONTS: [string, string][] = [
  ["-apple-system, 'Pretendard', sans-serif", '기본 (산세리프)'],
  ["'Helvetica Neue', Arial, sans-serif", '헬베티카'],
  ["'Century Gothic', 'Futura', sans-serif", '기하학적'],
  ["'Courier New', monospace", '모노스페이스'],
  ["'Lucida Console', Monaco, monospace", '루시다 콘솔'],
  ["Georgia, 'Times New Roman', serif", '세리프'],
  ["'Palatino Linotype', Palatino, serif", '팔라티노'],
  ["'Arial Black', sans-serif", '두꺼운 산세리프'],
  ["'Impact', sans-serif", '임팩트'],
];
