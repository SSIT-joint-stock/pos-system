import { useCallback, useState } from "react";
import api from "../../../../main/src/libs/axios";
import { useRequestHelper } from "../use-request-helper";

export function useStoreMember(storeId?: string) {
  const { requestWrapper, loading } = useRequestHelper();
  const [members, setMembers] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  // 1. Get members
  const getMembers = useCallback(async () => {
    if (!storeId) return;
    const res = await requestWrapper(() =>
      api.get(`/store-member/members/${storeId}`)
    );
    if (res?.data?.success) {
      setMembers(res.data.data);
    }
  }, [storeId, requestWrapper]);

  // 2. Add existing member
  const addMemberByEmail = useCallback(
    async (email: string) => {
      if (!storeId) return;
      return requestWrapper(() =>
        api.post(`/store-member/add-member/${storeId}`, { email })
      );
    },
    [storeId, requestWrapper]
  );

  // 3. Create + add new member
  const createMember = useCallback(
    async (payload: {
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      if (!storeId) return;
      return requestWrapper(() =>
        api.post(`/store-member/${storeId}/members/create`, payload)
      );
    },
    [storeId, requestWrapper]
  );

  // 4. Get member detail
  const getMemberDetail = useCallback(
    async (memberUserId: string) => {
      if (!storeId) return;
      const res = await requestWrapper(() =>
        api.get(`/store-member/${storeId}/members/${memberUserId}`)
      );
      if (res?.data?.success) {
        setSelectedMember(res.data.data);
      }
    },
    [storeId, requestWrapper]
  );

  // 5. Update role
  const updateMemberRole = useCallback(
    async (memberUserId: string, role: string) => {
      if (!storeId) return;
      return requestWrapper(() =>
        api.patch(`/store-member/${storeId}/members/${memberUserId}/role`, {
          role,
        })
      );
    },
    [storeId, requestWrapper]
  );

  // 6. Remove member
  const removeMember = useCallback(
    async (memberUserId: string) => {
      if (!storeId) return;
      return requestWrapper(() =>
        api.delete(`/store-member/delete-member/${storeId}`, {
          data: { memberUserId },
        })
      );
    },
    [storeId, requestWrapper]
  );

  return {
    loading,
    members,
    selectedMember,

    getMembers,
    getMemberDetail,
    addMemberByEmail,
    createMember,
    updateMemberRole,
    removeMember,
  };
}
