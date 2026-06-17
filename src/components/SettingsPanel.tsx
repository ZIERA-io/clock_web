import { useRef, useState } from 'react';
import { ClockConfig, ClockColors, ClockLogo, PRESETS, TIMEZONES, FONTS } from '../types';
import { SUPABASE_CONFIGURED, uploadLogo } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useCustomLink, validateSlug } from '../hooks/useCustomLink';
import { T, LANG_LABELS, type Lang } from '../i18n';

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
  const t = T[config.lang ?? 'ko'];

  const { user, loading: authLoading, error: authError, login, signup, logout } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const { checking, available, saving, savedSlug, checkSlug, saveLink } = useCustomLink();
  const [slugInput, setSlugInput] = useState(currentSlug ?? '');
  const [slugError, setSlugError] = useState<string | null>(null);
  const [customLinkUrl, setCustomLinkUrl] = useState<string | null>(
    currentSlug ? `${location.origin}/${currentSlug}` : null,
  );

  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [linkUrl, setLinkUrl] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);

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
    if (!authError) { setLoginOpen(false); showToast(t.signupDone); }
  }

  function handleMakeLink() {
    let url = encodeToUrl();
    if (slugInput && !(SUPABASE_CONFIGURED && user)) {
      url = `${url}&n=${encodeURIComponent(slugInput)}`;
    }
    pushToHash();
    setLinkUrl(url);
    if (url.length > 1900) {
      showToast(t.linkLong);
      return;
    }
    navigator.clipboard?.writeText(url)
      .then(() => showToast(t.copyDone))
      .catch(() => showToast(t.copyFail));
  }

  function handleSlugInput(val: string) {
    const lower = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSlugInput(lower);
    setSlugError(validateSlug(lower, t));
    checkSlug(lower);
  }

  async function handleSaveLink() {
    const err = validateSlug(slugInput, t);
    if (err) { setSlugError(err); return; }
    try {
      const url = await saveLink(slugInput, config, user);
      setCustomLinkUrl(url);
      setCurrentSlug(slugInput);
      history.replaceState(null, '', `/${slugInput}`);
      navigator.clipboard?.writeText(url)
        .then(() => showToast(t.saveDone))
        .catch(() => showToast(t.saveFail));
    } catch (e) {
      showToast(e instanceof Error ? e.message : t.saveFail);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 700 * 1024) { showToast(t.uploadTooBig); }

    if (SUPABASE_CONFIGURED) {
      setLogoUploading(true);
      try {
        const url = await uploadLogo(f);
        onUpdateLogo({ kind: 'url', value: url });
      } catch {
        showToast(t.uploadFail);
        // fallback to base64
        const reader = new FileReader();
        reader.onload = () => onUpdateLogo({ kind: 'image', value: reader.result as string });
        reader.readAsDataURL(f);
      } finally {
        setLogoUploading(false);
      }
    } else {
      const reader = new FileReader();
      reader.onload = () => onUpdateLogo({ kind: 'image', value: reader.result as string });
      reader.readAsDataURL(f);
    }
  }

  function handleEnterFs() {
    onClose();
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  }

  function slugStatusText() {
    if (!slugInput) return '';
    if (slugError) return slugError;
    if (checking) return t.checking;
    if (available === true) return t.available;
    if (available === false) return savedSlug === slugInput ? t.myLink : t.alreadyUsed;
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
            <h1>{t.title}</h1>
            <div className="sub">{t.subtitle}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {SUPABASE_CONFIGURED && !user && (
              <button
                className="btn ghost sm"
                onClick={() => setLoginOpen((o) => !o)}
                style={{ position: 'static', height: 'auto', borderRadius: 8 }}
              >
                {t.login}
              </button>
            )}
            {SUPABASE_CONFIGURED && user && (
              <button
                className="btn ghost sm"
                onClick={logout}
                style={{ position: 'static', height: 'auto', borderRadius: 8 }}
              >
                {t.logout}
              </button>
            )}
            <button
              className="fab"
              style={{ position: 'static', width: 34, height: 34, fontSize: 16 }}
              onClick={onClose}
              aria-label="close"
            >✕</button>
          </div>
        </div>

        <div className="panelBody">

          {/* ── 로그인 폼 */}
          {SUPABASE_CONFIGURED && loginOpen && !user && (
            <div className="loginSection">
              <div className="loginRow">
                <input
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <input
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button className="btn primary sm" onClick={handleLogin} disabled={authLoading}>
                  {authLoading ? '…' : t.login}
                </button>
                <button className="btn ghost sm" onClick={handleSignup} disabled={authLoading}>
                  {t.signup}
                </button>
              </div>
              {authError && <div className="hint err" style={{ marginTop: 6 }}>{authError}</div>}
            </div>
          )}

          {SUPABASE_CONFIGURED && user && (
            <div className="loginSection" style={{ marginBottom: 22 }}>
              <div className="loginStatus">
                <span className="loginEmail">👤 {user.email}</span>
                <span className="hint">{t.loggedIn}</span>
              </div>
            </div>
          )}

          {/* ── 시계 종류 */}
          <div className="group">
            <span className="label">{t.clockType}</span>
            <div className="seg">
              {(['analog', 'digital'] as const).map((type) => (
                <button
                  key={type}
                  className={config.type === type ? 'active' : ''}
                  onClick={() => onUpdate({ type })}
                >
                  {type === 'analog' ? t.analog : t.digital}
                </button>
              ))}
            </div>
          </div>

          {/* ── 아날로그 시계 디자인 */}
          {isAnalog && (
            <div className="group">
              <span className="label">{t.clockDesign}</span>
              <div className="seg">
                {(['classic', 'minimal', 'modern', 'retro', 'sport'] as const).map((f) => (
                  <button
                    key={f}
                    className={(config.clockFace ?? 'classic') === f ? 'active' : ''}
                    onClick={() => onUpdate({ clockFace: f })}
                  >
                    {t[f as 'classic' | 'minimal' | 'modern' | 'retro' | 'sport']}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── 테마 프리셋 */}
          <div className="group">
            <span className="label">{t.themePreset}</span>
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
            <span className="label">{t.colors}</span>
            {(
              [
                ['bg', t.colorBg],
                ['face', t.colorFace],
                ['tick', t.colorTick],
                ['hand', t.colorHand],
                ['accent', t.colorAccent],
                ['text', t.colorText],
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
            <span className="label">{t.logo}</span>
            <div className="field">
              <div className="seg" style={{ marginBottom: 10 }}>
                {(['none', 'text', 'url', 'image'] as const).map((k) => (
                  <button
                    key={k}
                    className={config.logo.kind === k ? 'active' : ''}
                    onClick={() => onUpdateLogo({ kind: k, value: k === 'none' ? '' : config.logo.value })}
                  >
                    {{ none: t.none, text: t.textKind, url: t.url, image: t.image }[k]}
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
                  placeholder={t.logoTextPlaceholder}
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
                  placeholder={t.logoUrlPlaceholder}
                />
              </div>
            )}
            {config.logo.kind === 'image' && (
              <div className="field">
                <label className="uploadBtn">
                  {logoUploading ? t.uploading : t.uploadBtn}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={logoUploading}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            )}
            {isAnalog && config.logo.kind !== 'none' && config.logo.value && (
              <div className="field">
                <label>{t.logoY}</label>
                <input
                  type="range" min={30} max={165} step={5}
                  value={config.logoY}
                  onChange={(e) => onUpdate({ logoY: Number(e.target.value) })}
                />
                <div className="hint">
                  {config.logoY} — {t.logoYDefault}
                  {config.logoY >= 85 && config.logoY <= 115 && ` ${t.logoYWarning}`}
                </div>
              </div>
            )}
            {config.logo.kind !== 'none' && config.logo.value && (
              <div className="field">
                <label>{t.logoSize} ({config.logoSize}%)</label>
                <input
                  type="range" min={40} max={200} step={10}
                  value={config.logoSize}
                  onChange={(e) => onUpdate({ logoSize: Number(e.target.value) })}
                />
                <div className="hint">{t.logoSizeDefault}</div>
              </div>
            )}
          </div>

          {/* ── 옵션 */}
          <div className="group">
            <span className="label">{t.options}</span>

            <div className="field">
              <label>{t.titleLabel}</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder={t.titlePlaceholder}
                maxLength={40}
              />
            </div>

            {/* 시계 크기 */}
            <div className="field">
              <label>{t.clockSize} ({config.clockScale ?? 100}%)</label>
              <input
                type="range" min={40} max={130} step={5}
                value={config.clockScale ?? 100}
                onChange={(e) => onUpdate({ clockScale: Number(e.target.value) })}
              />
            </div>

            <div className="toggle">
              <span>{t.showSeconds}</span>
              <label className="switch">
                <input type="checkbox" checked={config.seconds}
                  onChange={(e) => onUpdate({ seconds: e.target.checked })} />
                <span className="track" />
              </label>
            </div>
            <div className="toggle">
              <span>{t.showDate}</span>
              <label className="switch">
                <input type="checkbox" checked={config.date}
                  onChange={(e) => onUpdate({ date: e.target.checked })} />
                <span className="track" />
              </label>
            </div>

            {isAnalog && (
              <div className="toggle">
                <span>{t.showNumerals}</span>
                <label className="switch">
                  <input type="checkbox" checked={config.numerals}
                    onChange={(e) => onUpdate({ numerals: e.target.checked })} />
                  <span className="track" />
                </label>
              </div>
            )}

            {!isAnalog && (
              <>
                <div className="toggle">
                  <span>{t.hour24}</span>
                  <label className="switch">
                    <input type="checkbox" checked={config.h24}
                      onChange={(e) => onUpdate({ h24: e.target.checked })} />
                    <span className="track" />
                  </label>
                </div>
                {!config.h24 && (
                  <div className="toggle">
                    <span>{t.ampmInline}</span>
                    <label className="switch">
                      <input type="checkbox" checked={config.ampmInline ?? false}
                        onChange={(e) => onUpdate({ ampmInline: e.target.checked })} />
                      <span className="track" />
                    </label>
                  </div>
                )}
                <div className="field" style={{ marginTop: 12 }}>
                  <label>{t.font}</label>
                  <select value={config.font} onChange={(e) => onUpdate({ font: e.target.value })}>
                    {FONTS.map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="field" style={{ marginTop: isAnalog ? 12 : 0 }}>
              <label>{t.timezone}</label>
              <select value={config.tz} onChange={(e) => onUpdate({ tz: e.target.value })}>
                {TIMEZONES.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>{t.language}</label>
              <select value={config.lang ?? 'ko'} onChange={(e) => onUpdate({ lang: e.target.value as Lang })}>
                {LANG_LABELS.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ── 공유 */}
          <div className="group">
            <span className="label">{t.share}</span>

            <div className="field">
              <label>{t.linkName}</label>
              <div className="slugRow">
                <input
                  type="text"
                  placeholder={t.linkNamePlaceholder}
                  value={slugInput}
                  onChange={(e) => handleSlugInput(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: 12 }}
                />
                {SUPABASE_CONFIGURED && (
                  <button
                    className="btn primary sm"
                    onClick={handleSaveLink}
                    disabled={saving || !!validateSlug(slugInput, t) || available === false}
                    style={{ flexShrink: 0 }}
                  >
                    {saving ? '…' : savedSlug === slugInput ? t.update : t.save}
                  </button>
                )}
              </div>
              {slugInput && SUPABASE_CONFIGURED && (
                <div className={slugStatusClass()}>{slugStatusText()}</div>
              )}
              {slugInput && slugError && !SUPABASE_CONFIGURED && (
                <div className="hint err">{slugError}</div>
              )}
              {slugInput && !slugError && !SUPABASE_CONFIGURED && (
                <div className="hint">{t.linkNameHint}</div>
              )}
              {SUPABASE_CONFIGURED && customLinkUrl && (
                <div className="linkBox" style={{ marginTop: 8 }}>
                  <textarea readOnly value={customLinkUrl} />
                </div>
              )}
            </div>

            <div className="actions">
              <button className="btn primary" onClick={handleMakeLink}>
                {t.makeLink}
              </button>
              <button className="btn ghost" onClick={handleEnterFs}>
                {t.enterFullscreen}
              </button>
            </div>
            {linkUrl && (
              <div className="linkBox" style={{ marginTop: 10 }}>
                <textarea readOnly value={linkUrl} />
                <div className="hint">{t.linkRestoreHint}</div>
              </div>
            )}
          </div>

        </div>
      </aside>

      <div className={`toast${toastVisible ? ' show' : ''}`}>{toastMsg}</div>
    </>
  );
}
