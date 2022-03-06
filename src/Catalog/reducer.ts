import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';

import PokemonApi, { ListItem, ListPayload } from '../apis/pokemon';

type Range = {
  min: number
  max: number
};

export type CatalogState = {
  loading: boolean,
  loaded: boolean,
  items: number[],
  total: number,
  range: Range,
  error?: string,
};

const initialState: CatalogState = {
  loading: false,
  loaded: false,
  items: [],
  total: 0,
  range: {
    min: Infinity,
    max: -Infinity,
  },
  error: undefined,
};

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload;
    },
    setLoaded: (state, { payload }: PayloadAction<boolean>) => {
      state.loaded = payload;
    },
    setTotal: (state, { payload }: PayloadAction<number>) => {
      state.total = payload;
    },
    setRange: (state, { payload }: PayloadAction<Range>) => {
      state.range = payload;
    },
    setItems: (state, { payload }: PayloadAction<number[]>) => {
      state.items = payload;
    },
    unshiftItems: (state, { payload }: PayloadAction<number[]>) => {
      state.items = state.items.reduce((collector, item) => {
        return !collector.includes(item)
          ? [...collector, item]
          : collector;
      }, payload);
    },
    pushItems: (state, { payload }: PayloadAction<number[]>) => {
      state.items = payload.reduce((collector, item) => {
        return !collector.includes(item)
          ? [...collector, item]
          : collector;
      }, state.items);
    },
    setError: (state, { payload }: PayloadAction<string>) => {
      state.error = payload;
    },
  },
});

const { setLoading, setLoaded, setTotal, setRange, setItems, pushItems, unshiftItems, setError } = catalogSlice.actions;

const fetch = async ({ offset, limit }: ListPayload, dispatch: Dispatch, useState: Function) => {
  dispatch(setLoading(true));

  try {
    const response = await PokemonApi.getList({ offset, limit });
    dispatch(setTotal(response.total));

    const { min, max } = useState().catalog.range;

    dispatch(setRange({
      min: Math.min(min, offset),
      max: Math.max(max, offset + limit),
    }));

    return response.items.map((item: ListItem) => item.id);
  } catch (e) {
    throw e;
  } finally {
    dispatch(setLoading(false));
  }
};

export const load = (range: ListPayload) => async (dispatch: Dispatch, useState: Function) => {
  dispatch(setLoaded(false));
  dispatch(setRange(initialState.range));

  try {
    const items = await fetch(range, dispatch, useState);
    dispatch(setItems(items));
    dispatch(setLoaded(true));
    return items;
  } catch (e) {
    dispatch(setError(e.message));
    throw e;
  }
};

export const loadPrev = (range: ListPayload) => async (dispatch: Dispatch, useState: Function) => {
  try {
    const items = await fetch(range, dispatch, useState);
    dispatch(unshiftItems(items));
    return items;
  } catch (e) {
    dispatch(setError(e.message));
    throw e;
  }
};

export const loadNext = (range: ListPayload) => async (dispatch: Dispatch, useState: Function) => {
  try {
    const items = await fetch(range, dispatch, useState);
    dispatch(pushItems(items));
    return items;
  } catch (e) {
    dispatch(setError(e.message));
    throw e;
  }
};

export default catalogSlice.reducer;
