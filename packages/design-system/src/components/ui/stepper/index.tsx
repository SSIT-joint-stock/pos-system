"use client";
import * as React from "react";
import { Stepper as MantineStepper } from "@mantine/core";
type StepItem = {
  label: string;
  description: string;
  icon: React.ReactNode;
};
type SizeStepper = "xs" | "sm" | "md" | "lg" | "xl";
type orientationStepper = "horizontal" | "vertical";
export type StepperProps = React.PropsWithChildren & {
  steps: StepItem[];
  size?: SizeStepper;
  orientation?: orientationStepper;
  active: number;
  color?: string;
  setActive?: (active: number) => void;
};

export function Stepper({
  steps,
  size = "md",
  orientation = "horizontal",
  active,
  setActive,
  color = "#3b82f6",
}: StepperProps) {
  return (
    <MantineStepper
      orientation={orientation}
      size={size}
      active={active}
      color={color}
      onStepClick={setActive}>
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
