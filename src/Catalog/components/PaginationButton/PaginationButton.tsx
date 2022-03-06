import React from 'react';

import { WrapperProps } from '../../../types';

import './styles.css';

type Props = WrapperProps & {
  onClick: () => void
  disabled?: boolean,
};

const PaginationButton = ({ children, onClick, disabled = false }: Props) => (
  <button className="PaginationButton" onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

export default PaginationButton;
