import { useState, useCallback, useEffect } from 'react';
import { ClockConfig, ClockColors, ClockLogo, DEFAULT_CONFIG } from '../types';
import { loadConfigFromSlug } from '../lib/supabase';

function encodeCfg(o: ClockConfig): string {
  const json = JSON.stringify(o);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function decodeCfg(s: string): Partial<ClockConfig> | null {
  try {
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return JSON.parse(decodeURIComponent(escape(atob(s))));
  } catch {
    return null;
  }
}

function mergeWithDefault(partial: Partial<ClockConfig>): ClockConfig {
  return {
    ...DEFAULT_CONFIG,
    ...partial,
    colors: { ...DEFAULT_CONFIG.colors, ...(partial.colors ?? {}) },
    logo: { ...DEFAULT_CONFIG.logo, ...(partial.logo ?? {}) },
  };
}

interface ParsedInit {
  config: ClockConfig;
  isSharedView: boolean;
  initSlug: string | null;
}

const PATH_SLUG_RE = /^\/([a-z0-9][a-z0-9-]{1,48}[a-z0-9])$/;

function parseInit(): ParsedInit {
  // 1) 경로 기반: /a/<slug>
  const pathMatch = location.pathname.match(PATH_SLUG_RE);
  if (pathMatch) {
    return { config: mergeWithDefault({}), isSharedView: true, initSlug: pathMatch[1] };
  }

  const hash = location.hash;

  // 2) 해시 기반 (레거시): #s=<slug>
  const slugMatch = hash.match(/[#&]s=([^&]+)/);
  if (slugMatch) {
    return { config: mergeWithDefault({}), isSharedView: true, initSlug: slugMatch[1] };
  }

  // 3) 인코딩 기반: #c=<base64> (&n=<name> 선택)
  const cfgMatch = hash.match(/c=([^&]+)/);
  const nameMatch = hash.match(/[#&]n=([^&]+)/);
  if (cfgMatch) {
    const loaded = decodeCfg(cfgMatch[1]);
    if (loaded) return {
      config: mergeWithDefault(loaded),
      isSharedView: true,
      initSlug: nameMatch ? decodeURIComponent(nameMatch[1]) : null,
    };
  }

  return { config: mergeWithDefault({}), isSharedView: false, initSlug: null };
}

export function useClockConfig() {
  const [{ isSharedView, initSlug }] = useState(parseInit);
  const [config, setConfig] = useState<ClockConfig>(() => parseInit().config);
  const [slugLoading, setSlugLoading] = useState(!!initSlug);
  const [currentSlug, setCurrentSlug] = useState<string | null>(initSlug);

  useEffect(() => {
    if (!initSlug) return;
    loadConfigFromSlug(initSlug)
      .then((loaded) => { if (loaded) setConfig(mergeWithDefault(loaded)); })
      .finally(() => setSlugLoading(false));
  }, [initSlug]);

  const update = useCallback((patch: Partial<ClockConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const updateColors = useCallback((patch: Partial<ClockColors>) => {
    setConfig((prev) => ({ ...prev, colors: { ...prev.colors, ...patch } }));
  }, []);

  const updateLogo = useCallback((patch: Partial<ClockLogo>) => {
    setConfig((prev) => ({ ...prev, logo: { ...prev.logo, ...patch } }));
  }, []);

  const encodeToUrl = useCallback(
    () => `${location.origin}/#c=${encodeCfg(config)}`,
    [config],
  );

  const pushToHash = useCallback(() => {
    history.replaceState(null, '', `/#c=${encodeCfg(config)}`);
  }, [config]);

  return {
    config, update, updateColors, updateLogo,
    encodeToUrl, pushToHash,
    isSharedView, slugLoading,
    currentSlug, setCurrentSlug,
  };
}
