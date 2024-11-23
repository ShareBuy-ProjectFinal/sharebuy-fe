import { Modal, ModalProps } from 'antd';
import { isCancel } from 'axios';
import ButtonCustom from 'components/Button/ButtonCustom';
import LableCustom from 'components/Text/LableCustom';
import TextCustom from 'components/Text/TextCustom';
import React, { FunctionComponent, memo } from 'react';

interface Iprops extends ModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isCancel?: boolean;
  value?: string;
  children?: React.ReactNode;
  handleOk: (props?: any) => void;
  handleCancel?: (props?: any) => void;
}
const PopupHandleOrder = memo((props: Iprops) => {
  const { isOpen, setIsOpen, isCancel = false, handleOk } = props;

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      onOk={() => handleOk()}
      title={
        <div className="pb-1 border-b-2 w-full ">
          <LableCustom value={!isCancel ? 'Xác nhận' : 'Huỷ đơn hàng'} />
        </div>
      }
      okText={isCancel ? 'Huỷ' : 'Lưu'}
      cancelText="Hủy"
      okButtonProps={{
        className: `${isCancel ? 'bg-[#F0142F] hover:!bg-[#f0142eae]' : 'bg-[#315df6] hover:!bg-[#315df6ae]'}  px-6 rounded-md`,
      }}
      cancelButtonProps={{
        className: `${isCancel ? 'text-[#F0142F] hover:!border-[#F0142F] hover:!text-[#F0142F]' : 'text-[#315df6] hover:!border-[#315df6] hover:!text-[#315df6]'} px-6 rounded-md`,
      }}
      classNames={{
        body: 'mt-3 mb-6',
        footer: 'flex justify-end gap-1',
      }}
      {...props}
    >
      <TextCustom
        value={
          isCancel
            ? 'Bạn có muốn xóa đơn hàng chọn không'
            : 'Chuyển đơn hàng sang trạng thái vận chuyển'
        }
      />
    </Modal>
  );
});

export default PopupHandleOrder;
