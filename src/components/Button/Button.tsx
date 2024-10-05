import classNames from 'classnames/bind';
import React, { ReactNode, memo } from 'react';
import styles from './Button.module.scss';

type ButtonType = 'button' | 'submit' | 'reset';
type ButtonClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
type DisplayType = 'error' | 'approve' | 'primary';

interface IProps {
  fill?: boolean;
  title: ReactNode;
  handleOnclick?: ButtonClickHandler;
  customClass?: string;
  iconBefore?: any;
  iconAfter?: any;
  disabled?: boolean;
  displayType?: DisplayType;
  type?: ButtonType;
  handleOnMouseEnter?: ButtonClickHandler;
  handleOnMouseLeave?: ButtonClickHandler;
}

const cx = classNames.bind(styles);

const Button = memo(
  ({
    title,
    type,
    disabled,
    iconBefore,
    iconAfter,
    fill = false,
    customClass = '',
    displayType = 'primary',
    handleOnclick,
    handleOnMouseEnter,
    handleOnMouseLeave,
  }: IProps) => {
    const clasess = cx(
      'button',
      'border border-main text-sub bg-main transition duration-300',
      {
        fill,
        [customClass]: customClass,
        [displayType]: displayType,
      },
    );

    return (
      <button
        type={type}
        disabled={disabled}
        onClick={handleOnclick}
        className={clasess}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        {iconBefore && <span className="mr-2">{iconBefore}</span>}
        <b>{title}</b>
        {/* {iconAfter && <span className="ml-2">{{ iconAfter }}</span>} */}
      </button>
    );
  },
);

export default Button;
