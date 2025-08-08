import { Heading, Text } from "@repo/design-system/src/components/typography";
export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <Heading level={1}>Retail POS System</Heading>
        <Text c="dimmed">Welcome to the retail domain</Text>
      </div>
    </div>
  );
} 