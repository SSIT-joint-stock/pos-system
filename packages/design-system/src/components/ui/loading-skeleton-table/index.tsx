const SkeletonRow = ({ numColumns }: { numColumns: number }) => {
  return (
    <tr className="border-b border-b-gray-100 animate-pulse">
      {Array.from({ length: numColumns }).map((_, idx) => (
        <td key={idx} className="px-3 py-3">
          <div className="h-4 bg-gray-100 rounded-sm"></div>
        </td>
      ))}
    </tr>
  );
};

export const TableSkeleton = ({
  numRows = 10,
  numColumns,
}: {
  numRows?: number;
  numColumns: number;
}) => {
  return (
    <>
      {Array.from({ length: numRows }).map((_, idx) => (
        <SkeletonRow key={idx} numColumns={numColumns} />
      ))}
    </>
  );
};
