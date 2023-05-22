import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';

import { get } from '../services/pokemon';
import { get as getSpecies } from '../services/pokemonSpecies';
import type { Species } from '../services/pokemonSpecies';
import { get as getEvolucionChain } from '../services/evolutionChain';

type Pokemon = {
  id: number,
  name?: string,
  picture?: string,
  types?: string[],
  species?: Species,
  /*
   * NOTE:
   * The evolutions chains can has his own store and link with pokemon store through the pokemon id.
   * But considering the size of this app I decided to avoid create a new store.
   */
  evolutionChain?: number[]
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
    setItemsState: (state, { payload }: PayloadAction<number[]>) => {
      const items = payload.reduce((collector: Items, id: number) => {
        const currentItem = state.items[id];

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

      state.items = {
        ...state.items,
        ...items,
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
    setItemData: (state, { payload: { id, value } }: PayloadAction<{ id: number, value: Partial<Pokemon> }>) => {
      state.items[id] = {
        ...state.items[id],
        data: {
          ...state.items[id].data,
          ...value,
        },
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

export const { setItemsState, setItemLoaded, setItemLoading, setItemData, setItemError } = pokemonSlice.actions;

export const loadItem = (id: number) => async (dispatch: Dispatch) => {
  dispatch(setItemLoading({ id, value: true }));

  try {
    const item = await get(id);
    dispatch(setItemData({ id, value: item }));
    dispatch(setItemLoaded({ id, value: true }));
  } catch (e) {
    dispatch(setItemError({ id, value: e.message }));
  } finally {
    dispatch(setItemLoading({ id, value: false }));
  }
};

export const loadItems = (list: number[]) => (dispatch: Dispatch) => {
  dispatch(setItemsState(list));

  /*
   * Load data for each item
   */
  list.forEach((id: number) => {
    loadItem(id)(dispatch);
  });
};

export const loadItemSpecies = (id: number) => async (dispatch: Dispatch, getState: Function) => {
  try {
    const { items } = getState().pokemon;
    const { data } = items[id];
    const species = await getSpecies(data.speciesName);

    dispatch(setItemData({
      id,
      value: {
        species,
      },
    }));
  } catch (e) {
    dispatch(setItemError({ id, value: e.message }));
  }
};


export const loadEvolutionChain = (id: number) => async (dispatch: Dispatch, getState: Function) => {
  try {
    const { items } = getState().pokemon;
    const { data } = items[id];
    const evolutionChain = await getEvolucionChain(data.species.evolutionChainId);

    const siblings = evolutionChain.filter(pokemonId => pokemonId !== id);

    dispatch(setItemsState(siblings));

    await Promise.all(siblings.map((siblingId) => 
      loadItem(siblingId)(dispatch),
    ));

    dispatch(setItemData({
      id,
      value: {
        evolutionChain,
      },
    }));
  } catch (e) {
    dispatch(setItemError({ id, value: e.message }));
  }
};

export default pokemonSlice.reducer;
