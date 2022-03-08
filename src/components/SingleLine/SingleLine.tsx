import React from 'react';

import { WrapperProps } from '../../types';

import './SingleLine.css';

type Props = WrapperProps & {
  title?: string
};

const SingleLine = ({ children, title }: Props) => (
  <span className="SingleLine" title={title}>{children}</span>
);

export default SingleLine;
