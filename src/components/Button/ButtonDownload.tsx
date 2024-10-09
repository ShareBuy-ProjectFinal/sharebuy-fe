import { UploadOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import { DownloadBlueIcon, DownloadIcon } from 'assets/svgs';
import React, { forwardRef } from 'react';

interface IProps extends ButtonProps {
  classCustom?: string;
  fill?: boolean;
}
const ButtonDownload = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  IProps
>(({ children, fill = false, ...props }, ref) => {
  const className = fill
    ? 'bg-[#1e5eff] px-10 py-5 text-white text-lg hover:!text-[#1e5eff] hover:!bg-white'
    : 'bg-white px-10 py-5 text-[#1e5eff] text-lg hover:!text-white hover:!bg-[#1e5eff]';
  return (
    <Button
      className={props.classCustom || `${className} ${props.className} `}
      {...props}
      ref={ref}
    >
      <UploadOutlined style={{ fontSize: '22px', fontWeight: 'bold' }} />
      Export
    </Button>
  );
});

export default ButtonDownload;
