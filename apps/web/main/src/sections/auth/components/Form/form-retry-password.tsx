import { Button, Input } from "@repo/design-system/components/ui";
import React from "react";

export function FormRetryPassword() {
  return (
    <form className="mt-2 flex flex-col gap-4" action="">
      <Input type="email" label="Email" placeholder="Nhập email" size="sm" />
      <Button title="Tiếp tục"  size="sm" />
    </form>
  );
}
