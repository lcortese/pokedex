import React from 'react';

import './styles.css';

import { WrapperProps } from '../../types';

type CardProps = WrapperProps & {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void,
  disabled: boolean
};

const Card = ({ className, children, onClick, disabled = false }: CardProps) => {
  const classNames = [
    'Card',
    className,
    !disabled && onClick && 'clickeable',
  ].filter(Boolean).join(' ');

  return (
    <article className={classNames} onClick={!disabled ? onClick : undefined}>
      {children}
    </article>
  );
};

export default Card;
