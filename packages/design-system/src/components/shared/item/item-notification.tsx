import { Timeline } from '@mantine/core';
import { Notification } from '../../../../../../apps/web/main/src/hooks/statistics/use-statistics';
export function ItemNotification({ notifications }: { notifications: Notification[] }) {
  return (
    <div className="p-2 ">
      <div className="relative flex items-center gap-4">
        <Timeline active={notifications?.length} bulletSize={18} lineWidth={2}>
          {notifications?.map((item, idx) => (
            <Timeline.Item key={idx}>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-gray-800">{item.title}</span>
                <span className="text-xs font-medium text-gray-500">{item.time}</span>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </div>
    </div>
  );
}
