import { IBusinessInfor } from "@/modules/auth";
import prisma, { Tenant } from "@shared/orm/prisma";

export type TenantEntity = Tenant;

export class TenantRepository {
  // Thêm business info vào tenant
  async addBusinessInfo(ownerId: string, info: IBusinessInfor) {
    return await prisma.tenant.create({
      data: {
        name: info.name,
        subdomain: "retail", // vd: retail-abc
        domainType: "RETAIL", // default cho MVP
        ownerId,
        meta: {
          phone: info.phone,
          address: info.address,
          taxCode: info.taxCode,
        },
      },
    });
  }

  async updateBusinessInfo(tenantId: string, info: IBusinessInfor) {
    return await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: info.name,
        meta: {
          ...(await this.getMeta(tenantId)), // lấy meta cũ
          phone: info.phone,
          address: info.address,
          taxCode: info.taxCode,
        },
      },
    });
  }

  // Lấy business info từ tenant
  async getBusinessInfo(tenantId: string): Promise<IBusinessInfor | null> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
    });

    if (!tenant) return null;

    const meta = tenant.meta as any;

    return {
      name: tenant.name,
      phone: meta?.phone ?? "",
      address: meta?.address ?? "",
      taxCode: meta?.taxCode ?? "",
    };
  }

  // helper để lấy meta
  private async getMeta(tenantId: string): Promise<Record<string, any>> {
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { meta: true },
    });
    return (tenant?.meta as any) || {};
  }
}
