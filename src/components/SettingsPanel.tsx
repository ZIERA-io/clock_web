import { useRef, useState } from 'react';
import { ClockConfig, ClockColors, ClockLogo, PRESETS, TIMEZONES, FONTS } from '../types';
import { SUPABASE_CONFIGURED } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useCustomLink, validateSlug } from '../hooks/useCustomLink';

interface Props {
  config: ClockConfig;
  open: boolean;
  onClose: () => void;
  onUpdate: (patch: Partial<ClockConfig>) => void;
  onUpdateColors: (patch: Partial<ClockColors>) => void;
  onUpdateLogo: (patch: Partial<ClockLogo>) => void;
  encodeToUrl: () => string;
  pushToHash: () => void;
  currentSlug: string | null;
  setCurrentSlug: (slug: string | null) => void;
}

export function SettingsPanel({
  config,
  open,
  onClose,
  onUpdate,
  onUpdateColors,
  onUpdateLogo,
  encodeToUrl,
  pushToHash,
  currentSlug,
  setCurrentSlug,
}: Props) {
  const isAnalog = config.type === 'analog';

  // ── 로그인 상태
  const { user, loading: authLoading, error: authError, login, signup, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  // ── 커스텀 링크
  const { checking, available, saving, savedSlug, checkSlug, saveLink } = useCustomLink();
  const [slugInput, setSlugInput] = useState(currentSlug ?? '');
  const [slugError, setSlugError] = useState<string | null>(null);
  const [customLinkUrl, setCustomLinkUrl] = useState<string | null>(
    currentSlug ? `${location.origin}/#s=${currentSlug}` : null,
  );

  // ── 토스트
  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── 일반 링크 박스
  const [linkUrl, setLinkUrl] = useState('');

  function showToast(msg: string) {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    setToastVisible(true);
    toastTimerRef.current = setTimeout(() => setToastVisible(false), 2500);
  }

  async function handleLogin() {
    await login(email, pw);
    if (!authError) setLoginOpen(false);
  }

  async function handleSignup() {
    await signup(email, pw);
    if (!authError) { setLoginOpen(false); showToast('가입 완료! 로그인되었습니다'); }
  }

  function handleMakeLink() {
    let url = encodeToUrl();
    // 로그인 없이 이름이 있으면 URL에 n= 파라미터 추가
    if (slugInput && !(SUPABASE_CONFIGURED && user)) {
      url = `${url}&n=${encodeURIComponent(slugInput)}`;
    }
    pushToHash();
    setLinkUrl(url);
    if (url.length > 1900) {
      showToast('링크가 깁니다 — 업로드 이미지 대신 URL 사용을 권장합니다');
      return;
    }
    navigator.clipboard?.writeText(url)
      .then(() => showToast('링크가 복사되었습니다'))
      .catch(() => showToast('복사 실패 — 직접 선택해 복사하세요'));
  }

  function handleSlugInput(val: string) {
    const lower = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlugInput(lower);
    setSlugError(validateSlug(lower));
    checkSlug(lower);
  }

  async function handleSaveLink() {
    const err = validateSlug(slugInput);
    if (err) { setSlugError(err); return; }
    try {
      const url = await saveLink(slugInput, config, user);
      setCustomLinkUrl(url);
      setCurrentSlug(slugInput);
      history.replaceState(null, '', `/a/${slugInput}`);
      navigator.clipboard?.writeText(url)
        .then(() => showToast('커스텀 링크 저장 & 복사 완료!'))
        .catch(() => showToast('링크 저장 완료!'));
    } catch (e) {
      showToast(e instanceof Error ? e.message : '저장 실패');
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 700 * 1024) showToast('이미지가 너무 큽니다 (700KB 이하 권장)');
    const reader = new FileReader();
    reader.onload = () => onUpdateLogo({ kind: 'image', value: reader.result as string });
    reader.readAsDataURL(f);
  }

  function handleEnterFs() {
    onClose();
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  }

  // slug 중복 확인 상태 문자열
  function slugStatusText() {
    if (!slugInput) return '';
    if (slugError) return slugError;
    if (checking) return '확인 중…';
    if (available === true) return '✓ 사용 가능';
    if (available === false) return savedSlug === slugInput ? '✓ 내 링크' : '✗ 이미 사용 중';
    return '';
  }

  function slugStatusClass() {
    if (available === true || savedSlug === slugInput) return 'hint ok';
    if (available === false && savedSlug !== slugInput) return 'hint err';
    return 'hint';
  }

  return (
    <>
      <aside className={`panel${open ? '' : ' hidden'}`}>
        {/* ── 헤더 */}
        <div className="panelHead">
          <div>
            <h1>시계 설정</h1>
            <div className="sub">디자인하고 링크로 공유하세요</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {SUPABASE_CONFIGURED && !user && (
              <button
                className="btn ghost sm"
                onClick={() => setLoginOpen((o) => !o)}
                style={{ position: 'static', height: 'auto', borderRadius: 8 }}
              >
                로그인
              </button>
            )}
            {SUPABASE_CONFIGURED && user && (
              <button
                className="btn ghost sm"
                onClick={logout}
                style={{ position: 'static', height: 'auto', borderRadius: 8 }}
              >
                로그아웃
              </button>
            )}
            <button
              className="fab"
              style={{ position: 'static', width: 34, height: 34, fontSize: 16 }}
              onClick={onClose}
              aria-label="닫기"
            >✕</button>
          </div>
        </div>

        <div className="panelBody">

          {/* ── 로그인 폼 (Supabase 설정 시에만 표시) */}
          {SUPABASE_CONFIGURED && loginOpen && !user && (
            <div className="loginSection">
              {user ? null : (
                <>
                  <div className="loginRow">
                    <input
                      type="email"
                      placeholder="이메일 (아이디)"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <input
                      type="password"
                      placeholder="비밀번호"
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <button
                      className="btn primary sm"
                      onClick={handleLogin}
                      disabled={authLoading}
                    >
                      {authLoading ? '…' : '로그인'}
                    </button>
                    <button
                      className="btn ghost sm"
                      onClick={handleSignup}
                      disabled={authLoading}
                    >
                      회원가입
                    </button>
                  </div>
                  {authError && <div className="hint err" style={{ marginTop: 6 }}>{authError}</div>}
                </>
              )}
            </div>
          )}

          {/* 로그인된 경우 이메일 표시 */}
          {SUPABASE_CONFIGURED && user && (
            <div className="loginSection" style={{ marginBottom: 22 }}>
              <div className="loginStatus">
                <span className="loginEmail">👤 {user.email}</span>
                <span className="hint">로그인됨</span>
              </div>
            </div>
          )}

          {/* ── 시계 종류 */}
          <div className="group">
            <span className="label">시계 종류</span>
            <div className="seg">
              {(['analog', 'digital'] as const).map((t) => (
                <button
                  key={t}
                  className={config.type === t ? 'active' : ''}
                  onClick={() => onUpdate({ type: t })}
                >
                  {t === 'analog' ? '아날로그' : '디지털'}
                </button>
              ))}
            </div>
          </div>

          {/* ── 아날로그 시계 디자인 */}
          {isAnalog && (
            <div className="group">
              <span className="label">시계 디자인</span>
              <div className="seg">
                {(['classic', 'minimal', 'modern', 'retro', 'sport'] as const).map((f) => (
                  <button
                    key={f}
                    className={(config.clockFace ?? 'classic') === f ? 'active' : ''}
                    onClick={() => onUpdate({ clockFace: f })}
                  >
                    {{ classic: '클래식', minimal: '미니멀', modern: '모던', retro: '레트로', sport: '스포츠' }[f]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── 테마 프리셋 */}
          <div className="group">
            <span className="label">테마 프리셋</span>
            <div className="themeRow">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  className="swatch"
                  title={p.name}
                  style={{
                    background: p.colors.bg,
                    borderColor: p.colors.accent,
                    boxShadow: `inset 0 0 0 4px ${p.colors.accent}22`,
                  }}
                  onClick={() => onUpdateColors(p.colors)}
                />
              ))}
            </div>
          </div>

          {/* ── 색상 */}
          <div className="group">
            <span className="label">색상</span>
            {(
              [
                ['bg', '배경'],
                ['face', '시계판 테두리'],
                ['tick', '눈금 / 숫자'],
                ['hand', '시·분침'],
                ['accent', '초침 / 강조'],
                ['text', '텍스트 (디지털)'],
              ] as [keyof ClockColors, string][]
            ).map(([key, label]) => (
              <div className="colorRow" key={key}>
                <span>{label}</span>
                <input
                  type="color"
                  value={config.colors[key]}
                  onChange={(e) => onUpdateColors({ [key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          {/* ── 중앙 로고 */}
          <div className="group">
            <span className="label">중앙 로고</span>
            <div className="field">
              <div className="seg" style={{ marginBottom: 10 }}>
                {(['none', 'text', 'url', 'image'] as const).map((k) => (
                  <button
                    key={k}
                    className={config.logo.kind === k ? 'active' : ''}
                    onClick={() =>
                      onUpdateLogo({ kind: k, value: k === 'none' ? '' : config.logo.value })
                    }
                  >
                    {{ none: '없음', text: '텍스트', url: 'URL', image: '업로드' }[k]}
                  </button>
                ))}
              </div>
            </div>
            {config.logo.kind === 'text' && (
              <div className="field">
                <input
                  type="text"
                  value={config.logo.value}
                  onChange={(e) => onUpdateLogo({ value: e.target.value })}
                  placeholder="예: AG  또는  🕒"
                  maxLength={12}
                />
              </div>
            )}
            {config.logo.kind === 'url' && (
              <div className="field">
                <input
                  type="text"
                  value={config.logo.value}
                  onChange={(e) => onUpdateLogo({ value: e.target.value.trim() })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            )}
            {config.logo.kind === 'image' && (
              <div className="field">
                <label className="uploadBtn">
                  ⬆ 이미지 파일 선택
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            )}
            {/* 아날로그 전용: 로고 세로 위치 */}
            {isAnalog && config.logo.kind !== 'none' && config.logo.value && (
              <div className="field">
                <label>로고 세로 위치 (아날로그)</label>
                <input
                  type="range"
                  min={30}
                  max={165}
                  step={5}
                  value={config.logoY}
                  onChange={(e) => onUpdate({ logoY: Number(e.target.value) })}
                />
                <div className="hint">
                  현재 {config.logoY} — 기본 62 (12시 방향 위)
                  {config.logoY >= 85 && config.logoY <= 115 && ' ⚠ 바늘과 겹칠 수 있음'}
                </div>
              </div>
            )}
            {/* 공통: 로고 크기 */}
            {config.logo.kind !== 'none' && config.logo.value && (
              <div className="field">
                <label>로고 크기 ({config.logoSize}%)</label>
                <input
                  type="range"
                  min={40}
                  max={200}
                  step={10}
                  value={config.logoSize}
                  onChange={(e) => onUpdate({ logoSize: Number(e.target.value) })}
                />
                <div className="hint">기본 100%</div>
              </div>
            )}
          </div>

          {/* ── 옵션 */}
          <div className="group">
            <span className="label">옵션</span>
            <div className="field">
              <label>제목 / 이름 (선택)</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="예: 안티그래비티 본사"
                maxLength={40}
              />
            </div>

            {/* 공통 옵션 */}
            <div className="toggle">
              <span>초침 표시</span>
              <label className="switch">
                <input type="checkbox" checked={config.seconds}
                  onChange={(e) => onUpdate({ seconds: e.target.checked })} />
                <span className="track" />
              </label>
            </div>
            <div className="toggle">
              <span>날짜 표시</span>
              <label className="switch">
                <input type="checkbox" checked={config.date}
                  onChange={(e) => onUpdate({ date: e.target.checked })} />
                <span className="track" />
              </label>
            </div>

            {/* 아날로그 전용 옵션 */}
            {isAnalog && (
              <div className="toggle">
                <span>숫자 눈금 표시</span>
                <label className="switch">
                  <input type="checkbox" checked={config.numerals}
                    onChange={(e) => onUpdate({ numerals: e.target.checked })} />
                  <span className="track" />
                </label>
              </div>
            )}

            {/* 디지털 전용 옵션 */}
            {!isAnalog && (
              <>
                <div className="toggle">
                  <span>24시간제</span>
                  <label className="switch">
                    <input type="checkbox" checked={config.h24}
                      onChange={(e) => onUpdate({ h24: e.target.checked })} />
                    <span className="track" />
                  </label>
                </div>
                {!config.h24 && (
                  <div className="toggle">
                    <span>AM/PM 한 줄 표시</span>
                    <label className="switch">
                      <input type="checkbox" checked={config.ampmInline ?? false}
                        onChange={(e) => onUpdate({ ampmInline: e.target.checked })} />
                      <span className="track" />
                    </label>
                  </div>
                )}
                <div className="field" style={{ marginTop: 12 }}>
                  <label>폰트</label>
                  <select value={config.font} onChange={(e) => onUpdate({ font: e.target.value })}>
                    {FONTS.map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="field" style={{ marginTop: isAnalog ? 12 : 0 }}>
              <label>타임존</label>
              <select value={config.tz} onChange={(e) => onUpdate({ tz: e.target.value })}>
                {TIMEZONES.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── 공유 */}
          <div className="group">
            <span className="label">공유</span>

            {/* 링크 이름 — 항상 표시 */}
            <div className="field">
              <label>링크 이름 (선택)</label>
              <div className="slugRow">
                <input
                  type="text"
                  placeholder="예: my-clock (영소문자·숫자·하이픈)"
                  value={slugInput}
                  onChange={(e) => handleSlugInput(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: 12 }}
                />
                {/* Supabase 설정 시 항상 표시 (로그인 불필요) */}
                {SUPABASE_CONFIGURED && (
                  <button
                    className="btn primary sm"
                    onClick={handleSaveLink}
                    disabled={saving || !!validateSlug(slugInput) || available === false}
                    style={{ flexShrink: 0 }}
                  >
                    {saving ? '…' : savedSlug === slugInput ? '업데이트' : '저장'}
                  </button>
                )}
              </div>
              {/* 슬러그 상태 */}
              {slugInput && SUPABASE_CONFIGURED && (
                <div className={slugStatusClass()}>{slugStatusText()}</div>
              )}
              {slugInput && slugError && !SUPABASE_CONFIGURED && (
                <div className="hint err">{slugError}</div>
              )}
              {slugInput && !slugError && !SUPABASE_CONFIGURED && (
                <div className="hint">링크 생성 버튼을 누르면 이름이 URL에 포함됩니다</div>
              )}
              {/* 저장 후 커스텀 URL */}
              {SUPABASE_CONFIGURED && customLinkUrl && (
                <div className="linkBox" style={{ marginTop: 8 }}>
                  <textarea readOnly value={customLinkUrl} />
                </div>
              )}
            </div>

            {/* 링크 생성 버튼 */}
            <div className="actions">
              <button className="btn primary" onClick={handleMakeLink}>
                🔗 고유 링크 생성 &amp; 복사
              </button>
              <button className="btn ghost" onClick={handleEnterFs}>
                ⛶ 전체화면으로 보기
              </button>
            </div>
            {linkUrl && (
              <div className="linkBox" style={{ marginTop: 10 }}>
                <textarea readOnly value={linkUrl} />
                <div className="hint">이 링크를 열면 현재 시계가 그대로 복원됩니다.</div>
              </div>
            )}
          </div>

        </div>
      </aside>

      <div className={`toast${toastVisible ? ' show' : ''}`}>{toastMsg}</div>
    </>
  );
}
