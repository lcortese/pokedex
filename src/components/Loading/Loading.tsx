import React from 'react';

import { PresentationalProps } from '../../types';

import './Loading.css';

type Props = PresentationalProps & {
  staticPosition?: boolean
};

const Loading = ({ className, staticPosition = false } : Props) => (
  <div className={['Loading', className, staticPosition && 'static'].filter(Boolean).join(' ')}>
    <img className="Loading__icon" src="/assets/loading.png" alt="Loading" />
  </div>
);

export default Loading;
