import React from 'react';

import './Square.css';

import { WrapperProps } from '../@types';

const Square = ({ children }: WrapperProps) => (
  <div className="Square">
    <div className="Square__content">
      {children}
    </div>
  </div>
);

export default Square;
