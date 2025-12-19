import React from 'react';

export function IsUpdated() {
  return (
    <div className="flex items-center justify-center h-full p-4 rounded-md bg-white flex-col gap-6 ">
      <span className="text-lg font-semibold text-pos-blue-500 bg-pos-blue-50 py-2 px-4 rounded-md">
        Tính năng mới
      </span>
      <h2 className="text-3xl font-semibold">Sắp ra mắt!</h2>
      <p className="text-sm text-gray-500 w-sm text-center">
        Hiện tại chúng tôi đang phát triển tính năng này. Vui lòng quay lại sau. Xin lỗi các bạn vì
        sự bất tiện này!
      </p>
    </div>
  );
}
