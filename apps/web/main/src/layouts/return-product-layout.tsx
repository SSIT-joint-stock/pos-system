import React from 'react';

export default function ReturnProductLayout({
  children,
  sidebar,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}) {
  return (
    // Thêm overflow-hidden vào container chính để an toàn
    <div className="grid grid-cols-[1fr_0.4fr] w-full h-full gap-3 overflow-hidden">
      {/* QUAN TRỌNG: Thêm 'min-w-0' (min-width: 0px).
         Nó báo cho Grid biết rằng cột này được phép co nhỏ hơn nội dung của nó.
         Khi đó thanh cuộn (scroll) của Table bên trong mới có tác dụng.
      */}
      <div className="flex-1 flex flex-col min-w-0">{children}</div>

      {/* Right Side */}
      <div className="bg-white rounded-md w-full h-full overflow-y-auto">{sidebar}</div>
    </div>
  );
}
