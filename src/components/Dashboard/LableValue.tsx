import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import React from 'react';

interface IProps {
  label: any;
  value: any;
  footer?: any;
  isRaise?: boolean;
  isStyle?: boolean;
  reverseOrder?: boolean;
}

const LableValue = ({
  label,
  value,
  footer,
  isRaise = true,
  isStyle = true,
  reverseOrder = false,
}: IProps) => {
  return (
    <Space
      className={
        isStyle
          ? 'bg-white shadow-md w-full p-3 pl-5 rounded-lg min-w-36'
          : 'min-w-36'
      }
      direction="vertical"
      size={0}
    >
      {reverseOrder ? (
        <>
          <Typography.Text className="text-xl font-bold">
            {value}
          </Typography.Text>
          <Typography.Text className="text-[#5A607F]">{label}</Typography.Text>
        </>
      ) : (
        <>
          <Typography.Text className="text-[#5A607F]">{label}</Typography.Text>
          <Typography.Text className="text-xl font-bold">
            {value}
          </Typography.Text>
        </>
      )}{' '}
      {footer && (
        <Typography.Text type={`${isRaise ? 'success' : 'danger'}`}>
          {footer}
          {'  '}
          {isRaise ? (
            <UpOutlined style={{ fontSize: '12px' }} />
          ) : (
            <DownOutlined style={{ fontSize: '12px' }} />
          )}
        </Typography.Text>
      )}
    </Space>
  );
};

export default LableValue;
