import React from 'react';

import { PresentationalProps } from '../../../types';

import BackIcon from '../../../components/BackIcon';

import './BackButton.css';

type Props = PresentationalProps & {
  onClick: () => void
};

const BackButton = ({ onClick }: Props) => (
  <button className="BackButton" onClick={onClick}>
    <BackIcon className="BackButton__icon" />
  </button>
);

export default BackButton;
