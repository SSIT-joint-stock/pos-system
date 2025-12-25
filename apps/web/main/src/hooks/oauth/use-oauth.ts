'use client';

export function useOauth() {
  const callBackGoogle = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth/google/callback`;
  };
  return { callBackGoogle };
}
