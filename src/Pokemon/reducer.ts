import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';

import PokemonApi from '../apis/pokemon';

type Pokemon = {
  id: number,
  name: string,
  picture: string,
  types: string[],
};

type ItemState = {
  loaded: boolean,
  loading: boolean,
  data: Pokemon,
  error?: string
};

type Items = {
  [id: number]: ItemState,
};

type PokemonState = {
  items: Items,
};

const initialItemState = {
  loaded: false,
  loading: false,
  data: {},
};

const initialState: PokemonState = {
  items: {},
};

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    pushItems: (state, { payload }: PayloadAction<Items>) => {
      state.items = {
        ...state.items,
        ...payload,
      };
    },
    setItemLoaded: (state, { payload: { id, value } }: PayloadAction<{ id: number, value: boolean }>) => {
      state.items[id] = {
        ...state.items[id],
        loaded: value,
      };
    },
    setItemLoading: (state, { payload: { id, value } }: PayloadAction<{ id: number, value: boolean }>) => {
      state.items[id] = {
        ...state.items[id],
        loading: value,
      };
    },
    setItemData: (state, { payload: { id, value } }: PayloadAction<{ id: number, value: Pokemon }>) => {
      state.items[id] = {
        ...state.items[id],
        data: value,
      };
    },
    setItemError: (state, { payload: { id, value } }: PayloadAction<{ id: number, value: string }>) => {
      state.items[id] = {
        ...state.items[id],
        error: value,
      };
    },
  },
});

export const { pushItems, setItemLoaded, setItemLoading, setItemData, setItemError } = pokemonSlice.actions;

export const loadItem = (id: number) => async (dispatch: Dispatch) => {
  dispatch(setItemLoading({ id, value: true }));

  try {
    const item = await PokemonApi.get(id);
    dispatch(setItemData({ id, value: item }));
    dispatch(setItemLoaded({ id, value: true }));
  } catch (e) {
    dispatch(setItemError({ id, value: e.message }));
  } finally {
    dispatch(setItemLoading({ id, value: false }));
  }
};

export const loadItems = (list: number[]) => (dispatch: Dispatch, getState: Function) => {
  const { items } = getState().pokemon;

  const newItemsValue = list.reduce((collector: Items, id: number) => {
    const currentItem = items[id];

    return {
      ...collector,
      [id]: {
        ...initialItemState,
        ...currentItem,
        data: {
          ...currentItem?.data,
          id,
        },
      },
    };
  }, {});

  dispatch(pushItems(newItemsValue));

  /*
   * Load data for each item
   */
  list.forEach((id: number) => {
    loadItem(id)(dispatch);
  });
};

export default pokemonSlice.reducer;
