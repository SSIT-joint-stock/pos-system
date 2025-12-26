import useAuth from '@main/hooks/auth/use-auth';
import { Button } from '@repo/design-system/components/ui';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { RouterLink } from '@repo/design-system/routes/components';
import { useCallback } from 'react';
import { FormActiveAccount, FormRegister } from '../forms';

export default function StepRegister({
  setIsActive,
  isActive,
}: {
  setIsActive: (active: number) => void;
  isActive: number;
}) {
  const { register, verifyAccount } = useAuth();
  const { showSuccessToast } = useToast();
  const handleRegister = useCallback(
    async (data: any) => {
      const success = await register(data);
      if (success) setIsActive(1);
    },
    [register, setIsActive]
  );

  const handleVerify = useCallback(
    async (data: any) => {
      const success = await verifyAccount(data);
      if (success) setIsActive(2);
    },
    [verifyAccount, setIsActive]
  );

  const renderStepContent = () => {
    switch (isActive) {
      case 0:
        return <FormRegister onSubmit={handleRegister} />;
      case 1:
        return <FormActiveAccount setActive={setIsActive} onSubmit={handleVerify} />;
      case 2:
        return (
          <RouterLink className="w-full flex" href="/auth/login">
            <Button
              onClick={() => {
                showSuccessToast('Bây giờ bạn có thể đăng nhập vào tài khoản!');
              }}
              className="flex-1"
              size="sm"
              radius="sm"
              variant="filled"
            >
              Tiếp tục
            </Button>
          </RouterLink>
        );
      default:
        return null;
    }
  };
  return renderStepContent();
}
