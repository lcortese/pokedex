import React from 'react';

import './styles/reset.css';
import './styles/variables.css';
import './styles/theme.css';

type Props = {
  children: React.ReactNode
};

const Theme = ({ children }: Props) => {
  const link = document.createElement( 'link' );
  link.href = 'https://fonts.googleapis.com/css2?family=Noto+Serif';
  link.rel = 'stylesheet';
  
  document.getElementsByTagName('head')[0].appendChild(link);

  return <>{children}</>;
};

export default Theme;
