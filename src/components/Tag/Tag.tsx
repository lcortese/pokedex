import React from 'react';

import { WrapperProps } from '../../types';

import './Tag.css';

const Tag = ({ children }: WrapperProps) => (
  <div className="Tag">{children}</div>
);

export default Tag;
