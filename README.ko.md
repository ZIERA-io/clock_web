# Tempus

브라우저에서 바로 쓰는 커스터마이즈 시계입니다. 색상, 폰트, 시계 디자인, 로고를 원하는 대로 설정하고 링크 하나로 공유할 수 있습니다. 설정이 URL 안에 통째로 담겨 있어서 계정이나 서버가 따로 필요 없습니다.

## 기능

- 아날로그 / 디지털 모드 전환
- 아날로그 페이스 5종 — 클래식, 미니멀, 모던, 레트로, 스포츠
- 배경, 시계판, 눈금, 바늘, 강조색, 텍스트 6가지 색상 개별 조정
- 로고 설정 — 텍스트/이모지, 이미지 URL, 파일 업로드
- 설정을 URL 해시에 인코딩해 공유 — 계정 불필요
- Supabase 연결 시 `/a/이름` 형태 단축 링크 지원
- 전체화면, 타임존, 24시간제, 날짜·초침, 폰트 선택

## 시작하기

```bash
npm install
npm run dev
```

http://localhost:5173 에서 확인하세요.

## 빌드

```bash
npm run build
```

결과물은 `dist/` 폴더에 생성됩니다.

## 단축 링크 (선택 사항)

기본 공유 방식은 URL 해시입니다. 이미지를 업로드하면 링크가 길어지는데, `/a/이름` 형식의 단축 링크를 쓰려면 Supabase를 연결하면 됩니다.

```env
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

필요한 SQL 스키마는 `.env.example`을 참고하세요.

## 배포

`vercel.json`에 `/a/*` 경로 처리가 포함되어 있습니다.

```bash
npx vercel --prod
```

## 기술 스택

Vite · React 18 · TypeScript · Supabase (선택)

---

[English](README.md) · [日本語](README.ja.md)
