import useAuth from '../../../../hooks/auth/use-auth';
import { Modal } from '@repo/design-system/components/ui';
import React, { useState } from 'react';
import { FormForgotPassword, FormResetPassword } from '../forms';

export default function StepResetPassword({
  isOpenModal,
  setIsOpenModal,
}: {
  isOpenModal: boolean;
  setIsOpenModal: (isOpenModal: boolean) => void;
}) {
  const [modalSteps, setModalSteps] = useState<number>(1);
  const { forgotPassword, resetPassword } = useAuth();

  const renderStepModal = () => {
    switch (modalSteps) {
      case 1:
        return (
          <FormForgotPassword
            onSubmit={async (data) => {
              const success = await forgotPassword(data);
              if (success) setModalSteps(2);
            }}
          />
        );

      case 2:
        return (
          <FormResetPassword
            setModalSteps={setModalSteps}
            onSubmit={async (data) => {
              const success = await resetPassword(data);
              if (success) {
                setModalSteps(1);
                setIsOpenModal(false);
              }
            }}
          />
        );
    }
  };
  return (
    <>
      <Modal
        closeOnClickOutside={false}
        radius="xl"
        padding="lg"
        size="lg"
        title={<p className="text-base font-semibold">Quên mật khẩu</p>}
        opened={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      >
        <>
          <h1 className="text-2xl font-semibold text-center text-gray-900">Quên mật khẩu</h1>
          <p className="mt-1 text-sm text-gray-400 text-center font-medium">
            Vui lòng nhập email bạn đăng ký trên hệ thống
          </p>
          {renderStepModal()}
        </>
      </Modal>
    </>
  );
}
