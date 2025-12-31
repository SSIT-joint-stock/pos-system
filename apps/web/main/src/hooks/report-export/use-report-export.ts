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
  return {
    exportReportSuppliers,
  };
}
