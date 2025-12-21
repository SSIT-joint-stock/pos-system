import { Link2, Mail, MapPinned, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function SigninLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid md:grid-cols-[1fr_0.8fr] grid-cols-1 bg-gray-50/40 h-screen">
      <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6  ">
        {children}
      </div>
      <div className="md:flex flex-col gap-2 items-center justify-center hidden  ">
        <Image
          width={500}
          height={500}
          src={'https://app.easyposs.vn/content/img/login/background.png'}
          alt="Background"
          className="object-cover w-xl h-xl select-none pointer-events-none"
        />
        <Image
          src={'/logo-company.jpg'}
          alt="logo company"
          width={60}
          height={60}
          className="object-cover rounded-full select-none pointer-events-none"
        />
        <div className="flex gap-2 flex-col text-xs mt-2">
          <h2 className="text-pos-blue-500 font-medium  uppercase ">
            Công ty cổ phần đầu tư công nghệ và truyền thông SS-IT{' '}
          </h2>
          <span className="text-gray-500 flex items-center gap-2">
            <MapPinned size={14} /> D/C: Tầng 4, 18 Đường 18M, Mộ Lao, Hà Đông, Hà Nội, Hanoi,
            Vietnam
          </span>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 flex items-center gap-2">
              <Phone size={14} />
              097 996 64 41
            </span>
            <span className="text-gray-500 flex items-center gap-2">
              <Mail size={14} />
              ssit.company.ssit@gmail.com
            </span>
          </div>
          <div className="text-gray-500 flex items-center gap-2 transition-colors duration-300">
            <Link2 size={14} />
            Website:
            <Link
              href={'https://ssit.company'}
              className="hover:text-pos-blue-500 border-r border-r-gray-300 pr-2"
            >
              ssit.company
            </Link>
            <Link
              className="hover:text-pos-blue-500"
              href={'https://ss-it-joint-stock-company.vercel.app/'}
            >
              ss-it-joint-stock
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
