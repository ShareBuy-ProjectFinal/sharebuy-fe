import { Typography } from 'antd';
import React from 'react';

interface IProps {
  value: any;
  color?: string;
  className?: string;
}
const TextCustom = ({ value, color = 'text-[#5A607F]', className }: IProps) => {
  return (
    <Typography.Text className={`${color} ${className}`}>
      {value}
    </Typography.Text>
  );
};

export default TextCustom;
