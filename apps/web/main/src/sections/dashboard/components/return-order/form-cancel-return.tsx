import { Button, Modal } from '@repo/design-system/components/ui';

export function FormCancelReturn({
  isCancelReturnOrder,
  orderReturn,
  setIsCancelReturnOrder,
  cancelOrderReturn,
  getReturnOrder,
}: {
  isCancelReturnOrder: boolean;
  orderReturn?: { id: string; order_number: string };
  setIsCancelReturnOrder: (value: boolean) => void;
  cancelOrderReturn: (returnId: string) => Promise<boolean>;
  getReturnOrder: (returnId: string) => Promise<void>;
}) {
  return (
    <Modal
      size="lg"
      title={<p className="text-base font-semibold">Huỷ đơn trả hàng</p>}
      opened={isCancelReturnOrder}
      onClose={() => setIsCancelReturnOrder(false)}
    >
      <p className="text-center font-medium">
        Bạn có chắc chắn muốn hủy đơn trả hàng{' '}
        <span className="font-semibold">{orderReturn?.order_number}</span> không?
      </p>
      <p className="text-center font-medium mt-2 ">
        Sau khi hủy, yêu cầu trả hàng này sẽ không còn hiệu lực và không thể khôi phục lại. Vui lòng
        kiểm tra kỹ thông tin trước khi tiếp tục.
      </p>
      <div className="flex items-center gap-4 justify-end mt-5">
        <Button
          variant="default"
          onClick={() => setIsCancelReturnOrder(false)}
          size="sm"
          radius="sm"
          title="Hủy yêu cầu"
        />
        <Button
          onClick={async () => {
            if (!orderReturn) return;
            const success = await cancelOrderReturn(orderReturn?.id);
            if (success) {
              setIsCancelReturnOrder(false);
              getReturnOrder(orderReturn?.id);
            }
          }}
          color="#fb2c36"
          size="sm"
          radius="sm"
          title="Xác nhận hủy đơn hàng"
        />
      </div>
    </Modal>
  );
}
