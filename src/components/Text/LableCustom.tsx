import { Typography } from 'antd';
import React from 'react';

interface IProps {
  value: any;
}
const LableCustom = ({ value }: IProps) => {
  return (
    <Typography.Text className="text-lg font-bold">{value}</Typography.Text>
  );
};

export default LableCustom;
