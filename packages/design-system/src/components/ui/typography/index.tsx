import * as React from 'react';
import { Text, Anchor } from '@mantine/core';
import { cn } from '@repo/utils';
import { RouterLink } from '@repo/design-system/routes/components';

type SizeVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'content' | 'sm' | 'xs';
type WeightVariant = 'superBold' | 'bold' | 'normal' | 'medium' | 'semibold' | 'thin' | 'light';
type ColorVariant = 'dimmer' | 'primary' | 'text' | 'alert' | 'warning' | 'white' | 'black';
type StyleVariant = 'link' | undefined;

export type TypographyProps = React.PropsWithChildren & {
  size?: SizeVariant;
  weight?: WeightVariant;
  color?: ColorVariant;
  variant?: StyleVariant;
  href?: string;
  className?: string;
} & Omit<React.ComponentProps<'p'>, 'color'>;

const fontSizePx: Record<SizeVariant, number> = {
  h1: 42,
  h2: 36,
  h3: 30,
  h4: 24,
  h5: 20,
  h6: 18,
  content: 16,
  sm: 14,
  xs: 12,
};

const fontWeight: Record<WeightVariant, number> = {
  superBold: 900,
  bold: 700,
  semibold: 600,
  medium: 500,
  normal: 400,
  thin: 300,
  light: 200,
};

const colorCss: Record<ColorVariant, string | undefined> = {
  primary: 'var(--color-primary)',
  text: undefined,
  dimmer: 'var(--mantine-color-dimmed, #71717a)',
  alert: 'var(--mantine-color-red-6, #ef4444)',
  warning: 'var(--mantine-color-yellow-6, #f59e0b)',
  white: '#ffffff',
  black: '#000000',
};

export function Typography({
  size = 'content',
  color = 'text',
  weight,
  className,
  href,
  variant,
  children,
  ...rest
}: TypographyProps) {
  const style: React.CSSProperties = {
    fontSize: `${fontSizePx[size]}px`,
    fontWeight: weight ? fontWeight[weight] : undefined,
  };

  const c = colorCss[color];

  if (href) {
    return (
      <RouterLink href={href} passHref>
        <Anchor
          c={c}
          underline={variant === 'link' ? 'hover' : 'never'}
          className={cn(
            'inline-block transition-colors',
            variant === 'link' && 'cursor-pointer',
            className,
          )}
          style={style}
          {...rest as any}
        >
          {children}
        </Anchor>
      </RouterLink>
    );
  }

  return (
    <Text
      c={c}
      className={cn('inline-block', className)}
      style={style}
      {...rest as any}
    >
      {children}
    </Text>
  );
}