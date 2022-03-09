import React from 'react';

import { WrapperProps } from '../../types';

import './HeaderPage.css';

const HeaderPage = ({ children, className }: WrapperProps) => (
  <header className={['HeaderPage', className].filter(Boolean).join(' ')}>
    {children}
  </header>
);

export default HeaderPage;