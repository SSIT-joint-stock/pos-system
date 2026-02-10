import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, NumberInput, Select } from '@repo/design-system/components/ui';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { REASON_PAYMENT_OPTIONS, REASON_RECEIPT_OPTIONS } from '../../../constants/reason-cash';
import { useCustomer } from '../../../hooks/customers/use-customer';
import { useFinance } from '../../../hooks/finance/use-finance';
import { useSupplier } from '../../../hooks/suplier/use-supplier';
import {
  CreatePaymentInput,
  CreatePaymentSchema,
  CreateReceiptInput,
  CreateReceiptSchema,
} from '../../../schemas/finance/finance.schema';

interface FormFinanceTransactionProps {
  type: 'RECEIPT' | 'PAYMENT';
  onSuccess: () => void;
  onCancel: () => void;
}

export function FormFinanceTransaction({ type, onSuccess, onCancel }: FormFinanceTransactionProps) {
  const { createReceipt, createPayment, loading } = useFinance();
  const { customers, getCustomers } = useCustomer();
  const { suppliers, getSuppliers } = useSupplier();

  const isReceipt = type === 'RECEIPT';

  const form = useForm<CreateReceiptInput | CreatePaymentInput>({
    resolver: zodResolver(isReceipt ? CreateReceiptSchema : CreatePaymentSchema),
    defaultValues: {
      amount: 0,
      payment_method: 'CASH',
      transaction_source: isReceipt ? 'OTHER_INCOME' : ('OTHER_EXPENSE' as any),
      contact_type: isReceipt ? 'CUSTOMER' : 'SUPPLIER',
      contact_id: '',
      description: '',
      notes: '',
    },
  });

  const contactType = form.watch('contact_type');

  useEffect(() => {
    if (contactType === 'CUSTOMER') {
      getCustomers();
    } else if (contactType === 'SUPPLIER') {
      getSuppliers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactType]);

  const onSubmit = async (values: any) => {
    let success = false;
    if (isReceipt) {
      success = await createReceipt(values as CreateReceiptInput);
    } else {
      success = await createPayment(values as CreatePaymentInput);
    }

    if (success) {
      onSuccess();
    }
  };

  const contactOptions =
    contactType === 'CUSTOMER'
      ? (customers || []).map((c) => ({ value: c.id, label: c.name }))
      : contactType === 'SUPPLIER'
        ? (suppliers || []).map((s) => ({ value: s.id, label: s.name }))
        : [];

  const sourceOptions = isReceipt ? REASON_RECEIPT_OPTIONS : REASON_PAYMENT_OPTIONS;

  const paymentMethodOptions = [
    { value: 'CASH', label: 'Tiền mặt' },
    { value: 'BANK_TRANSFER', label: 'Chuyển khoản' },
    { value: 'CREDIT_CARD', label: 'Thẻ tín dụng' },
    { value: 'DEBIT_CARD', label: 'Thẻ ghi nợ' },
    { value: 'DIGITAL_WALLET', label: 'Ví điện tử' },
  ];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <Controller
            name="amount"
            control={form.control}
            render={({ field }) => (
              <NumberInput
                size="sm"
                radius="sm"
                label="Số tiền"
                placeholder="Nhập số tiền..."
                {...field}
                error={form.formState.errors.amount?.message}
                required
              />
            )}
          />
        </div>

        <div className="flex-1">
          <Controller
            name="payment_method"
            control={form.control}
            render={({ field }) => (
              <Select
                position="bottom"
                label="Phương thức thanh toán"
                data={paymentMethodOptions}
                value={field.value}
                onChange={field.onChange}
                error={form.formState.errors.payment_method?.message}
                size="sm"
                radius="sm"
              />
            )}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Controller
            name="contact_type"
            control={form.control}
            render={({ field }) => (
              <Select
                position="bottom"
                label="Loại đối tượng"
                data={[
                  { value: 'CUSTOMER', label: 'Khách hàng' },
                  { value: 'SUPPLIER', label: 'Nhà cung cấp' },
                  { value: 'OTHER', label: 'Khác' },
                ]}
                value={field.value}
                onChange={field.onChange}
                error={form.formState.errors.contact_type?.message}
                size="sm"
                radius="sm"
              />
            )}
          />
        </div>

        <div className="flex-1">
          <Controller
            name="contact_id"
            control={form.control}
            render={({ field }) => (
              <Select
                label="Đối tượng"
                position="bottom"
                data={contactOptions}
                value={field.value}
                onChange={field.onChange}
                disabled={contactType === 'OTHER'}
                error={form.formState.errors.contact_id?.message}
                size="sm"
                radius="sm"
                searchable
              />
            )}
          />
        </div>
      </div>

      <Controller
        name="transaction_source"
        control={form.control}
        render={({ field }) => (
          <Select
            label={`Lý do ${isReceipt ? 'thu' : 'chi'}`}
            position="bottom"
            data={sourceOptions}
            value={field.value}
            onChange={field.onChange}
            error={form.formState.errors.transaction_source?.message}
            size="sm"
            radius="sm"
          />
        )}
      />

      <Input
        label="Mô tả"
        placeholder="Nhập mô tả lý do"
        {...form.register('description')}
        error={form.formState.errors.description?.message}
        size="sm"
        radius="sm"
      />

      <label className="block text-sm font-medium text-gray-500 mb-1">Ghi chú</label>
      <textarea
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px] placeholder:text-sm placeholder:text-gray-500 placeholder:font-medium"
        placeholder="Ghi chú thêm"
        {...form.register('notes')}
      />
      {form.formState.errors.notes && (
        <p className="text-red-500 text-xs mt-1">{form.formState.errors.notes.message}</p>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          type="button"
          title="Hủy"
          size="sm"
          radius="sm"
        />
        <Button
          type="submit"
          loading={loading}
          title={isReceipt ? 'Tạo phiếu thu' : 'Tạo phiếu chi'}
          size="sm"
          radius="sm"
        />
      </div>
    </form>
  );
}
