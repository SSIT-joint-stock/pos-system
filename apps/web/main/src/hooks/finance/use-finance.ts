import { zodResolver } from '@hookform/resolvers/zod';
import useToast from '@repo/design-system/hooks/client/use-toast-notification';
import { CashBookReport, CashTransaction, DashboardStats } from '@repo/design-system/types';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../../libs/axios';
import {
  CreatePaymentInput,
  CreatePaymentSchema,
  CreateReceiptInput,
  CreateReceiptSchema,
} from '../../schemas/finance/finance.schema';
import { exportExcel } from '../../utils/export-excel/export';
import { FilterValue, useQueryParams } from '../query/use-query-params';
import { useRequestHelper } from '../use-request-helper';

interface FinanceFilters extends Record<string, FilterValue> {
  q?: string;
  transaction_type?: string;
  payment_method?: string;
  from_date?: string;
  to_date?: string;
}

export function useFinance() {
  const [transactions, setTransactions] = useState<CashTransaction[]>([]);
  const [transaction, setTransaction] = useState<CashTransaction | null>(null);
  const [cashBookReport, setCashBookReport] = useState<CashBookReport | null>(null);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const { loading, requestWrapper } = useRequestHelper();
  const { showSuccessToast } = useToast();
  const {
    paginationParams,
    filters,
    pagination,
    setPaginationParams,
    setFilters,
    setPagination,
    buildParams,
  } = useQueryParams<FinanceFilters>({
    search: 'search',
    transaction_type: 'transaction_type',
    payment_method: 'payment_method',
    from_date: 'from_date',
    to_date: 'to_date',
  });

  const createReceiptForm = useForm<CreateReceiptInput>({
    resolver: zodResolver(CreateReceiptSchema),
  });

  const createPaymentForm = useForm<CreatePaymentInput>({
    resolver: zodResolver(CreatePaymentSchema),
  });

  const getTransactions = useCallback(async () => {
    const res = await requestWrapper(() =>
      api.get(`/finance/transactions?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setTransactions(res?.data?.data || []);
      setPagination(res?.data?.pagination);
    }
  }, [buildParams, requestWrapper, setPagination]);

  const getCashBookReport = useCallback(async () => {
    const res = await requestWrapper(() =>
      api.get(`/finance/cash-book?${buildParams().toString()}`)
    );
    if (res?.data.success) {
      setCashBookReport(res?.data?.data);
    }
  }, [buildParams, requestWrapper]);

  const getCurrentBalance = useCallback(async () => {
    const res = await requestWrapper(() => api.get(`/finance/balance`));
    if (res?.data.success) {
      setCurrentBalance(res?.data?.data);
    }
  }, [requestWrapper]);

  const getDashboard = useCallback(async () => {
    const res = await requestWrapper(() => api.get(`/finance/dashboard`));
    if (res?.data.success) {
      setDashboardStats(res?.data?.data);
    }
  }, [requestWrapper]);

  const getTransactionDetail = useCallback(
    async (id: string) => {
      const res = await requestWrapper(() => api.get(`/finance/transactions/${id}`));
      if (res?.data.success) {
        setTransaction(res?.data?.data);
      }
    },
    [requestWrapper]
  );

  const createReceipt = async (data: CreateReceiptInput): Promise<boolean> => {
    const res = await requestWrapper(() => api.post(`/finance/receipts`, data));
    console.log(res?.data);
    if (res?.data.success) {
      showSuccessToast(res.data.message || 'Tạo phiếu thu thành công');
      getTransactions();
      getDashboard(); // Refresh stats on success
      return true;
    }
    return false;
  };

  const createPayment = async (data: CreatePaymentInput): Promise<boolean> => {
    const res = await requestWrapper(() => api.post(`/finance/payments`, data));
    if (res?.data.success) {
      showSuccessToast(res.data.message || 'Tạo phiếu chi thành công');
      getTransactions();
      getDashboard(); // Refresh stats on success
      return true;
    }
    return false;
  };

  const cancelTransaction = async (transactionId: string) => {
    const res = await requestWrapper(() =>
      api.delete(`/finance/transactions/${transactionId}?cancelled_by=admin-user-id`)
    );
    if (res?.data.success) {
      showSuccessToast(res.data.message);
      getTransactions();
      getDashboard(); // Refresh stats on success
    }
  };

  // EXCEL

  const exportTransactions = useCallback(async () => {
    await requestWrapper(async () => {
      const res = await api.get('/finance/excel/transactions/export', {
        responseType: 'blob',
      });

      exportExcel(
        res,
        `danh_sach_thu_chi_${new Date().toLocaleDateString()}.xlsx`,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
    });
  }, [requestWrapper]);

  return {
    transactions,
    transaction,
    cashBookReport,
    currentBalance,
    dashboardStats,
    loading,
    pagination,
    paginationParams,
    filters,
    setFilters,
    setPaginationParams,
    getTransactions,
    getTransactionDetail,
    getCashBookReport,
    getCurrentBalance,
    getDashboard,
    createReceipt,
    createPayment,
    cancelTransaction,
    exportTransactions,
    createReceiptForm,
    createPaymentForm,
  };
}
