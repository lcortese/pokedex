import { create } from 'zustand';
import type { PokemonSpecies } from '../../services/pokemonSpecies';
import { get as getPokemon } from '../../services/pokemon';
import type { Pokemon } from '../../services/pokemon';
import { get as getSpecies } from '../../services/pokemonSpecies';
import { get as getEvolucionChain } from '../../services/evolutionChain';

type ItemData = Pokemon & {
  species?: PokemonSpecies,
  evolutionChain?: Pokemon['id'][]
};
  
type Item = {
  loaded: boolean,
  loading: boolean,
  data: ItemData,
  error?: string
};
  
type State = {
  items: Record<Pokemon['id'], Item>,
};

type Actions = {
  loadItem: (id: ItemData['id']) => void,
  loadItems: (ids: ItemData['id'][]) => void,
  loadItemSpecies: (id: ItemData['id']) => void,
  loadItemEvolutionChain: (id: ItemData['id']) => void
};

const DEFAULT_ITEM_STATE = {
  loaded: false,
  loading: false,
  data: {},
};
  
const DEFAULT_STATE: State = {
  items: {},
};

const usePokemon = create<State & Actions>((set, get) => {
  // mutators
  const setItems = (ids: Pokemon['id'][]) => set((state: State) => {
    const items = ids.reduce<State['items']>((collector, id) => {
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
  });

  const setItemLoaded = (id: Pokemon['id'], loaded: boolean) => set((state: State) => ({
    items: {
      ...state.items,
      [id]: {
        ...state.items[id],
        loaded,
      },
    },
  }));

  const setItemLoading = (id: Pokemon['id'], loading: boolean) => set((state: State) => ({
    items: {
      ...state.items,
      [id]: {
        ...state.items[id],
        loading,
      },
    },
  }));

  const setItemData = (id: Pokemon['id'], data: Partial<Item['data']>) => set((state: State) => ({
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
  }));

  const setItemError = (id: Pokemon['id'], error: string) => set((state: State) => ({
    items: {
      ...state.items,
      [id]: {
        ...state.items[id],
        error,
      },
    },
  }));

  return {
    ...DEFAULT_STATE,
    loadItem: async (id) => {
      setItemLoading(id, true);
      try {
        const item = await getPokemon(id);
        setItemData(id, item);
        setItemLoaded(id, true);
      } catch (e) {
        setItemError(id, `Unable to load pokemon: ${e instanceof Error ? e.message : '-'}`);
      } finally {
        setItemLoading(id, false);
      }
    },
  
    loadItems: (list) => {
      const { loadItem } = get();
      setItems(list);
        
      /*
      * Load data for each item
      */
      list.forEach((id) => {
        loadItem(id);
      });
    },
    loadItemSpecies: async (id) => {
      const { items } = get();
      try {
        const item = items[id];
        if (item) {
          const species = await getSpecies(item.data.speciesName);
          setItemData(id, { species });
        }
      } catch (e: unknown) {
        setItemError(id, `Unable to load species: ${e instanceof Error ? e.message : '-'}`);
      }
    },
    loadItemEvolutionChain: async (id) =>  {
      const { items, loadItem } = get();
      try {
        const item = items[id];
        if (item.data.species?.evolutionChainId) {
          const evolutionChain = await getEvolucionChain(`${item.data.species.evolutionChainId}`);
          const siblings = evolutionChain.filter(pokemonId => pokemonId !== id);
          
          setItems(siblings);
          
          await Promise.all(siblings.map((siblingId) => 
            loadItem(siblingId),
          ));
          
          setItemData(id, { evolutionChain });
        }
      } catch (e) {
        setItemError(id, `Unable to load evolution chain: ${e instanceof Error ? e.message : '-'}`);
      }
    },
  };
});

export default usePokemon;

export const usePokemonItem = (id: Pokemon['id']) => {
  const store = usePokemon();

  return {
    item: store.items[id],
    load: () => store.loadItem(id),
    loadSpecies: () => store.loadItemSpecies(id),
    loadEvolutionChain: () => store.loadItemEvolutionChain(id),
  };
};
