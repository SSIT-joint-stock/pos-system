import { PurchaseOrdersView } from '../../../../../../../../../../main/src/sections/dashboard/view';

export default function Page({ params }: { params: { storeId: string; purchaseId: string } }) {
  return <PurchaseOrdersView purchaseId={params.purchaseId} />;
}
