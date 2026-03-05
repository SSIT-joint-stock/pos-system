export default function StoreOverviewPage({ params }: { params: { storeId: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Store Overview</h1>
      <p>Store ID: {params.storeId}</p>
    </div>
  );
}
