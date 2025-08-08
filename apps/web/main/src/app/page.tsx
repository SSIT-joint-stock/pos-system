import { Heading, Text } from "@repo/design-system/src/components/typography";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <Heading level={3}>Hello World</Heading>
        <Text c="dimmed">Welcome to the main domain</Text>
      </div>
    </div>
  );
}