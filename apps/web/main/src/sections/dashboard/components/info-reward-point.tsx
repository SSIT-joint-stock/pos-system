'use client';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import api from '../../../libs/axios';
import React, { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ConfigRewardPoint,
  ConfigRewardPointInput,
} from '../../../schemas/reward-point/reward-point.schema';
import { Textarea } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { Button, Checkbox, Input } from '@repo/design-system/components/ui';
import { Info } from 'lucide-react';
import { ApiResponse } from '@repo/types/response';
import { currentStoreAtom } from '@repo/design-system/stores/auth';
import { useAtomValue } from 'jotai';
import { RewardPointInfo } from '@repo/design-system/types';

export function InfoRewardPoint() {
  const [loading, setLoading] = useState<boolean>(false);
  const [rewardPointInfo, setRewardPointInfo] = useState<RewardPointInfo>({} as RewardPointInfo);
  const currentStore = useAtomValue(currentStoreAtom);
  const { showSuccessToast } = useToast();
  const configRewardPoint = useForm<ConfigRewardPointInput>({
    resolver: zodResolver(ConfigRewardPoint),
  });
  const {
    register,
    handleSubmit,
    reset,
    setValue,

    formState: { errors },
  } = configRewardPoint;
  const handleSubmitConfig = async (data: ConfigRewardPointInput) => {
    setLoading(true);
    const res = await api.post<ApiResponse>(`/store-reward-point/apply/${currentStore?.id}`, data);
    if (res?.data.success) {
      setLoading(false);
      showSuccessToast(res.data.message as string);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (!currentStore?.id) return;
    api
      .get<ApiResponse>(`/store-reward-point/${currentStore?.id}`)
      .then((res) => {
        if (res.data.success) setRewardPointInfo(res.data.data);
      })
      .catch(() => {
        setRewardPointInfo({} as RewardPointInfo);
      });
  }, [currentStore?.id]);
  useEffect(() => {
    if (rewardPointInfo) {
      reset({
        convert_rate: rewardPointInfo.convert_rate,
        point_value: rewardPointInfo.point_value,
        is_apply: rewardPointInfo.is_apply,
        description: rewardPointInfo.description,
      });
    }
  }, [reset, rewardPointInfo]);
  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-semibold text-pos-blue-500 border-b-2 pb-1 border-b-pos-blue-500 w-fit">
        Thiết lập tích điểm
      </h1>
      <form onSubmit={handleSubmit(handleSubmitConfig)} className="w-full space-y-6">
        <div className="space-y-1.5">
          <p className="text-sm text-gray-700 font-semibold">Tỷ lệ tích điểm quy đổi</p>
          <div className="flex items-center gap-4 ">
            <Input
              {...register('convert_rate')}
              placeholder="100000"
              type="number"
              className="flex-1"
              error={errors.convert_rate?.message}
              radius="sm"
              rightSection="VND"
            />
            <p className="text-base font-semibold text-gray-800 flex-1"> = 1 điểm thưởng</p>
          </div>
          <span className="text-xs font-semibold text-gray-700">Ví dụ: 100,000 VND = 1 điểm</span>
        </div>
        <div className="space-y-1.5">
          <p className="text-sm text-gray-700 font-semibold">Giá trị quy đổi</p>
          <div className="flex items-center gap-4 ">
            <Input
              placeholder="5000"
              {...register('point_value')}
              type="number"
              className="flex-1"
              radius="sm"
              rightSection="VND"
            />
            <p className="text-base font-semibold text-gray-800 flex-1"> = 1 điểm thưởng</p>
          </div>
          <span className="text-xs font-semibold text-gray-700">
            Ví dụ: 1 điểm = 5,000 VND khi quy đổi điểm thưởng.
          </span>
        </div>
        <Textarea
          radius={'sm'}
          {...register('description')}
          className="w-1/2"
          label={<span className="text-sm text-gray-700 font-semibold">Mô tả</span>}
          placeholder="Nhập mô tả..."
          minRows={3}
          rightSection={<Info size={18} />}
        />
        <Checkbox
          {...register('is_apply')}
          checked={configRewardPoint.watch('is_apply')}
          onChange={(e) => setValue('is_apply', e.target.checked)}
          label="Áp dụng tích điểm"
          size="sm"
          radius="sm"
        />
        <div className="flex items-center justify-end gap-3">
          {/* <Button type="button" title="Sửa" size="sm" variant="light" /> */}
          <Button
            type="submit"
            disabled={loading}
            title={loading ? 'Đang tải' : 'Cập nhật'}
            size="sm"
          />
        </div>
      </form>
    </div>
  );
}
