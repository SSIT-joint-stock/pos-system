import DashboardLayout from '@repo/design-system/components/layout/fnb/dashboard-layout';
export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
