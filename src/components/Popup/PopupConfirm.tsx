import { Modal, ModalProps } from 'antd';
import ButtonCustom from 'components/Button/ButtonCustom';
import LableCustom from 'components/Text/LableCustom';
import TextCustom from 'components/Text/TextCustom';
import React, { FunctionComponent, memo } from 'react';

interface Iprops extends ModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  edit?: boolean;
  value?: string;
  children?: React.ReactNode;
  handleOk: (props?: any) => void;
  handleCancel: (props?: any) => void;
}
const PopupConfirm = memo((props: Iprops) => {
  const {
    isOpen,
    setIsOpen,
    edit = false,
    value,
    children,
    handleOk,
    handleCancel,
  } = props;

  console.log('PopupConfirm');

  return (
    <Modal
      open={isOpen}
      onCancel={() => handleCancel()}
      onOk={() => handleOk()}
      title={
        <div className="pb-1 border-b-2 w-full">
          <LableCustom value={edit ? 'Xác nhận' : 'Xóa sản phẩm'} />
        </div>
      }
      okText={edit ? 'Lưu' : 'Xóa'}
      cancelText="Hủy"
      okButtonProps={{
        className: 'bg-[#F0142F] hover:!bg-[#f0142eae] px-6 rounded-md',
      }}
      cancelButtonProps={{
        className:
          'text-[#F0142F]  hover:!text-[#F0142F] hover:!border-[#F0142F]',
      }}
      classNames={{
        body: 'mt-3 mb-6',
        footer: 'flex justify-end gap-1',
      }}
      {...props}
    >
      {value && <TextCustom value={value} />}
      {children}
    </Modal>
  );
});

export default PopupConfirm;
