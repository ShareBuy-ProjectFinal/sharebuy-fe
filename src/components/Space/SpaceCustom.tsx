import { Space, SpaceProps } from 'antd';
import React, { forwardRef } from 'react';

interface IProps extends SpaceProps {
  classNameCustom?: string;
  width?: string;
}

const SpaceCustom = forwardRef((props: IProps, ref?: any) => {
  const { width, className, style, ...order } = props;
  return (
    <div
      className={`${props.classNameCustom || `bg-white p-5 w-full rounded-lg shadow-md ${className}`}`}
      {...order}
      {...(width && { style: { width: width, ...style } })}
      ref={ref}
    >
      {props.children}
    </div>
  );
});

export default SpaceCustom;
