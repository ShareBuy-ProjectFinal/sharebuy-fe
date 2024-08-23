import { Typography } from 'antd';
import React from 'react';

interface IProps {
  value: any;
}
const TextCustom = ({ value }: IProps) => {
  return <Typography.Text className="text-[#5A607F]">{value}</Typography.Text>;
};

export default TextCustom;
