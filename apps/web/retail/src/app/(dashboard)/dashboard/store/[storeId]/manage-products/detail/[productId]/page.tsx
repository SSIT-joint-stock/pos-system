import { ProductView } from '../../../../../../../../../../main/src/sections/dashboard/view';

export default function Page({ params }: { params: { storeId: string; productId: string } }) {
  return <ProductView productId={params.productId} />;
}
