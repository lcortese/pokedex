import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

const Header = () => {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const scrollWindowHandler: EventListener = (e: Event) => {
      const target = e.currentTarget as Window;

      if (compact && target.scrollY === 0) {
        setCompact(false);
      } else if (!compact && target.scrollY > 0) {
        setCompact(true);
      }
    };

    window.addEventListener('scroll', scrollWindowHandler);

    return () => {
      window.removeEventListener('scroll', scrollWindowHandler);
    };
  });

  const classes = ['Header', compact && 'compact'].filter(Boolean);

  console.log('classes', classes);

  return (
    <header className={classes.join(' ')}>
      <Link to="/" className="logo"><img src="/favicon/ms-icon-150x150.png" alt="Pokemon" /></Link>
      <h1>Catalog</h1>
    </header>
  );
};

export default Header;
