import React from "react";
import { Button, Input, Select } from "@repo/design-system/components/ui";
import { Component, MapPin, MoveLeft, User, Warehouse } from "lucide-react";
import useAuth from "@main/hooks/auth/useAuth";
import { BusinessInfoData } from "../../data";
const businessTypes = [
  { value: "RETAIL", label: "Doanh nghiệp bán lẻ" },
  { value: "RESTAURANT", label: "Nhà hàng" },
  { value: "SERVICE", label: "Dich vụ" },
];
export function FormBusinessInfo({
  setActive,
  userId,
  onSubmit,
}: {
  setActive: (active: number) => void;
  userId: string;
  onSubmit: (data: BusinessInfoData) => void;
}) {
  const { businessInfoForm, loading } = useAuth();
  return (
    <form
      onSubmit={businessInfoForm.handleSubmit(onSubmit)}
      className="flex flex-col gap-3 w-full h-fit">
      <Input
        hidden
        {...businessInfoForm.register("userId")}
        name="userId"
        value={userId}
      />
      <Select
        onChange={(value) => {
          businessInfoForm.setValue(
            "domainType",
            value as "RETAIL" | "RESTAURANT"
          );
        }}
        value={businessInfoForm.watch("domainType")}
        onBlur={() => businessInfoForm.trigger("domainType")}
        name="domainType"
        leftSection={<Component size={16} />}
        size="sm"
        data={businessTypes}
        placeholder="Chọn mô hình kinh doạnh"
        label="Mô hình kinh doạnh"
        error={businessInfoForm.formState.errors.domainType?.message}
      />
      <Input
        {...businessInfoForm.register("name")}
        error={businessInfoForm.formState.errors.name?.message}
        size="sm"
        type="text"
        name="name"
        label="Tên doanh nghiệp"
        placeholder="Doanh nghiệp ABC"
        leftSection={<Warehouse size={16} />}
      />
      <Input
        {...businessInfoForm.register("phone")}
        error={businessInfoForm.formState.errors.phone?.message}
        size="sm"
        type="tel"
        label="Số điện thoại"
        placeholder="0123 456 789"
        leftSection={<User size={16} />}
      />
      <Input
        {...businessInfoForm.register("taxCode")}
        error={businessInfoForm.formState.errors.taxCode?.message}
        size="sm"
        type="text"
        label="Mã số thuế"
        placeholder="0123456789"
        leftSection={<User size={16} />}
      />
      <Input
        {...businessInfoForm.register("address")}
        error={businessInfoForm.formState.errors.address?.message}
        leftSection={<MapPin size={16} />}
        size="sm"
        label="Địa chỉ"
        placeholder="Địa chỉ doanh ngiệp"
      />
      {/* Sign up button */}
      <Button
        disabled={loading}
        type="submit"
        size="sm"
        title="Tiếp tục"
        variant="filled"
      />

      {/* Sign in link */}
      <div className="flex items-center justify-center w-full">
        <button
          type="button"
          onClick={() => setActive(0)}
          className="flex items-center gap-2 cursor-pointer text-gray-500 group transition-all duration-300 hover:text-pos-blue-500  ">
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
