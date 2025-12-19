interface IBoxProps {
  title?: string;
  value?: number | string;
  percent?: number;
  className?: string;
  icon?: React.ReactNode;
  bgIcon?: string;
  colorIcon?: string;
}
export function ItemBoxChart({
  title,
  value,
  percent,
  className,
  icon,
  bgIcon,
  colorIcon,
}: IBoxProps) {
  function formatNumber(num: number) {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + ' Tỷ';
    }
    return num;
  }
  return (
    <div
      className={`bg-white py-5 px-4 rounded-md flex items-center gap-5  ${className} border border-gray-200 `}
    >
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between w-full">
          <p className="text-gray-600 text-base font-medium">{title}</p>
          <span
            className={`w-12 h-12 flex items-center justify-center rounded-full ${bgIcon} ${colorIcon}`}
          >
            {icon}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-bold font-mono ">{formatNumber(value as number)}</p>
          {percent && <p className="text-green-700 font-bold">+{percent}%</p>}
        </div>
      </div>
    </div>
  );
}
