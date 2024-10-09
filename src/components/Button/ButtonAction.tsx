import { Button, ButtonProps } from 'antd';
import { DeleteIcon, EditIcon } from 'assets/svgs';
import React, { forwardRef, memo } from 'react';

// Định nghĩa kiểu cho props
interface IProps extends ButtonProps {
  classCustom?: string;
  edit?: boolean;
  isIcon?: boolean;
  tooltip?: string;
}

const ButtonAction = memo(
  forwardRef<HTMLButtonElement | HTMLAnchorElement, IProps>(
    ({ children, edit = false, isIcon = true, tooltip, ...props }, ref) => {
      const className = edit
        ? 'bg-[#1e5eff] px-10 py-5 text-white text-lg hover:!text-[#1e5eff] hover:!bg-white'
        : 'bg-white px-10 py-5 text-[#1e5eff] text-lg hover:!text-white hover:!bg-[#1e5eff]';
      return (
        <Button
          {...props}
          className={
            props.classCustom ||
            `bg-white px-1 py-2 text-[#1e5eff] text-lg hover:!text-white hover:!bg-[#1e5eff] ${props.className} `
          }
          ref={ref}
        >
          {isIcon ? edit ? <EditIcon /> : <DeleteIcon /> : null}
        </Button>
      );
    },
  ),
);

export default ButtonAction;
