'use client';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function NotFoundLayout() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-2xl">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-6xl md:text-[180px] font-bold text-pos-blue-500 drop-shadow-lg">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl bg-blue-300 opacity-20 -z-10"></div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold text-gray-800">Ối! Không tìm thấy trang</h2>

        {/* Description */}
        <p className="text-base md:text-xl text-gray-600 leading-relaxed">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex text-sm cursor-pointer items-center gap-3 bg-pos-blue-500 hover:bg-pos-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <ArrowLeft size={20} />
          <span>Trở về trang chủ</span>
        </button>

        {/* Additional Links */}
        <div className="mt-2 space-y-4">
          <p className="text-gray-500 text-sm">Hoặc thử:</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.back()}
              className="text-blue-500 hover:text-blue-600 hover:cursor-pointer  font-medium transition-colors"
            >
              Quay lại trang trước
            </button>
            <span className="text-gray-300">•</span>
            <button className="text-blue-500 hover:cursor-pointer hover:text-blue-600 font-medium transition-colors">
              Liên hệ hỗ trợ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
