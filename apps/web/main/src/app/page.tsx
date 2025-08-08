import { Heading, Text } from "@repo/design-system/components/ui/typography";
import Image from "next/image";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
        <Heading level={3}>Hello World</Heading>
        <Text c="dimmed">Welcome to the main domain</Text>
      </div>
    </div>
  );
}