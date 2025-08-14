export default function SignupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="overflow-y-auto h-screen grid md:grid-cols-[0.4fr_1fr] grid-cols-1">
      {children}
    </div>
  );
}
