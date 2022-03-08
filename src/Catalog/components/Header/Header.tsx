import React from 'react';

import HeaderPage from '../../../components/HeaderPage';
import Heading from '../../../components/Heading';

import './Header.css';

const Header = () => (
  <HeaderPage className="Header--catalog">
    <a className="logo" href="/"><img src="/favicon/ms-icon-150x150.png" alt="Pokemon" /></a>
    <Heading>Pokédex</Heading>
  </HeaderPage>
);

export default Header;
