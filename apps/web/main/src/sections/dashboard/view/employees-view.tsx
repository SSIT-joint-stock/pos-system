"use client";
import React, { FormEvent, useEffect, useState, useRef } from "react";
import { Button, Input, Modal, Table } from "@repo/design-system/components/ui";
import { Plus, UserPlus } from "lucide-react";

// import useStore from '../../../../../main/src/hooks/store/use-store'; // hook cũ

import { useAtomValue } from "jotai";
import { currentStoreAtom } from "@repo/design-system/stores/auth";
import { formatDate } from "../../../../../main/src/utils/index";
import DashboardViewLayout from "../../../../../main/src/layouts/dashboard-view-layout";
import { DisplayField } from "../components/display-field";
import { DataActionBar } from "../components/data-action-bar";
import { ActionButtons } from "../components/action-buttons";
import { DeleteConfirmationModal } from "../components/delete-confirmation-modal";

import { useStoreMember } from "../../../../../main/src/hooks/store-member/use-store-member";

const tableHeaders = [
  "Mã NV",
  "Họ và Tên",
  "Email",
  "Vai trò",
  "Ngay tham gia",
  "Hành động",
];
const roleColors: Record<string, string> = {
  MEMBER: "bg-green-100 text-green-800 px-2 py-1",
};
export default function EmployeesView() {
  const isUpdated = true;
  const currentStore = useAtomValue(currentStoreAtom);

  // const { members, getMembersInStore, addMemberToStore, deleteMemberFromStore } = useStore();

  const { members, getMembers, addMemberByEmail, removeMember } =
    useStoreMember(currentStore?.id);

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [email, setEmail] = useState<string>("");
  const fetchedRef = useRef(false);
  useEffect(() => {
    if (!currentStore?.id || fetchedRef.current) return;

    fetchedRef.current = true;
    getMembers();
  }, [currentStore?.id, getMembers]);
  return (
    <DashboardViewLayout>
      <DisplayField label="Danh sách nhân viên ">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              setOpenModalAdd(true);
            }}
            title="Thêm nhân viên mới"
            icon={<Plus size={16} />}
            size="sm"
            radius="sm"
          />
        </div>
      </DisplayField>
      <DataActionBar
        placeholderSearch="Tìm kiếm tên nhân viên"
        // onFilterChange={(newFilters) => {
        //   setFilters((prev) => ({
        //     ...prev,
        //     ...newFilters,
        //     product_status: newFilters.status,
        //   }));
        // }}
        // onSearch={(value) => {
        //   setFilters((prev) => ({ ...prev, q: value }));
        // }}
      />
      {/* TABLE AND PAGINATION */}
      <Table
        totalPages={members.length}
        tableHeaders={tableHeaders}
        data={members}
        renderRow={(member) => (
          <>
            <td className="px-4 py-3 text-sm font-medium text-gray-900">
              {member.user.id}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500 font-medium">
              {member.user.username}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">
              {member.user.email}
            </td>

            <td className="px-4 py-3">
              <span
                className={`text-xs font-medium rounded-xl ${roleColors[member.role]}`}
              >
                {member.role}
              </span>
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">
              {formatDate(member.createdAt)}
            </td>
            <td>
              <ActionButtons
                onView={() => {
                  setSelectedMember(member);
                  setOpenEditModal(false);
                  setOpenViewModal(true);
                }}
                onEdit={() => {
                  if (member.role === "OWNER") return;
                  setOpenEditModal(true);
                  setOpenViewModal(false);
                  setSelectedMember(member);
                }}
                onDelete={() => {
                  if (member.role === "OWNER") return;
                  setDeleteModal(true);
                  setSelectedMember(member);
                  setOpenEditModal(false);
                  setOpenViewModal(false);
                }}
                title="Thêm nhân viên mới"
                icon={<Plus size={16} />}
                size="sm"
                radius="sm"
              />
            </td>
          </>
        )}
      />
      <Modal
        opened={openModalAdd}
        onClose={() => setOpenModalAdd(false)}
        size="lg"
        title={
          <div className="flex items-center gap-2 text-lg font-medium">
            <UserPlus size={20} />
            <p>Thêm nhân viên mới</p>
          </div>
        }
      >
        <form
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();
            try {
              await addMemberByEmail(email);
              getMembers();
              setOpenModalAdd(false);
              setEmail("");
            } catch (err: any) {
              // TODO: show toast từ backend
              console.error(err);
            }
          }}
          className="flex flex-col gap-2 mt-2"
        >
          <Input
            onChange={(e) => setEmail(e.target.value)}
            label="Email nhân viên"
            size="md"
            placeholder="example@gmail.com"
            name="email"
            type="email"
          />
          {/* TABLE AND PAGINATION */}
          <Table
            totalPages={members.length}
            tableHeaders={tableHeaders}
            data={members}
            renderRow={(member) => (
              <>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{member.user.id}</td>
                <td className="px-4 py-3 text-sm text-gray-500 font-medium">
                  {member.user.username}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">{member.user.email}</td>

      {/* DELETE MODAL */}
      <DeleteConfirmationModal
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={async () => {
          if (!selectedMember?.user?.id) return;
          await removeMember(selectedMember.user.id);
          setDeleteModal(false);
          getMembers();
        }}
        itemName={selectedMember?.user?.username}
      />
    </DashboardViewLayout>
  );
}
