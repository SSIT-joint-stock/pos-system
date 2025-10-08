import {
  Notification,
  TypeNotification,
} from '../../../../../../apps/web/main/src/hooks/statistics/use-statistics';
import { Loading } from '../../ui';
import SlidingTabs from '../chart-screen/sliding-line-chart';
export function ItemNotification({
  notifications,
  handleChangeTypeNotification,
  loadingNoti,
}: {
  notifications: Notification[];
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
                <p className="text-xs text-gray-800 font-medium">{item.title}</p>
                <p className="text-xs text-gray-500 mt-1">{item.time}</p>
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
