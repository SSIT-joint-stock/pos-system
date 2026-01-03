import { OrderDetailView } from '../../../../../../../../../../main/src/sections/dashboard/view';

export default function Page({ params }: { params: { storeId: string; orderId: string } }) {
  return <OrderDetailView orderId={params.orderId} />;
}
