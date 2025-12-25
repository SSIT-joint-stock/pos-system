'use client';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
const RESEND_COOLDOWN = 30; // seconds
const STORAGE_KEY = 'resend_code_expired_at';
export function useCountDown() {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const expiredAt = localStorage.getItem(STORAGE_KEY);
    if (expiredAt) {
      const diff = dayjs(expiredAt).diff(dayjs(), 'second');
      setRemaining(diff > 0 ? diff : 0);
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining]);
  return {
    remaining,
    setRemaining,
    RESEND_COOLDOWN,
    STORAGE_KEY,
  };
}
