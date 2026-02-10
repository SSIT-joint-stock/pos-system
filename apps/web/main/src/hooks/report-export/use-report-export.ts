import api from '../../libs/axios';
import { exportExcel } from '../../utils/export-excel/export';

export function useReportExport() {
  const exportReportSuppliers = async () => {
    const res = await api.get(`/report/excel/suppliers`, {
      responseType: 'blob',
    });
    exportExcel(
      res,
      `bao_cao_nha_cung_cap_${new Date().toLocaleDateString()}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  };
  const exportReportCustomer = async () => {
    const res = await api.get(`/report/excel/customers`, {
      responseType: 'blob',
    });
    exportExcel(
      res,
      `bao_cao_khach_hang_${new Date().toLocaleDateString()}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  };
  const exportReportOrders = async () => {
    const res = await api.get(`/report/excel/order-items`, {
      responseType: 'blob',
    });
    exportExcel(
      res,
      `bao_cao_mua_hang_${new Date().toLocaleDateString()}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  };
  const exportReportStoreMembers = async () => {
    const res = await api.get(`/report/excel/store-members`, {
      responseType: 'blob',
    });
    exportExcel(
      res,
      `bao_cao_nhan_vien_${new Date().toLocaleDateString()}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  };

  const exportReportOrderReturn = async () => {
    const res = await api.get(`/report/excel/order-returns`, {
      responseType: 'blob',
    });
    exportExcel(
      res,
      `bao_cao_tra_hang_kh_${new Date().toLocaleDateString()}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  };

  const exportReportStocks = async () => {
    const res = await api.get(`/report/excel/stocks`, {
      responseType: 'blob',
    });
    exportExcel(
      res,
      `bao_cao_ton_kho_${new Date().toLocaleDateString()}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  };

  const exportReportPurchaseInvoices = async () => {
    const res = await api.get(`/report/excel/purchase-invoices`, {
      responseType: 'blob',
    });
    exportExcel(
      res,
      `bao_cao_so_kho_${new Date().toLocaleDateString()}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  };

  return {
    exportReportSuppliers,
    exportReportCustomer,
    exportReportOrders,
    exportReportStoreMembers,
    exportReportOrderReturn,
    exportReportStocks,
    exportReportPurchaseInvoices,
  };
}
