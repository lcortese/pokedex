import { configureStore } from '@reduxjs/toolkit';

import { pokemonReducer } from './Pokemon';
import { catalogReducer } from './Catalog';

export const store = configureStore({
  reducer: {
    pokemon: pokemonReducer,
    catalog: catalogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
