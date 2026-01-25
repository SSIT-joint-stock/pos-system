import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  getPaymentMethodLabel,
  getStockMovementStatusLabel,
} from '../../../../../../apps/web/main/src/constants/status';
import {
  Notification as NotificationType,
  TypeNotification,
} from '../../../../../../apps/web/main/src/hooks/statistics/use-statistics';
import { formatCurrency } from '../../../../../../apps/web/main/src/utils';
import { Loading } from '../../ui';
import SlidingTabs from '../chart-screen/sliding-line-chart';

dayjs.extend(relativeTime);
export function Notification({
  notifications,
  handleChangeTypeNotification,
  loadingNoti,
}: {
  notifications: NotificationType[];
  handleChangeTypeNotification: (value: TypeNotification) => void;
  loadingNoti: boolean;
}) {
  return (
    <>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-700">Thông báo</span>
          <button className="text-xs font-medium text-pos-blue-500 cursor-pointer">
            Đánh dấu tất cả là đã đọc
          </button>
        </div>
        <SlidingTabs
          data={[
            { name: 'Tất cả', value: 'all' },
            { name: 'Đơn hàng', value: 'order' },
            { name: 'Biến động kho', value: 'stock' },
          ]}
          onChangeTypeData={(value) =>
            handleChangeTypeNotification(value as unknown as TypeNotification)
          }
        />
      </div>

      <div className="h-[412px] overflow-y-auto divide-y divide-gray-100 mt-4 ">
        {loadingNoti ? (
          <div className="h-full w-full flex items-center justify-center">
            <Loading color="#3b82f6" />
          </div>
        ) : (
          <>
            {notifications?.map((item, idx) => (
              <div
                key={idx}
                className="hover:bg-gray-50 cursor-pointer border-b border-y-gray-100 py-4 px-2 transition-colors duration-200"
              >
                <NotificationItemContent item={item} />
              </div>
            ))}
            <div className="p-3 text-center text-sm text-pos-blue-600 hover:bg-pos-blue-50 cursor-pointer font-medium">
              Xem tất cả
            </div>
          </>
        )}
      </div>
    </>
  );
}
const NotificationItemContent = ({ item }: { item: NotificationType }) => {
  const time = dayjs(item.createdAt).fromNow();

  if (item.type === 'order') {
    return (
      <div className="flex gap-3">
        <div>
          <p className="text-xs text-gray-800">
            Đơn hàng <span className="font-semibold text-pos-blue-500">{item.data.code}</span> vừa
            được tạo với tổng giá trị {formatCurrency(item?.data?.amount)} bằng phương thức{' '}
            <span className="font-semibold ">
              {getPaymentMethodLabel(item?.data?.payment_method as string)}
            </span>
          </p>
          <p className="text-[10px] text-gray-400 mt-1">{time}</p>
        </div>
      </div>
    );
  }

  if (item.type === 'stock') {
    return (
      <div className="flex gap-3">
        <div>
          <p className="text-xs text-gray-800">
            Vừa tạo đơn{' '}
            <span className="font-semibold">
              {getStockMovementStatusLabel(item.data.stockType as string)}
            </span>{' '}
            cho sản phẩm{' '}
            <span className="font-semibold text-pos-blue-500">{item.data.variantName}</span> với số
            lượng {item.data.quantity}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">{time}</p>
        </div>
      </div>
    );
  }

  return null;
};
