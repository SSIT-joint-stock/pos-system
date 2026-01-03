export default function DetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-50 w-full h-full mx-auto overflow-auto scrollbar-none pb-10 ">
      <div className="mx-auto  max-w-7xl h-full space-y-8">{children}</div>
    </div>
  );
}
