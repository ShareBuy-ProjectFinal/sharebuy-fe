import React, { useRef, useState } from 'react';
import { Input, InputProps } from 'antd';
import { EyeIcon, EyeOffIcon } from 'assets/svgs';

interface IProps extends InputProps {
  label: any;
  required?: boolean;
  value?: any;
  password?: boolean;
}
const FloatInput = (props: IProps) => {
  const { label, value, placeholder, type, required, password = false } = props;

  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);

  const requiredMark = required ? <span className="text-danger">*</span> : null;

  return (
    <div
      className="float-label"
      onMouseLeave={() => setHover(false)}
      onMouseEnter={() => setHover(true)}
      onBlur={() => setFocus(false)}
      onFocus={() => setFocus(true)}
    >
      {password ? (
        <Input.Password
          onChange={props.onChange}
          type={type}
          defaultValue={value}
          className={`p-3`}
          iconRender={(visible) => (visible ? <EyeIcon /> : <EyeOffIcon />)}
          placeholder={placeholder}
        />
      ) : (
        <Input
          onChange={props.onChange}
          type={type}
          defaultValue={value}
          className={`${props.className} p-3`}
          placeholder={placeholder}
        />
      )}
      <label
        className={focus || hover ? 'labelF as-label' : 'labelF as-placeholder'}
      >
        {label} {requiredMark}
      </label>
    </div>
  );
};

export default FloatInput;
