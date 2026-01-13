import { Loading } from '@repo/design-system/components/ui';

export default function DetailLayout({
  children,
  loading,
}: Readonly<{
  children: React.ReactNode;
  loading?: boolean;
}>) {
  return (
    <div className="bg-gray-50 w-full h-full mx-auto overflow-auto scrollbar-none pb-10 ">
      {loading ? (
        <div className="flex items-center justify-center h-full ">
          <Loading size="sm" color="#3b82f6" />
        </div>
      ) : (
        <div className="mx-auto  max-w-7xl h-full space-y-8">{children}</div>
      )}
    </div>
  );
}
