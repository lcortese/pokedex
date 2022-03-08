import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../hooks';

import { loadItems } from '../Pokemon/reducer';
import Loading from '../components/Loading';

import './Catalog.css';

import Header from './components/Header';
import Item from './components/Item';
import PaginationButton from './components/PaginationButton';
import { load, loadPrev, loadNext } from './reducer';

const ITEMS_PER_PAGE = 20;

const Catalog = () => {
  const state = useAppSelector((rootState) => rootState.catalog);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const offset = parseInt(searchParams.get('offset'));

  /*
   * Load data
   */
  useEffect(() => {
    let action;

    if (!state.loaded || isNaN(offset)) {
      action = load;
    } else {
      if (offset + ITEMS_PER_PAGE > state.range.max) {
        action = loadNext;
      } else
      if (offset < state.range.min) {
        action = loadPrev;
      }
    }

    if (action) {
      dispatch(action({
        offset: isNaN(offset) ? 0 : offset,
        limit: ITEMS_PER_PAGE,
      })).then(items => {
        dispatch(loadItems(items));
      });
    }
  }, [offset]);

  const goToPrev = () => {
    setSearchParams({
      offset: (Math.max(state.range.min - ITEMS_PER_PAGE, 0)).toString(),
    }, {
      replace: true,
    });
  };

  const goToNext = () => {
    setSearchParams({
      offset: state.range.max.toString(),
    }, {
      replace: true,
    });
  };

  return (
    <main className="Catalog">
      <Header />
      <div className="Catalog__content">
        {state.loading ? (
          <Loading />
        ) : ''}

        {state.loaded && !state.items ? (
          <div>No results</div>
        ) : ''}

        {state.loaded && state.range.min > 0 ? (
          <PaginationButton onClick={goToPrev} disabled={state.loading}>
            Load Prev
          </PaginationButton>
        ) : ''}

        {state.loaded ? (
          <ul className="pokemon">
            {state.items.map((id: number) => (
              <li key={id}>
                <Item id={id} />
              </li>
            ))}
          </ul>
        ) : ''}

        {!state.loaded && state.error ? (
          <div>Error: {state.error}</div>
        ) : ''}

        {state.loaded && state.range.max < state.total ? (
          <PaginationButton onClick={goToNext} disabled={state.loading}>
            Load Next
          </PaginationButton>
        ) : ''}
      </div>
    </main>
  );
};

export default Catalog;
