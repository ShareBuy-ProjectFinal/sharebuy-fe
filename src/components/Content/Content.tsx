import classNames from 'classnames';
import { HtmlHTMLAttributes, ReactNode } from 'react';

interface IProps {
  isOpen?: boolean;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Content = ({
  children,
  className = '',
  isOpen = true,
  style,
}: IProps) => {
  const classes = classNames(
    className,
    !isOpen && 'hidden',
    'bg-white rounded-lg shadow-md p-5 mt-3',
  );

  return (
    <div className={classes} style={style}>
      {children}
    </div>
  );
};

export default Content;
