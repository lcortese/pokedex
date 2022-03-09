import React from 'react';

import { WrapperProps } from '../../types';

import './Heading.css';
import { Types } from './types';

type Props = WrapperProps & {
  type?: Types,
  size?: Types,
  capitalize?: boolean,
};

const Heading = ({
  children,
  className,
  type = Types.H1,
  size,
  capitalize = false,
}: Props) => {
  const classNames = [
    'Heading',
    size || type,
    className,
    capitalize && 'capitalize',
  ].filter(Boolean).join(' ');

  const Tag = type;

  return (
    <Tag className={classNames}>{children}</Tag>
  );
};

export default Heading;
