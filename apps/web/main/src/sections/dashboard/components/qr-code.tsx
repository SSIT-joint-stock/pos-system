'use client';
import { Modal } from '@repo/design-system/components/ui';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import React from 'react';

export default function QrCode({
  isOpenModalQrCode,
  customer_pay_amount,
  setIsOpenQrCode,
}: {
  isOpenModalQrCode: boolean;
  customer_pay_amount?: number;
  setIsOpenQrCode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const currentStore = useAtomValue(currentStoreAtom);
  return (
    <Modal size="lg" onClose={() => setIsOpenQrCode(false)} opened={isOpenModalQrCode}>
      <>
        {!currentStore?.qrPayment ? (
          <div className="flex items-center w-full h-32 ">
            <p className="mx-auto text-center w-1/2 text-sm text-gray-500">
              Hiện tại cửa hàng bạn có thể chưa cấu hình mô hình thanh toán QR Code. Vui lòng thử
              lại sau
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center">
              {currentStore?.qrPayment && (
                <Image
                  placeholder="blur"
                  priority
                  blurDataURL={currentStore?.qrPayment || '/qr_code_placholder.svg'}
                  src={`${currentStore?.qrPayment}&amount=${customer_pay_amount}` || ''}
                  className="object-cover"
                  alt="qr_code"
                  width={400}
                  height={400}
                />
              )}
            </div>
          </>
        )}
      </>
    </Modal>
  );
}
