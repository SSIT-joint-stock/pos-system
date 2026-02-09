import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { StoreMember } from '@repo/design-system/types/store';
import { ApiResponse } from '@repo/types';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FilterValue, useQueryParams } from '../../hooks/query/use-query-params';
import api from '../../libs/axios';
import {
  AddMemberByEmailInput,
  AddMemberByEmailSchema,
  CreateMemberInput,
  CreateMemberSchema,
  UpdateMemberInput,
  UpdateMemberRoleSchema,
  UpdateMemberSchema,
} from '../../schemas/store-member/store-member.schema';
import { exportExcel } from '../../utils/export-excel/export';
import { useRequestHelper } from '../use-request-helper';
export interface StoreMemberFilters extends Record<string, FilterValue> {
  q?: string;
}
export function useStoreMember() {
  const { showSuccessToast } = useToast();
  const { requestWrapper, loading } = useRequestHelper();
  const {
    paginationParams,
    filters,
    pagination,

    setPaginationParams,
    setFilters,
    setPagination,
    buildParams,
  } = useQueryParams<StoreMemberFilters>({
    q: 'q',
  });
  const formCreateMember = useForm<CreateMemberInput>({
    resolver: zodResolver(CreateMemberSchema),
  });
  const formAddMemberByEmail = useForm<AddMemberByEmailInput>({
    resolver: zodResolver(AddMemberByEmailSchema),
  });
  const formUpdateMember = useForm<UpdateMemberInput>({
    resolver: zodResolver(UpdateMemberSchema),
  });
  const [members, setMembers] = useState<StoreMember[]>([]);
  const [member, setMember] = useState<StoreMember | null>(null);

  // 1. Get members
  const getMembers = useCallback(async () => {
    const res = await requestWrapper(() =>
      api.get(`/store-member/members?${buildParams().toString()}`)
    );
    if (res?.data?.success) {
      setMembers(res.data.data);
      setPagination(res.data.pagination);
    }
  }, [requestWrapper, setPagination, buildParams]);

  // 2. Add existing member
  const addMemberByEmail = async (data: AddMemberByEmailInput) => {
    const res = await requestWrapper(() => api.post(`/store-member/add-member`, data));
    if (res?.data?.success) {
      showSuccessToast(res.data.message || 'Thêm nhân viên mới thành công!');
      return true;
    }
    return false;
  };

  // 3. Create + add new member
  const createMember = async (data: CreateMemberInput) => {
    const res = await requestWrapper(() => api.post(`/store-member/create`, data));
    if (res?.data?.success) {
      showSuccessToast(res.data.message || 'Thêm nhân viên mới thành công!');
      return true;
    }
    return false;
  };

  // 4. Get member detail
  const getMemberDetail = useCallback(
    async (memberUserId: string) => {
      const res = await requestWrapper(() => api.get(`/store-member/members/${memberUserId}`));
      if (res?.data?.success) {
        setMember(res.data.data);
      }
    },
    [requestWrapper]
  );

  // 5. Update role
  const updateMemberRole = useCallback(
    async (memberUserId: string, role: string) => {
      UpdateMemberRoleSchema.parse({ role });
      return requestWrapper(() =>
        api.patch(`/store-member/members/${memberUserId}/role`, { role })
      );
    },
    [requestWrapper]
  );

  // 6. Remove member
  const removeMember = useCallback(
    async (userId: string) => {
      const res = await requestWrapper(() =>
        api.delete<ApiResponse>(`/store-member/delete-member/${userId}`)
      );
      if (res?.data.success) {
        showSuccessToast(res.data.message as string);
        return true;
      }
      return false;
    },
    [requestWrapper, showSuccessToast]
  );

  // 7. Update Info Member
  const updateMember = useCallback(
    async (userId: string, data: UpdateMemberInput) => {
      const res = await requestWrapper(() =>
        api.patch<ApiResponse>(`/store-member/update/${userId}`, data)
      );
      if (res?.data.success) {
        showSuccessToast(res.data.message as string);
        return true;
      }
      return false;
    },
    [showSuccessToast, requestWrapper]
  );

  // Excel
  const exportMembersExcel = useCallback(async () => {
    await requestWrapper(async () => {
      const res = await api.get('/store-member/excel/export', {
        responseType: 'blob',
      });

      exportExcel(
        res,
        `danh_sach_nhan_vien_${new Date().toLocaleDateString()}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    });
  }, [requestWrapper]);

  return {
    loading,
    members,
    member,
    formCreateMember,
    formUpdateMember,
    formAddMemberByEmail,
    pagination,
    paginationParams,
    filters,

    setPagination,
    setFilters,
    setPaginationParams,

    getMembers,
    getMemberDetail,
    addMemberByEmail,
    createMember,
    updateMemberRole,
    removeMember,
    updateMember,
    exportMembersExcel,
  };
}
