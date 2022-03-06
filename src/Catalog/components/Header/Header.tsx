import React from 'react';
import { Link } from 'react-router-dom';

import Heading from '../../../components/Heading';

import './Header.css';

const Header = () => (
  <header className="Header">
    <Link to="/" className="logo"><img src="/favicon/ms-icon-150x150.png" alt="Pokemon" /></Link>
    <Heading>Pokédex</Heading>
  </header>
);

export default Header;
