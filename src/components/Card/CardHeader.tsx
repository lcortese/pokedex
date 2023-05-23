import React from 'react';

import { WrapperProps } from '../@types';

const CardHeader = ({ children }: WrapperProps) => (
  <header className="CardHeader">{children}</header>
);

export default CardHeader;
