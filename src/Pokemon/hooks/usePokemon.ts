import { create } from 'zustand';
import type { PokemonSpecies } from '../../services/pokemonSpecies';
import { get as getPokemon } from '../../services/pokemon';
import { get as getSpecies } from '../../services/pokemonSpecies';
import { get as getEvolucionChain } from '../../services/evolutionChain';

type Pokemon = {
  id: number,
  name?: string,
  picture?: string,
  types?: string[],
  species?: PokemonSpecies,
  speciesName?: string,
  /*
     * NOTE:
     * The evolutions chains can has his own store and link with pokemon store through the pokemon id.
     * But considering the size of this app I decided to avoid create a new store.
     */
  evolutionChain?: number[]
};
  
type Item = {
  loaded: boolean,
  loading: boolean,
  data: Pokemon,
  error?: string
};
  
type State = {
  items: Record<number, Item>,
};

type Actions = {
  loadItem: (id: Pokemon['id']) => void,
  loadItems: (ids: Pokemon['id'][]) => void,
  loadItemSpecies: (id: Pokemon['id']) => void,
  loadItemEvolutionChain: (id: Pokemon['id']) => void
};

const DEFAULT_ITEM_STATE = {
  loaded: false,
  loading: false,
  data: {},
};
  
const DEFAULT_STATE: State = {
  items: {},
};


// mutators
const setItems = (ids: number[]) => (state: State) => {
  const items = ids.reduce((collector: State['items'], id: number) => {
    const currentItem = state.items[id];

    return {
      ...collector,
      [id]: {
        ...DEFAULT_ITEM_STATE,
        ...currentItem,
        data: {
          ...currentItem?.data,
          id,
        },
      },
    };
  }, {});

  return {
    items: {
      ...state.items,
      ...items,
    },
  };
};

const setItemLoaded = (id: number, loaded: boolean) => (state: State) => ({
  items: {
    ...state.items,
    [id]: {
      ...state.items[id],
      loaded,
    },
  },
});

const setItemLoading = (id: number, loading: boolean) => (state: State) => ({
  items: {
    ...state.items,
    [id]: {
      ...state.items[id],
      loading,
    },
  },
});

const setItemData = (id: number, data: Partial<Item['data']>) => (state: State) => ({
  items: {
    ...state.items,
    [id]: {
      ...state.items[id],
      data: {
        ...state.items[id].data,
        ...data,
      },
    },
  },
});

const setItemError = (id: number, error: string) => (state: State) => ({
  items: {
    ...state.items,
    [id]: {
      ...state.items[id],
      error,
    },
  },
});
  

const usePokemon = create<State & Actions>((set, get) => ({
  ...DEFAULT_STATE,
  loadItem: async (id) => {
    set(setItemLoading(id, true ));
      
    try {
      const item = await getPokemon(id);
      set(setItemData(id, item));
      set(setItemLoaded(id, true));
    } catch (e) {
      set(setItemError(id, e.message));
    } finally {
      set(setItemLoading(id, false));
    }
  },

  loadItems: (list) => {
    const { loadItem } = get();
    set(setItems(list));
      
    /*
    * Load data for each item
    */
    list.forEach((id: number) => {
      loadItem(id);
    });
  },
  loadItemSpecies: async (id) => {
    const { items } = get();
    try {
      const item = items[id];
      const species = await getSpecies(item.data.speciesName);
      set(setItemData(id, { species }));
    } catch (e) {
      set(setItemError(id, `Unable to load species: ${e.message}`));
    }
  },
  loadItemEvolutionChain: async (id) =>  {
    const { items, loadItem } = get();
    try {
      const item = items[id];
      const evolutionChain = await getEvolucionChain(`${item.data.species.evolutionChainId}`);
      const siblings = evolutionChain.filter(pokemonId => pokemonId !== id);
      
      set(setItems(siblings));
      
      await Promise.all(siblings.map((siblingId) => 
        loadItem(siblingId),
      ));
      
      set(setItemData(id, { evolutionChain }));
    } catch (e) {
      set(setItemError(id, `Unable to load evolution chain: ${e.message}`));
    }
  },
}));

export default usePokemon;

export const usePokemonItem = (id: number) => {
  const store = usePokemon();

  return {
    item: store.items[id],
    load: () => store.loadItem(id),
    loadSpecies: () => store.loadItemSpecies(id),
    loadEvolutionChain: () => store.loadItemEvolutionChain(id),
  };
};
