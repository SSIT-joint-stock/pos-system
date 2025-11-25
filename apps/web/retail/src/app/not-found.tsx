'use client';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NotFound404() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
      <style>{`
        @keyframes blink {
          0%, 90%, 100% {
            height: 8px;
          }
          95% {
            height: 2px;
          }
        }
        
       
        
        @keyframes wobble {
          0%, 100% {
            transform: rotate(-2deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }
        
        .eye-left {
          animation: blink 3s infinite;
        }
        
        .eye-right {
          animation: blink 3s infinite 0.1s;
        }
        
        .mouth {
          animation: sad-mouth 2.5s ease-in-out infinite;
          transform-origin: center;
        }
        
        .face-icon {
          animation: wobble 3s ease-in-out infinite;
        }
      `}</style>

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

        {/* Animated Sad Face Illustration */}
        <div className="my-8 flex justify-center">
          <svg
            className="w-48 h-48 text-blue-400 face-icon"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Face Circle */}
            <circle
              cx="100"
              cy="100"
              r="85"
              stroke="currentColor"
              strokeWidth="3"
              fill="rgba(59, 130, 246, 0.05)"
            />

            {/* Left Eye */}
            <g>
              <rect
                x="64"
                y="88"
                width="12"
                height="8"
                rx="2"
                fill="currentColor"
                className="eye-left"
              />
            </g>

            {/* Right Eye */}
            <g>
              <rect
                x="124"
                y="88"
                width="12"
                height="8"
                rx="2"
                fill="currentColor"
                className="eye-right"
              />
            </g>

            {/* Sad Mouth - Upside Down Arc */}
            <g className="mouth">
              <path
                d="M 75 135 Q 100 120 125 135"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Tears */}
            {/* Decorative Sweat Drop */}
          </svg>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => router.back()}
          className="inline-flex text-sm cursor-pointer items-center gap-3 bg-pos-blue-500 hover:bg-pos-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <ArrowLeft size={20} />
          <span>Trở về trang chủ</span>
        </button>

        {/* Additional Links */}
        <div className="mt-6 space-y-4">
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
