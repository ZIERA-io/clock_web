import { useState, useCallback } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) { setError('이메일 또는 비밀번호가 올바르지 않습니다'); return; }
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.auth.signUp({ email, password });
      if (err) { setError(err.message); return; }
      if (data.user) setUser(data.user);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  return { user, loading, error, login, signup, logout };
}
