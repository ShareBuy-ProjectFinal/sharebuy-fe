import { Typography } from 'antd';
import React from 'react';

interface IProps {
  value: any;
  className?: string;
}
const LableCustom = ({ value, className }: IProps) => {
  return (
    <Typography.Text className={`text-lg font-bold ${className}`}>
      {value}
    </Typography.Text>
  );
};

export default LableCustom;
