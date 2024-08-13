import { Button, ButtonProps, Table, TableProps } from 'antd';
import React from 'react';

// interface a extends React.PropsWithChildren<TableProps> & React.RefAttributes<Reference>
type CustomButtonProps = Omit<ButtonProps, 'type'>;

interface IProps
  extends React.PropsWithChildren<CustomButtonProps>,
    React.RefAttributes<HTMLButtonElement | HTMLAnchorElement> {
  type?: 'button' | 'submit' | 'reset';
  custumClass?: string;
}
const ButtonCustom = (props: IProps) => {
  const {
    type,
    disabled,
    className,
    custumClass,
    iconPosition = 'start',
    children,
    onClick,
  } = props;
  // <Button />;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={
        custumClass ||
        `bg-white border-2 border-[#515DEF] hover:bg-[#515DEF] rounded-md px-12 py-3`
      }
    >
      {iconPosition === 'start' && props.icon}
      {children}
      {iconPosition === 'end' && props.icon}
    </button>
  );
};

export default ButtonCustom;
