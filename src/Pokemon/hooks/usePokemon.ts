import { create } from 'zustand';
import type { Species } from '../../services/pokemonSpecies';
import { get } from '../../services/pokemon';
import { get as getSpecies } from '../../services/pokemonSpecies';
import { get as getEvolucionChain } from '../../services/evolutionChain';

type Pokemon = {
  id: number,
  name?: string,
  picture?: string,
  types?: string[],
  species?: Species,
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

  type Mutators = {
    setItems: (ids: number[]) => void,
    setItemLoaded: (id: number, value: Item['loaded']) => void,
    setItemLoading: (id: number, value: Item['loading']) => void,
    setItemData: (id: number, value: Partial<Item['data']>) => void,
    setItemError: (id: number, value: Item['error']) => void,
  };

const DEFAULT_ITEM_STATE = {
  loaded: false,
  loading: false,
  data: {},
};
  
const DEFAULT_STATE: State = {
  items: {},
};

  

const usePokemon = create<State & Mutators>((set) => ({
  ...DEFAULT_STATE,
  setItems: (ids) => set((state) => {
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
  }),
  setItemLoaded: (id, loaded) => set((state) => ({
    items: {
      ...state.items,
      [id]: {
        ...state.items[id],
        loaded,
      },
    },
  })),
  setItemLoading: (id, loading) => set((state) => ({
    items: {
      ...state.items,
      [id]: {
        ...state.items[id],
        loading,
      },
    },
  })),
  setItemData: (id, data) => set((state) => ({
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
  })),
  setItemError: (id, error) => set((state) => ({
    items: {
      ...state.items,
      [id]: {
        ...state.items[id],
        error,
      },
    },
  })),
}));

export default () => {
  const { setItems, setItemLoaded, setItemLoading, setItemData, setItemError, ...state } = usePokemon();

  const loadItem = async (id: number) => {
    setItemLoading(id, true );
      
    try {
      const item = await get(id);
      setItemData(id, item);
      setItemLoaded(id, true);
    } catch (e) {
      setItemError(id, e.message);
    } finally {
      setItemLoading(id, false);
    }
  };
      
  const loadItems = async (list: number[]) => {
    setItems(list);
      
    /*
    * Load data for each item
    */
    list.forEach((id: number) => {
      loadItem(id);
    });
  };
      
  const loadItemSpecies = async (id: number) => {
    try {
      const { items } = state;
      const { data } = items[id];
      const species = await getSpecies(data.speciesName);
      
      setItemData(id, { species });
    } catch (e) {
      setItemError(id, e.message);
    }
  };
      
      
  const loadEvolutionChain = async (id: number) =>  {
    try {
      const { items } = state;
      const { data } = items[id];
      const evolutionChain = await getEvolucionChain(`${data.species.evolutionChainId}`);
      
      const siblings = evolutionChain.filter(pokemonId => pokemonId !== id);
      
      setItems(siblings);
      
      await Promise.all(siblings.map((siblingId) => 
        loadItem(siblingId),
      ));
      
      setItemData(id, { evolutionChain });
    } catch (e) {
      setItemError(id, e.message);
    }
  };

  return {
    ...state,
    loadItem,
    loadItems,
    loadItemSpecies,
    loadEvolutionChain,
  };
};