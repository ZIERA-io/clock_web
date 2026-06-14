import { useEffect, useRef } from 'react';

export function useWakeLock(active: boolean) {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!active) {
      sentinelRef.current?.release();
      sentinelRef.current = null;
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.remove();
        videoRef.current = null;
      }
      return;
    }

    let cancelled = false;

    async function acquire() {
      if (cancelled) return;

      // 1. Wake Lock API (최신 브라우저)
      if ('wakeLock' in navigator) {
        try {
          sentinelRef.current = await navigator.wakeLock.request('screen');
          return;
        } catch {
          // 권한 거부 또는 미지원 → 폴백
        }
      }

      // 2. 보이지 않는 캔버스 스트림 비디오 (구형 TV 브라우저 폴백)
      if (!videoRef.current && !cancelled) {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx?.fillRect(0, 0, 1, 1);
        const stream = canvas.captureStream(1);
        const video = document.createElement('video');
        video.srcObject = stream;
        video.muted = true;
        video.loop = true;
        video.style.cssText =
          'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0.01;pointer-events:none;';
        document.body.appendChild(video);
        video.play().catch(() => {});
        videoRef.current = video;
      }
    }

    acquire();

    // 탭이 다시 포그라운드로 올 때 Wake Lock 재취득 (스펙 요구사항)
    const onVisibility = () => {
      if (document.visibilityState === 'visible') acquire();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibility);
      sentinelRef.current?.release();
      sentinelRef.current = null;
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.remove();
        videoRef.current = null;
      }
    };
  }, [active]);
}
