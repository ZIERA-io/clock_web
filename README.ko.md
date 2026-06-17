<div align="center">

# 🕐 Tableclock

**디스플레이, TV 월, 사무실 화면을 위한 커스터마이즈 시계.**

[![라이브 데모](https://img.shields.io/badge/Live%20Demo-tableclock.io-000?style=for-the-badge&logo=vercel)](https://tableclock.io)
&nbsp;
[![Vercel로 배포](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ZIERA-io/Tableclock)

![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white)

</div>

---

시계를 디자인하고 링크로 공유하세요. 앱도, 계정도 필요 없습니다 — 모든 설정이 URL 안에 담겨 있습니다.

Supabase를 연결하면 `tableclock.io/studio` 처럼 짧은 링크와 서버 로고 업로드를 사용할 수 있습니다.

---

## 기능

### 🕰️ 시계
| | |
|---|---|
| **종류** | 아날로그 / 디지털 |
| **아날로그 스타일** | 클래식 · 미니멀 · 모던 · 레트로 · 스포츠 |
| **크기 조정** | 40–130% |
| **시간 옵션** | 타임존, 24시간제, 초침, 날짜 |

### 🎨 디자인
| | |
|---|---|
| **테마** | 12가지 프리셋 |
| **색상** | 배경 · 시계판 · 눈금 · 바늘 · 강조색 · 텍스트 6종 개별 조정 |
| **로고** | 텍스트/이모지, 이미지 URL, 파일 업로드 |
| **디지털 폰트** | 9종 선택 |

### 🔗 공유
- 모든 설정이 URL 해시에 인코딩 — 백엔드 없이 공유 가능
- Supabase 연결 시 `tableclock.io/이름` 단축 링크
- 업로드 이미지는 Supabase Storage에 저장되어 URL로 서빙

### 🌐 UI & 언어
- 한국어 · 영어 · 일본어 · 중국어 지원
- 3초 무조작 시 컨트롤 자동 페이드

### 📺 TV · 디스플레이 전용 기능
- **Wake Lock API** — 화면 꺼짐 방지, 스크린세이버 불필요
- **네이티브 Fullscreen API** — 버튼 하나로 전체화면
- 유휴 상태에서 컨트롤 사라짐 — 로비·회의실 화면에 바로 사용 가능

---

## 시작하기

```bash
git clone https://github.com/ZIERA-io/Tableclock.git
cd Tableclock
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173) 에서 확인. 시계 화면을 클릭하면 설정 패널이 열립니다.

```bash
npm run build   # 결과물 → dist/
```

---

## 단축 링크 설정 (선택)

Supabase 없이도 URL 해시 방식으로 공유할 수 있습니다. 단축 링크와 서버 이미지 저장이 필요하면 Supabase를 연결하세요.

**1. 프로젝트 생성** — [supabase.com](https://supabase.com)

**2. `.env` 파일 작성:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**3. SQL 스키마 실행** — Supabase SQL 에디터에서 ([`.env.example`](.env.example) 참고)

**4. `logos` 스토리지 버킷 생성** — 공개 버킷, INSERT 정책 `true`

설정 완료 후:
- **링크 이름** 입력란에 원하는 이름 입력 (예: `studio`)
- **저장** 클릭 → `https://tableclock.io/studio` 생성
- 중복 이름은 오류로 거부됨; 익명 링크는 이후 수정 불가

---

## 배포

```bash
npx vercel --prod
```

`vercel.json`에 단축 링크 라우팅이 포함되어 있습니다. 단축 링크 사용 시 Vercel 환경 변수에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`를 추가하세요.

---

## 기술 스택

| 레이어 | 기술 |
|---|---|
| 프론트엔드 | Vite · React 18 · TypeScript |
| 시계 렌더링 | SVG + `requestAnimationFrame` (60fps, React 재렌더 없음) |
| 백엔드 (선택) | Supabase (Postgres + Storage) |
| 호스팅 | Vercel |
| 애널리틱스 | Vercel Analytics |

---

## 만든 사람들

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Hael-o">
        <img src="https://avatars.githubusercontent.com/Hael-o?v=4" width="80px" alt="Hael-o" style="border-radius:50%"/><br/>
        <sub><b>Hael-o</b></sub>
      </a><br/>
      프론트엔드
    </td>
    <td align="center">
      <a href="https://github.com/sera03">
        <img src="https://avatars.githubusercontent.com/sera03?v=4" width="80px" alt="sera03" style="border-radius:50%"/><br/>
        <sub><b>sera03</b></sub>
      </a><br/>
      백엔드
    </td>
    <td align="center">
      <a href="https://github.com/Dev-minu">
        <img src="https://avatars.githubusercontent.com/Dev-minu?v=4" width="80px" alt="Dev-minu" style="border-radius:50%"/><br/>
        <sub><b>Dev-minu</b></sub>
      </a><br/>
      디자인 & 기획
    </td>
  </tr>
</table>

---

[English](README.md) · [日本語](README.ja.md)
