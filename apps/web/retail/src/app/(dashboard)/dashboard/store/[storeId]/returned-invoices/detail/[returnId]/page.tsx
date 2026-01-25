import { ReturnOrderDetailView } from '../../../../../../../../../../main/src/sections/dashboard/view';

export default function Page({ params }: { params: { storeId: string; returnId: string } }) {
  return <ReturnOrderDetailView returnId={params.returnId} />;
}
