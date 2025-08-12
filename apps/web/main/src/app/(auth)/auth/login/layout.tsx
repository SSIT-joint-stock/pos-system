import { Link2, Mail, MapPinned, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SigninLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid md:grid-cols-[1fr_0.8fr] grid-cols-1 bg-gray-50/40 h-screen">
      <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto p-6  ">
        {children}
      </div>
      <div className="flex flex-col gap-2 items-center justify-center">
        <Image
          width={420}
          height={420}
          src={"https://app.easyposs.vn/content/img/login/background.png"}
          alt="Background"
          className="object-cover"
        />
        <Image
          src={
            "https://scontent.fhan2-4.fna.fbcdn.net/v/t39.30808-6/484092122_122203989488132570_8044274968978306274_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=SLuYuTnyUswQ7kNvwFSR9Zc&_nc_oc=AdkbwJznSf3KtUVlbLDZn8YY0k25bXMNs6L0QqRCNN2T6k7vfg3ixf3pw1Mvcb5HuA9LhOm9TAbZ42vm3N0KnBxF&_nc_zt=23&_nc_ht=scontent.fhan2-4.fna&_nc_gid=XflfK3M851wZf3ApR3khZQ&oh=00_AfUbplhMLmrchhvJutEMdsEH-mjthpcCrWuNcBZEIX7Upw&oe=689E88BF"
          }
          alt="logo company"
          width={60}
          height={60}
          className="object-cover rounded-full"
        />
        <div className="flex gap-2 flex-col text-xs mt-2">
          <h2 className="text-blue-500 font-medium  uppercase">
            Công ty cổ phần đầu tư công nghệ và truyền thông SS-IT{" "}
          </h2>
          <span className="text-gray-500 flex items-center gap-2">
            <MapPinned size={14} /> D/C: Tầng 4, 18 Đường 18M, Mộ Lao, Hà Đông,
            Hà Nội, Hanoi, Vietnam
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
              href={"https://ssit.company"}
              className="hover:text-blue-500 border-r border-r-gray-300 pr-2">
              ssit.company
            </Link>
            <Link
              className="hover:text-blue-500"
              href={"https://ss-it-joint-stock-company.vercel.app/"}>
              ss-it-joint-stock
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
