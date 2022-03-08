import React from 'react';

import './Card.css';

import { WrapperProps } from '../../types';

type CardProps = WrapperProps & {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void,
  onAuxClick?: (e: React.MouseEvent<HTMLElement>) => void,
  disabled?: boolean,
  shadow?: boolean
};

const Card = ({
  className,
  children,
  onClick,
  onAuxClick,
  disabled = false,
  shadow = false,
}: CardProps) => {
  const classNames = [
    'Card',
    className,
    !disabled && onClick && 'Card--clickeable',
    shadow && 'Card--shadow',
  ].filter(Boolean).join(' ');

  return (
    <article
      className={classNames}
      onClick={!disabled ? onClick : undefined}
      onAuxClick={!disabled ? onAuxClick : undefined}
    >
      {children}
    </article>
  );
};

export default Card;
