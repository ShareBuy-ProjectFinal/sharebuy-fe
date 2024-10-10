import { InputNumber, InputNumberProps } from 'antd';
import React, { memo } from 'react';
import formatNumber from 'utils/function';

const InputNumberForm = (
  props: React.PropsWithChildren<InputNumberProps<any>> &
    React.RefAttributes<HTMLInputElement>,
) => {
  return (
    <InputNumber
      formatter={(value: any) => {
        return value ? formatNumber(value) : '';
      }}
      parser={(value: any) => {
        return parseFloat(value.replace(/\./g, '')?.replace(',', '.'));
      }}
      {...props}
      className={`${props.className} w-full`}
    />
  );
};

export default memo(InputNumberForm);
