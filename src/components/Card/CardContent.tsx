import React from 'react';

import { WrapperProps } from '../../types';

const CardContent = ({ children }: WrapperProps) => (
  <div className="CardContent">
    {children}
  </div>
);

export default CardContent;
