import { useState, useCallback, useRef } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { ClockConfig } from '../types';

const SLUG_RE = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;

export function validateSlug(slug: string): string | null {
  if (!slug) return '링크 이름을 입력하세요';
  if (slug.length < 3) return '3자 이상 입력하세요';
  if (slug.length > 50) return '50자 이하로 입력하세요';
  if (!SLUG_RE.test(slug)) return '영소문자·숫자·하이픈만 사용 가능, 첫/끝 문자는 영숫자';
  return null;
}

export function useCustomLink() {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkSlug = useCallback((slug: string) => {
    setAvailable(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!supabase || validateSlug(slug)) return;
    debounceRef.current = setTimeout(async () => {
      setChecking(true);
      try {
        const { data } = await supabase!
          .from('links')
          .select('slug')
          .eq('slug', slug)
          .maybeSingle();
        setAvailable(data === null);
      } finally {
        setChecking(false);
      }
    }, 400);
  }, []);

  // user가 null이면 익명 저장 (생성만 가능, 수정 불가)
  const saveLink = useCallback(
    async (slug: string, config: ClockConfig, user: User | null): Promise<string> => {
      if (!supabase) throw new Error('Supabase가 설정되지 않았습니다');
      const err = validateSlug(slug);
      if (err) throw new Error(err);
      setSaving(true);
      try {
        const { data: existing } = await supabase
          .from('links')
          .select('user_id')
          .eq('slug', slug)
          .maybeSingle();

        if (existing) {
          if (existing.user_id === null) {
            throw new Error('이미 사용 중인 이름입니다 (익명으로 생성됨)');
          }
          if (!user || existing.user_id !== user.id) {
            throw new Error('이 링크 이름은 다른 사용자가 사용 중입니다');
          }
          // 본인 소유 → 설정 업데이트
          const { error } = await supabase.from('links').update({ config }).eq('slug', slug);
          if (error) throw new Error(error.message);
        } else {
          const { error } = await supabase
            .from('links')
            .insert({ slug, config, user_id: user?.id ?? null });
          if (error) throw new Error(error.message);
        }

        setSavedSlug(slug);
        return `${location.origin}/a/${slug}`;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return { checking, available, saving, savedSlug, checkSlug, saveLink };
}
