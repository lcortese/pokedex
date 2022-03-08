import React from 'react';
import { Link } from 'react-router-dom';

import HeaderPage from '../../../components/HeaderPage';
import Heading from '../../../components/Heading';

import './Header.css';

const Header = () => (
  <HeaderPage className="Header--catalog">
    <Link to="/" className="logo"><img src="/favicon/ms-icon-150x150.png" alt="Pokemon" /></Link>
    <Heading>Pokédex</Heading>
  </HeaderPage>
);

export default Header;
