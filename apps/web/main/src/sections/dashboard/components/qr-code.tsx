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
      <div className="flex items-center justify-center">
        {currentStore?.bank_qr_image_url && (
          <Image
            placeholder="blur"
            priority
            blurDataURL={currentStore?.bank_qr_image_url || '/qr_code_placholder.svg'}
            src={
              `${currentStore?.bank_qr_image_url}&amount=${customer_pay_amount}&addInfo=${currentStore?.name}` ||
              ''
            }
            className="object-cover"
            alt="qr_code"
            width={400}
            height={400}
          />
        )}
      </div>
    </Modal>
  );
}
