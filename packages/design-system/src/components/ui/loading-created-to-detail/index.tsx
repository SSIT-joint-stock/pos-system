import { Loading } from '@repo/design-system/components/ui/loading';

export function LoadingCreatedToDetail() {
  return (
    <div className="absolute inset-0 z-50 bg-white/80 flex items-center justify-center">
      <div className="flex items-center gap-4">
        <Loading size="sm" color="#3b82f6" />
        <span className="text-pos-blue-500 text-sm">Đang chuyển trang...</span>
      </div>
    </div>
  );
}
