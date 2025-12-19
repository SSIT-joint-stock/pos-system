import React from 'react';

export default function DashboardViewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex flex-col h-full gap-5">{children}</div>;
}
