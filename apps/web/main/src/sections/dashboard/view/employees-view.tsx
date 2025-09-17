'use client';
import React, { FormEvent, useEffect, useState } from 'react';
import FilterBar from '../components/filter-bar';
import { Button, Input, Modal, Table } from '@repo/design-system/components/ui';
import { BadgeAlert, Edit, Eye, Plus, Trash, UserPlus } from 'lucide-react';
import useStore from '../../../../../main/src/hooks/store/use-store';
import { useAtomValue } from 'jotai';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { formatDate } from '../../../../../main/src/utils/index';
const tableHeaders = ['Mã NV', 'Họ và Tên', 'Email', 'Vai trò', 'Ngay tham gia', 'Hành động'];
const roleColors: Record<string, string> = {
  MEMBER: 'bg-green-100 text-green-800 px-2 py-1',
};
export default function EmployeesView() {
  const currentStore = useAtomValue(currentStoreAtom);
  const { members, getMembersInStore, addMemberToStore, deleteMemberFromStore } = useStore();

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [email, setEmail] = useState<string>('');
  useEffect(() => {
    getMembersInStore();
  }, [currentStore?.id]);
  return (
    <>
      <FilterBar
        actions={
          <>
            <button
              onClick={() => setOpenModalAdd(true)}
              className="bg-pos-blue-400 border text-nowrap border-gray-200 rounded-md flex items-center gap-2 py-2 px-4  cursor-pointer hover:opacity-80 transition-opacity duration-300"
            >
              <Plus size={16} className="text-white" />
              <span className="text-white font-medium text-xs"> Thêm nhân viên mới</span>
            </button>
          </>
        }
      />
      {/* TABLE AND PAGINATION */}
      <Table
        totalPages={members.length}
        tableHeaders={tableHeaders}
        data={members}
        renderRow={(member, idx) => (
          <tr
            key={idx}
            className="border-b border-b-gray-100 hover:bg-gray-50 transition-colors duration-300"
          >
            <td className="px-4 py-2 text-xs font-medium text-gray-900">{member.user.id}</td>
            <td className="px-4 py-2 text-xs text-gray-500 font-medium">{member.user.username}</td>
            <td className="px-4 py-2 text-xs text-gray-500">{member.user.email}</td>

            <td className="px-4 py-2">
              <span className={`text-xs font-medium rounded-xl ${roleColors[member.role]}`}>
                {member.role}
              </span>
            </td>
            <td className="px-4 py-2 text-xs text-gray-500">{formatDate(member.createdAt)}</td>
            <td>
              <div className="flex  items-center gap-5 pl-4">
                <button
                  onClick={() => {
                    setSelectedMember(member);
                    setOpenEditModal(false);
                    setOpenViewModal(true);
                  }}
                  className="flex justify-center items-center cursor-pointer w-[36px] h-[36px] bg-gray-50 text-gray-500 rounded-md hover:opacity-100 hover:bg-gray-700 hover:text-white opacity-70 transition-opacity duration-200"
                >
                  <Eye size={16} />
                </button>
                <button
                  className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-pos-blue-50 text-pos-blue-500 rounded-md hover:opacity-100 hover:bg-pos-blue-500 hover:text-pos-blue-50 opacity-70 transition-opacity duration-200"
                  onClick={() => {
                    setOpenEditModal(true);
                    setOpenViewModal(false);
                    setSelectedMember(member);
                  }}
                >
                  <Edit size={16} />
                </button>
                <button
                  className="flex justify-center items-center cursor-pointer w-[36px] h-[36px]  bg-red-50 text-red-500 rounded-md hover:opacity-100 hover:bg-red-500 hover:text-white opacity-70 transition-opacity duration-200 ml-auto"
                  onClick={() => {
                    setDeleteModal(true);
                    setSelectedMember(member);
                    setOpenEditModal(false);
                    setOpenViewModal(false);
                  }}
                >
                  <Trash size={16} />
                </button>
              </div>
            </td>
          </tr>
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
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            addMemberToStore(email);
            setOpenModalAdd(false);
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
          <Button type="submit" title="Thêm nhân viên" size="md" />
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal opened={deleteModal} size="sm" onClose={() => setDeleteModal(false)}>
        <div className="space-y-3 flex flex-col items-center">
          <div className="flex flex-col gap-3 items-center justify-center">
            <div className="justify-center flex rounded-full bg-red-100 w-fit text-red-500 p-3.5">
              <BadgeAlert size={38} />
            </div>
            <div className="text-lg font-bold text-center">Bạn Có Chắc Chắn Muốn Xóa?</div>
            <div className="text-sm text-gray-500 text-center">
              Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan của trường này sẽ biến mất.
            </div>
          </div>
          <button
            onClick={() => {
              deleteMemberFromStore(selectedMember.user.id);
              setDeleteModal(false);
            }}
            className="bg-red-600 rounded-lg text-white w-full py-2 cursor-pointer font-bold"
          >
            Xác Nhận Xóa{' '}
          </button>
          <button
            onClick={() => {
              setDeleteModal(false);
            }}
            className="cursor-pointer"
          >
            Hủy
          </button>
        </div>
      </Modal>
    </>
  );
}
