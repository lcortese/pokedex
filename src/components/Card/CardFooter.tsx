import React from 'react';

import { WrapperProps } from '../@types';

const CardFooter = ({ children }: WrapperProps) => (
  <footer className="CardFooter">{children}</footer>
);

export default CardFooter;
