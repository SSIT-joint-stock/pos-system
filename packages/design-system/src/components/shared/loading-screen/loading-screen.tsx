'use client';
import { LoadingOverlay } from '@mantine/core';

export default function LoadingScreen() {
  return (
    <div className="relative w-screen h-screen z-50">
      <LoadingOverlay visible={true} zIndex={9999} overlayProps={{ blur: 2 }} loaderProps={{ color: 'var(--color-primary)', size: 'lg' }} />
      {/* Loading... */}
    </div>
  );
}
