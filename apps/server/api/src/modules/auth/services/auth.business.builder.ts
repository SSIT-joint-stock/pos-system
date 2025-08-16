import { IBusinessInfor } from "../interfaces/auth.interface";

export class BusinessBuilder<T extends IBusinessInfor> {
  private phone?: string;
  private taxCode?: string;
  private address?: string;
  private name?: string;

  withPhone(phone: string) {
    this.phone = phone;
    return this;
  }
  withTaxCode(taxCode: string) {
    this.taxCode = taxCode;
    return this;
  }
  withAddress(address: string) {
    this.address = address;
    return this;
  }
  withName(name: string) {
    this.name = name;
    return this;
  }
  build() {
    const phone = this.phone
    const taxCode = this.taxCode
    const address = this.address
    const name = this.name
    return {
      name, phone, taxCode, address
    }
  }
}

export class BusinessInforService {
  builder<T extends IBusinessInfor>(): BusinessBuilder<T> {
    return new BusinessBuilder<T>();
  }
}
