export interface BankInfo {
  id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string;
}
export interface CurrentBankInfo {
  id: string;
  store_id: string;
  bank_code: string;
  bank_name: string;
  bank_account_number: string;
  bank_account_name: string;
  createdAt: string;
  updatedAt: string;
}
