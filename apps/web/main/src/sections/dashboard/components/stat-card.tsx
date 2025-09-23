import { TrendingUp } from 'lucide-react';

const StatCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  bgColor = 'bg-pos-blue-50',
  textColor = 'text-pos-blue-500',
  trend,
}: {
  icon: any;
  title: string;
  value: string | number;
  subtitle?: string;
  bgColor?: string;
  textColor?: string;
  trend?: number | null;
}) => (
  <div className="bg-white py-5 px-4 rounded-xl flex items-center gap-5 shadow hover:shadow-lg transition-shadow h-full">
    <div className={`p-2 ${bgColor} ${textColor} rounded-full`}>
      <Icon size={24} />
    </div>
    <div className="flex flex-col gap-1">
      <h2 className="text-gray-600 font-semibold text-xl">{title}</h2>
      <span className={`${textColor} text-lg font-bold`}>{value}</span>
      {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
      {trend && (
        <div
          className={`flex items-center gap-1 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          <TrendingUp size={12} />
          <span>
            {trend > 0 ? '+' : ''}
            {trend}% so với tháng trước
          </span>
        </div>
      )}
    </div>
  </div>
);

export default StatCard;
