interface IBoxProps {
  title?: string;
  icon?: React.ReactNode;
  reveneu?: string;
  percent?: string;
}
export function ItemBoxChart({ title, reveneu, percent, icon }: IBoxProps) {
  return (
    <div className="bg-white py-5 px-4 rounded-xl flex items-center justify-between">
      <div className="">
        <p className="text-gray-300 text-sm">{title}</p>
        <div className="flex items-center gap-2">
          <p className="font-bold ">{reveneu}</p>
          <p className="text-green-300">+{percent}%</p>
        </div>
      </div>
      <div className="p-2 bg-pos-blue-400  rounded-md text-white">{icon}</div>
    </div>
  );
}
