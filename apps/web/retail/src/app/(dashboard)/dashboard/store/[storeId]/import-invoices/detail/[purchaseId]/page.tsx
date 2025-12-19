import { PurchaseOrdersDetailView } from '../../../../../../../../../../main/src/sections/dashboard/view';

export default function Page({ params }: { params: { storeId: string; purchaseId: string } }) {
  return <PurchaseOrdersDetailView purchaseId={params.purchaseId} />;
}
