import React from 'react';

import { WrapperProps } from '../@types';

const CardContent = ({ children, className = '' }: WrapperProps) => (
  <div className={['CardContent', className].join(' ')}>
    {children}
  </div>
);

export default CardContent;
