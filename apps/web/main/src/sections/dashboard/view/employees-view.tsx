/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { Button, Input, Modal, Table } from '@repo/design-system/components/ui';
import { Plus, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

// import useStore from '../../../../../main/src/hooks/store/use-store'; // hook cũ

import { formatDate } from '../../../../../main/src/utils/index';
import DashboardViewLayout from '../../../layouts/dashboard-view-layout';
import { ActionButtons } from '../components/action-buttons';
import { DataActionBar } from '../components/data-action-bar';
import { DisplayField } from '../components/display-field';

import { Tabs } from '@mantine/core';
import { StoreMember, StoreRole } from '@repo/design-system/types/store';
import { formatCurrency } from '@repo/utils';
import { useStoreMember } from '../../../hooks/store-member/use-store-member';
import { DeleteConfirmationModal } from '../../../sections/dashboard/components/delete-confirmation-modal';

const tableHeaders = [
  'Email',
  'Tên đăng nhập',
  'Vai trò',
  'Tổng doanh thu',
  'Ngay tham gia',
  'Hành động',
];
const roleColors: Record<string, string> = {
  MEMBER: ' text-green-500 ',
  OWNER: ' text-pos-blue-500 ',
};
export default function EmployeesView() {
  const {
    pagination,
    paginationParams,
    filters,
    member,
    exportMembersExcel,
    getMemberDetail,
    setFilters,
    setPaginationParams,
    getMembers,
    addMemberByEmail,
    removeMember,
    createMember,
    updateMember,
    formUpdateMember: {
      register: registerUpdateMember,
      formState: { errors: errorsUpdateMember },
      handleSubmit: handleSubmitUpdateMember,
      reset: resetUpdateMember,
    },
    formAddMemberByEmail: {
      register: registerAddMemberByEmail,
      formState: { errors: errorsAddMemberByEmail },
      handleSubmit: handleSubmitAddMemberByEmail,
      reset: resetAddMemberByEmail,
    },
    formCreateMember: {
      register,
      formState: { errors },
      handleSubmit,
      reset,
    },
    loading,
    members,
  } = useStoreMember();

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [openModalAdd, setOpenModalAdd] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<StoreMember | null>(null);
  useEffect(() => {
    getMembers();
  }, [filters, paginationParams]);
  useEffect(() => {
    if (!selectedMember?.userId) return;
    getMemberDetail(selectedMember?.userId || '');
  }, [selectedMember?.userId]);
  useEffect(() => {
    if (!member || !selectedMember) return;
    if (member) {
      resetUpdateMember({
        email: member.user.email,
        username: member.user.username,
      });
    }
  }, [member, selectedMember, resetUpdateMember]);
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
        dataComplete={[...new Set(members?.map((p) => p.user.username) || [])]}
        placeholderSearch="Tìm kiếm tên, email nhân viên"
        onFilterChange={(newFilters) => {
          setFilters((prev) => ({
            ...prev,
            ...newFilters,
          }));
        }}
        onSearch={(value) => {
          setFilters((prev) => ({ ...prev, q: value }));
        }}
        onExport={exportMembersExcel}
        isHaveUpload={false}
      />
      {/* TABLE AND PAGINATION */}
      <Table
        hasMarginTop={false}
        total={pagination?.total}
        page={pagination?.page}
        totalPages={pagination?.totalPages}
        limit={pagination?.limit}
        pageSize={pagination?.limit ?? paginationParams.limit}
        onPageSizeChange={(size) =>
          setPaginationParams((prev) => ({
            ...prev,
            limit: size,
          }))
        }
        onPageChange={(page) =>
          setPaginationParams((prev) => ({
            ...prev,
            page,
          }))
        }
        tableHeaders={tableHeaders}
        data={members}
        // isLoading={loading}
        renderRow={(member) => (
          <>
            <td className="px-4 py-3 text-sm text-zinc-800 font-semibold">
              {member.user.email || member.email}
            </td>
            <td className="px-4 py-3 text-sm text-zinc-800 font-semibold">
              {member.user.username || member.name}
            </td>

            <td className="px-4 py-3">
              <span className={`text-sm font-semibold  ${roleColors[member.role]}`}>
                {member.role === StoreRole.MEMBER ? 'Nhân viên' : 'Chủ cửa hàng'}
              </span>
            </td>
            <td className="px-4 py-3 text-sm text-zinc-800 font-semibold">
              {formatCurrency(Number(member.total_order)) || 0}
            </td>
            <td className="px-4 py-3 text-sm text-zinc-800 font-medium">
              {formatDate(member.createdAt)}
            </td>
            <td>
              <ActionButtons
                onEdit={() => {
                  setEditModal(true);
                  setSelectedMember(member);
                }}
                onDelete={() => {
                  setDeleteModal(true);
                  setSelectedMember(member);
                }}
              />
            </td>
          </>
        )}
      />
      <DeleteConfirmationModal
        loading={loading}
        itemName={selectedMember?.user.username || selectedMember?.name}
        opened={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={async () => {
          const success = await removeMember(selectedMember?.userId || '');
          if (success) {
            setDeleteModal(false);
            getMembers();
          }
        }}
      />
      <Modal
        opened={openModalAdd}
        onClose={() => setOpenModalAdd(false)}
        size="xl"
        title={
          <div className="flex items-center gap-2 text-base font-semibold">
            <UserPlus size={20} />
            <p>Thêm nhân viên mới</p>
          </div>
        }
      >
        <Tabs defaultValue="add">
          <Tabs.List>
            <Tabs.Tab value="add">Thêm mới nhân viên đã tồn tại</Tabs.Tab>
            <Tabs.Tab value="create">Thêm mới nhân viên chưa tồn tại</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="add">
            <form
              onSubmit={handleSubmitAddMemberByEmail(async (data) => {
                const success = await addMemberByEmail(data);
                if (success) {
                  setOpenModalAdd(false);
                  getMembers();
                  resetAddMemberByEmail();
                }
              })}
              className="space-y-6 mt-5"
            >
              <Input
                {...registerAddMemberByEmail('email')}
                error={errorsAddMemberByEmail.email?.message}
                size="sm"
                radius="sm"
                placeholder="Thêm mới nhân viên qua email đã tồn tại"
                label="Email"
              />
              <div className="flex justify-end">
                <Button type="submit" size="sm" radius="sm" title="Thêm mới nhân viên" />
              </div>
            </form>
          </Tabs.Panel>

          <Tabs.Panel value="create">
            <form
              onSubmit={handleSubmit(async (data) => {
                const success = await createMember(data);
                if (success) {
                  setOpenModalAdd(false);
                  getMembers();
                  reset();
                }
              })}
              className="space-y-6 mt-5"
            >
              <div className="flex  gap-2">
                <Input
                  {...register('email')}
                  error={errors.email?.message}
                  size="sm"
                  className="flex-1"
                  radius="sm"
                  placeholder="Nhập email cho tài khoản nhân viên"
                  label="Email"
                />
                <Input
                  {...register('username')}
                  error={errors.username?.message}
                  className="flex-1"
                  size="sm"
                  radius="sm"
                  placeholder="Nhập tên đăng nhập cho tài khoản nhân viên"
                  label="Tên đăng nhập"
                />
              </div>
              <div className="flex  gap-2">
                <Input
                  {...register('password')}
                  error={errors.password?.message}
                  isInputPassword
                  size="sm"
                  className="flex-1"
                  radius="sm"
                  placeholder="Nhập mật khẩu cho tài khoản nhân viên"
                  label="Mật khẩu"
                />
                <Input
                  {...register('confirmPassword')}
                  error={errors.confirmPassword?.message}
                  isInputPassword
                  size="sm"
                  className="flex-1"
                  radius="sm"
                  placeholder="Nhập lại mật khẩu"
                  label="Nhập lại mật khẩu"
                />
              </div>
              <div className="flex justify-end">
                <Button
                  loading={loading}
                  type="submit"
                  size="sm"
                  radius="sm"
                  title="Thêm mới nhân viên"
                />
              </div>
            </form>
          </Tabs.Panel>
        </Tabs>
      </Modal>
      <Modal
        opened={editModal}
        onClose={() => setEditModal(false)}
        size="xl"
        title={<p className="text-base font-semibold">Sửa thông tin nhân viên</p>}
      >
        <form
          onSubmit={handleSubmitUpdateMember(async (data) => {
            if (!selectedMember?.userId) return;
            const success = await updateMember(selectedMember?.userId, data);
            if (success) {
              setEditModal(false);
              getMembers();
              getMemberDetail(selectedMember?.userId);
              // reset();
            }
          })}
          className="space-y-6"
        >
          <div className="flex  gap-2">
            <Input
              {...registerUpdateMember('email')}
              error={errorsUpdateMember.email?.message}
              size="sm"
              className="flex-1"
              radius="sm"
              placeholder="Nhập email cho tài khoản nhân viên"
              label="Email"
            />
            <Input
              {...registerUpdateMember('username')}
              error={errorsUpdateMember.username?.message}
              className="flex-1"
              size="sm"
              radius="sm"
              placeholder="Nhập tên đăng nhập cho tài khoản nhân viên"
              label="Tên đăng nhập"
            />
          </div>
          <div className="flex justify-end">
            <Button
              loading={loading}
              type="submit"
              size="sm"
              radius="sm"
              title="Cập nhật thông tin"
            />
          </div>
        </form>
      </Modal>
    </DashboardViewLayout>
  );
}
