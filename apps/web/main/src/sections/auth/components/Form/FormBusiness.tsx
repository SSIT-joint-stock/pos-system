import { Button, Input } from "@repo/design-system/components/ui";
import { MapPin, MoveLeft, User, Warehouse } from "lucide-react";
import React from "react";

export default function FormBusiness({
  setActive,
}: {
  setActive: (active: number) => void;
}) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActive(3);
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full ">
      <Input
        size="sm"
        type="text"
        label="Tên doanh nghiệp"
        placeholder="Doanh nghiệp ABC"
        radius="xl"
        leftSection={<Warehouse size={16} />}
      />
      <Input
        size="sm"
        type="text"
        label="Tên người đại diện"
        placeholder="Nguyen Van A"
        radius="xl"
        leftSection={<User size={16} />}
      />
      <Input
        leftSection={<MapPin size={16} />}
        size="sm"
        label="Địa chỉ"
        radius="xl"
        placeholder="Địa chỉ doanh ngiệp"
      />
      {/* Sign up button */}
      <Button
        type="submit"
        size="sm"
        radius="xl"
        title="Tiếp tục"
        variant="filled"
      />

      {/* Sign in link */}
      <div className="flex items-center justify-center w-full">
        <button
          type="button"
          onClick={() => setActive(0)}
          className="flex items-center gap-2 cursor-pointer text-gray-500 group transition-all duration-300 hover:text-blue-500  ">
          <MoveLeft
            size={16}
            className=" group-hover:-translate-x-2 transition-all duration-300"
          />
          <span className="text-xs font-medium ">Quay lại trang đăng ký</span>
        </button>
      </div>
    </form>
  );
}
