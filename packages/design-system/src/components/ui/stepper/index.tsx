'use client';
import { Stepper as MantineStepper } from '@mantine/core';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import * as React from 'react';

type StepItem = {
  label: string;
  description?: string;
  icon: React.ReactNode;
};
type SizeStepper = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type OrientationStepper = 'horizontal' | 'vertical';

export type StepperProps = React.PropsWithChildren & {
  steps: StepItem[];
  size?: SizeStepper;
  orientation?: OrientationStepper;
  active: number;
  color?: string;
  setActive?: (active: number) => void;
};

export function Stepper({
  steps,
  size = 'md',
  orientation = 'horizontal',
  active,
  setActive,
  color = '#3b82f6',
}: StepperProps) {
  const { showErrorToast } = useToast();

  const handleStepClick = (index: number) => {
    if (!setActive) return;

    if (index <= active) {
      setActive(index);
    } else {
      showErrorToast('Bạn cần hoàn thành các bước trước đó!');
    }
  };

  return (
    <MantineStepper
      orientation={orientation}
      size={size}
      active={active}
      color={color}
      onStepClick={handleStepClick}
      allowNextStepsSelect={true}
    >
      {steps.map((step, idx) => (
        <MantineStepper.Step
          key={idx}
          label={step.label}
          description={step.description}
          icon={step.icon}
        />
      ))}
    </MantineStepper>
  );
}
