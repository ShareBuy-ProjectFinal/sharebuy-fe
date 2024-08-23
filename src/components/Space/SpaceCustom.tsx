import { Space, SpaceProps } from 'antd';
import React from 'react';

const SpaceCustom: React.FC<SpaceProps> = (props) => {
  return (
    <Space
      className={`${props.className || 'bg-white p-5 w-full rounded-lg shadow-md'}`}
      {...props}
    >
      {props.children}
    </Space>
  );
};

export default SpaceCustom;
