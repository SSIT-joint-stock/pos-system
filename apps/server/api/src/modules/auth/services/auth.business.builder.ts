import { IBusinessInfor } from "../interfaces/auth.interface";

export class BusinessBuilder<T extends IBusinessInfor> {
  private data = {} as T;

  withPhone(phone: string) {
    this.data.phone = phone as T["phone"];
    return this;
  }

  withTaxCode(taxCode: string) {
    this.data.taxCode = taxCode as T["taxCode"];
    return this;
  }

  withAddress(address: string) {
    this.data.address = address as T["address"];
    return this;
  }

  withName(name: string) {
    this.data.name = name as T["name"];
    return this;
  }

  build(): T {
    return this.data;
  }
}

export class BusinessInforService {
  builder<T extends IBusinessInfor>(): BusinessBuilder<T> {
    return new BusinessBuilder<T>();
  }
}
