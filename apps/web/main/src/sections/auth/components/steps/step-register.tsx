import { Button } from "@repo/design-system/components/ui";
import { RouterLink } from "@repo/design-system/routes/components";
import React, { useCallback, useState } from "react";
import { FormActiveAccount, FormBusinessInfo, FormRegister } from "../forms";
import useAuth from "@main/hooks/auth/useAuth";

export default function StepRegister({
  setIsActive,
  isActive,
}: {
  setIsActive: (active: number) => void;
  isActive: number;
}) {
  const [userId, setUserId] = useState<string>("");
  const { signup, verifyAccount, createBusinessInfo } = useAuth();
  const handleRegister = useCallback(
    async (data: any) => {
      const success = await signup(data, setUserId);
      if (success) setIsActive(1);
    },
    [signup, setIsActive]
  );

  const handleVerify = useCallback(
    async (data: any) => {
      const success = await verifyAccount(data);
      if (success) setIsActive(2);
    },
    [verifyAccount, setIsActive]
  );

  const handleBusinessInfo = useCallback(
    async (data: any) => {
      const success = await createBusinessInfo(data);
      if (success) setIsActive(3);
    },
    [createBusinessInfo, setIsActive]
  );
  const renderStepContent = () => {
    switch (isActive) {
      case 0:
        return <FormRegister onSubmit={handleRegister} />;
      case 1:
        return (
          <FormActiveAccount setActive={setIsActive} onSubmit={handleVerify} />
        );
      case 2:
        return (
          <FormBusinessInfo
            userId={userId}
            setActive={setIsActive}
            onSubmit={handleBusinessInfo}
          />
        );
      case 3:
        return (
          <RouterLink className="w-full flex" href="/auth/login">
            <Button className="flex-1" size="sm" variant="filled">
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
