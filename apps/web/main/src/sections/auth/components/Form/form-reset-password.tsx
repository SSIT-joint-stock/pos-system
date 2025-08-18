import { Button, Input } from "@repo/design-system/components/ui";
import React from "react";

export function FormResetPassword() {
  return (
    <form className="mt-2 flex flex-col gap-4" action="">
      <Input type="text" label="Code" placeholder="Nhập code" size="sm" />
      <Input
        isInputPassword
        type="password"
        label="Mật khẩu "
        placeholder="Nhập mật khẩu"
        size="sm"
      />
      <Input
        isInputPassword
        type="password"
        label="Xác thực mật mật khẩu"
        placeholder="Nhập xác thực mật khẩu "
        size="sm"
      />
      <Button title="Đặt lại mật khẩu" size="sm" />
    </form>
  );
}
