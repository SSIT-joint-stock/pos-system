export enum payment_method {
  CASH = 'CASH', // Tiền mặt
  CREDIT_CARD = 'CREDIT_CARD', // Thẻ tín dụng
  DEBIT_CARD = 'DEBIT_CARD', // Thẻ ghi nợ
  BANK_TRANSFER = 'BANK_TRANSFER', // Chuyển khoản
  DIGITAL_WALLET = 'DIGITAL_WALLET', // Ví điện tử (MoMo, ZaloPay, etc.)
}

export const formatPaymentMethod = (method: payment_method) => {
  const translations: Record<payment_method, string> = {
    [payment_method.CASH]: 'Tiền mặt',
    [payment_method.DEBIT_CARD]: 'Thẻ ghi nợ',
    [payment_method.CREDIT_CARD]: 'Thẻ tín dụng',
    [payment_method.BANK_TRANSFER]: 'Chuyển khoản',
    [payment_method.DIGITAL_WALLET]: 'Ví điện tử',
  };
  return method ? translations[method] || 'Không xác định' : 'Chưa cập nhật';
};
