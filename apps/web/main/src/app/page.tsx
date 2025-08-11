
import Image from "next/image";
import { Typography } from "@repo/design-system/components/ui/typography";

export default async function Page() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <Image src="/logo.png" alt="Logo" width={100} height={100} />
        <Typography size="h1" weight="semibold">Hello World</Typography>
        <Typography size="h2" color="dimmer">Welcome to the main domain</Typography>
      </div>
    </div>
  );
}