interface IBoxProps {
  title?: string;
  icon?: React.ReactNode;
  reveneu?: number;
  percent?: number;
}
export function ItemBoxChart({ title, reveneu, percent, icon }: IBoxProps) {
  return (
    <div className="bg-white py-5 px-4 rounded-xl flex items-center justify-between shadow">
      <div className="flex flex-col gap-2">
        <p className="text-gray-600 text-sm font-[500]">{title}</p>
        <div className="flex items-center gap-2">
          <p className="font-bold font-mono ">
            {reveneu?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
          <p className="text-green-700 font-bold">+{percent}%</p>
        </div>
      </div>
      <div className="p-2 bg-pos-blue-50 rounded-md text-pos-blue-400">{icon}</div>
    </div>
  );
}
