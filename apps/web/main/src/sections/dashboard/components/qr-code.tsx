/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Loading, Modal } from '@repo/design-system/components/ui';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import React, { useEffect, useTransition } from 'react';
import useStore from '../../../hooks/store/use-store';

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
  const [isPending, startTransition] = useTransition();
  const { store, getStoreDetail } = useStore();
  useEffect(() => {
    if (!currentStore?.id) return;
    if (isOpenModalQrCode) {
      startTransition(() => {
        getStoreDetail();
      });
    }
  }, [currentStore?.id, isOpenModalQrCode]);
  return (
    <Modal size="lg" onClose={() => setIsOpenQrCode(false)} opened={isOpenModalQrCode}>
      <>
        {isPending && <Loading color="#228be6" />}
        {!store?.store_payment[0].bank_qr_image_url ? (
          <div className="flex items-center w-full h-32 ">
            <p className="mx-auto text-center w-1/2 text-sm text-gray-500">
              Hiện tại cửa hàng bạn có thể chưa cấu hình mô hình thanh toán QR Code. Vui lòng thử
              lại sau
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center">
              {store?.store_payment[0].bank_qr_image_url && (
                <Image
                  placeholder="blur"
                  priority
                  blurDataURL={
                    store?.store_payment[0].bank_qr_image_url || '/qr_code_placholder.svg'
                  }
                  src={
                    `${store?.store_payment[0].bank_qr_image_url}&amount=${customer_pay_amount}` ||
                    ''
                  }
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
