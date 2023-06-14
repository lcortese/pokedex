import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import Loading from '../components/Loading';
import usePokemon from '../Pokemon/hooks/usePokemon';

import './Catalog.css';

import Header from './components/Header';
import Item from './components/Item';
import PaginationButton from './components/PaginationButton';

import useCatalog from './hooks/useCatalog';

const ITEMS_PER_PAGE = 20;

const Catalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { items, total, loading, loaded, range, error, load, loadPrev, loadNext } = useCatalog();
  const { loadItems } = usePokemon();

  const offset = parseInt(searchParams.get('offset') || '') || 0;

  /*
   * Load data
   */
  useEffect(() => {
    let action;

    if (!loaded) {
      action = load;
    } else {
      if (offset + ITEMS_PER_PAGE > range.max) {
        action = loadNext;
      } else
      if (offset < range.min) {
        action = loadPrev;
      }
    }

    if (action) {
      action({
        offset,
        limit: ITEMS_PER_PAGE,
      }).then(loadItems);
    }
  }, [offset]);

  const goToPrev = () => {
    setSearchParams({
      offset: (Math.max(range.min - ITEMS_PER_PAGE, 0)).toString(),
    }, {
      replace: true,
    });
  };

  const goToNext = () => {
    setSearchParams({
      offset: range.max.toString(),
    }, {
      replace: true,
    });
  };

  return (
    <main className="Catalog">
      <Header />
      <div className="Catalog__content">
        {loading ? (
          <Loading />
        ) : null}

        {error ? (
          <div>Error: {error}</div>
        ) : null}

        {loaded && !items.length ? (
          <div>No results</div>
        ) : null}

        {loaded && items.length ? (
          <>

          {range.min > 0 ? (
            <PaginationButton onClick={goToPrev} disabled={loading}>
              Load Prev
            </PaginationButton>
          ) : null}

          <ul className="Items">
            {items.map((id: number) => (
              <li key={id}>
                <Item id={id} />
              </li>
            ))}
          </ul>

          {range.max < total ? (
            <PaginationButton onClick={goToNext} disabled={loading}>
              Load Next
            </PaginationButton>
          ) : null}

        </>) :  null}
      </div>
    </main>
  );
};

export default Catalog;
