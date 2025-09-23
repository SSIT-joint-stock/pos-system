interface IBoxProps {
  title?: string;
  value?: number;
  percent?: number;
}
export function ItemBoxChart({ title, value, percent }: IBoxProps) {
  function formatNumber(num) {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " Tỷ";
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + " Triệu";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num.toString();
  }
  return (
    <div className="bg-white py-5 px-4 rounded-xl flex items-center gap-5 shadow">
      <div className="flex flex-col gap-2">
        <p className="text-gray-600 text-sm font-[500]">{title}</p>
        <div className="flex items-center gap-2">
          <p className="font-bold font-mono ">
            {formatNumber(value)?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
          <p className="text-green-700 font-bold">+{percent}%</p>
        </div>
      </div>
    </div>
  );
}
