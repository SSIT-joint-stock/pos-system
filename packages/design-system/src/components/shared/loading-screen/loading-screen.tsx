'use client';
import { LoadingOverlay } from '@mantine/core';

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center w-screen h-screen z-50">
      <LoadingOverlay
        visible={true}
        zIndex={9999}
        overlayProps={{ blur: 2 }}
        loaderProps={{ color: '#3b82f6', size: 'md' }}
      />
      {/* Loading... */}
    </div>
  );
}
