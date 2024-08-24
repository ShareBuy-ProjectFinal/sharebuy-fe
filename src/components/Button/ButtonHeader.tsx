import { Button, ButtonProps } from 'antd';
import React, { forwardRef } from 'react';

// Định nghĩa kiểu cho props
interface ButtonHeaderProps extends ButtonProps {
  children: React.ReactNode;
}

const ButtonHeader = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonHeaderProps
>(({ children, ...props }, ref) => {
  return (
    <Button
      className={props.className || 'bg-[#1E5EFF] px-4 py-2 text-white'}
      {...props}
      ref={ref}
    >
      {children}
    </Button>
  );
});

export default ButtonHeader;
