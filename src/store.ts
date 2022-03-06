import { configureStore } from '@reduxjs/toolkit';

import { pokemon } from './reducers';
import { catalogReducer } from './Catalog';

export const store = configureStore({
  reducer: {
    pokemon,
    catalog: catalogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
