import { Button, ButtonProps, Table, TableProps } from 'antd';
import React from 'react';

// interface a extends React.PropsWithChildren<TableProps> & React.RefAttributes<Reference>
// type CustomButtonProps = Omit<ButtonProps, 'type'>;

interface IProps
  extends React.PropsWithChildren<Omit<ButtonProps, 'size'>>,
    React.RefAttributes<HTMLButtonElement | HTMLAnchorElement> {
  custumClass?: string;
  size?: 'small' | 'middle' | 'large' | string;
  fill?: boolean;
  border?: string;
  radius?: string;
  value?: string;
}
const ButtonCustom = (props: IProps) => {
  const {
    type,
    htmlType = 'submit',
    disabled,
    className,
    custumClass,
    iconPosition = 'start',
    children,
    size = 'middle',
    fill,
    border = 'border-2 border-[#515DEF]',
    radius = 'rounded-md',
    value,
    onClick,
  } = props;
  // <Button />;
  let classNameSize = size;
  if (size === 'small') classNameSize = 'px-2 py-1';
  if (size === 'middle') classNameSize = 'px-4 py-2';
  if (size === 'large') classNameSize = 'px-12 py-3';

  const classNameFill = fill
    ? 'text-white bg-[#515DEF] hover:text-[#515DEF] hover:bg-white'
    : 'text-[#515DEF] bg-white  hover:text-white hover:bg-[#515DEF]';

  return (
    <button
      type={htmlType}
      onClick={onClick}
      disabled={disabled}
      className={
        custumClass ||
        `text-base font-semibold ${radius} ${border} ${classNameFill} ${classNameSize} ${className}`
      }
    >
      {iconPosition === 'start' && props.icon}
      {children} {value}
      {iconPosition === 'end' && props.icon}
    </button>
  );
};

export default ButtonCustom;
