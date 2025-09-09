import { RouterLink } from '@repo/design-system/routes/components';
import Image from 'next/image';
import React from 'react';

export default function Logo({ isTextWhite }: { isTextWhite?: boolean }) {
  return (
    <RouterLink href="/" className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Logo"
        width={500}
        height={500}
        priority
        className="object-cover w-16 h-16"
      />
      <span
        className={`text-2xl font-semibold tracking-tight ${isTextWhite ? 'text-white' : 'text-pos-blue-500'}`}
      >
        EraPOS
      </span>
    </RouterLink>
  );
}
