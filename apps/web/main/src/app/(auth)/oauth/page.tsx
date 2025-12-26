'use client';
import { Loading } from '@repo/design-system/components/ui';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const hasStore = searchParams?.get('hasStore') === 'true';
    if (hasStore) {
      router.replace('/oauth/select-store');
    } else {
      router.replace('/oauth/create-store');
    }
  }, [router, searchParams]);

  return (
    <div className="flex items-center gap-4 text-sm text-pos-blue-500">
      <Loading size="md" radius="sm" color="#3b82f6" />
    </div>
  );
}
