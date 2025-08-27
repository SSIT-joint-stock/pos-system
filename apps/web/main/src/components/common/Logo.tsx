import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/logo.jpg"
        alt="Logo"
        width={40}
        height={40}
        priority
        className="object-cover"
      />
      <span className="text-2xl font-semibold tracking-tight">EraPOS</span>
    </Link>
  );
}
