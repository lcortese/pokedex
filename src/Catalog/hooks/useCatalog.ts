import { create } from 'zustand';
import { ListPayload, getList } from '../../services/pokemon';

type Range = {
  min: number
  max: number
};

export type Store = {
  loading: boolean,
  loaded: boolean,
  items: number[],
  total: number,
  range: Range,
  error?: string,
};

type Mutators = {
  setLoading: (value: Store['loading']) => void,
  setLoaded: (value: Store['loaded']) => void,
  setTotal: (value: Store['total']) => void,
  setRange: (value: Store['range']) => void,
  setItems: (value: Store['items']) => void,
  unshiftItems: (value: Store['items']) => void,
  pushItems: (value: Store['items']) => void,
  setError: (value: Store['error']) => void,
};
  

const initialState: Store = {
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

const useCatalog = create<Store & Mutators>((set) => ({
  ...initialState,
  setLoading: (value) => set({ loading: value }),
  setLoaded: (value) => set({ loaded: value }),
  setTotal: (value) => set({ total: value }),
  setRange: (value) => set({ range: value }),
  setItems: (value) => set({ items: value }),
  unshiftItems: (value) => set((state) => {
    const items = state.items.reduce((collector, item) => {
      return !collector.includes(item)
        ? [...collector, item]
        : collector;
    }, value);

    return { items };
  }),
  pushItems: (value) => set(state => {
    const items = value.reduce((collector, item) => {
      return !collector.includes(item)
        ? [...collector, item]
        : collector;
    }, state.items);

    return { items };
  }),
  setError: (value) => set({ error: value }),
}));

export default () => {
  const { setLoading, setTotal, setRange, setLoaded, setItems, setError, unshiftItems, pushItems, ...state } = useCatalog();

  const fetch = async ({ offset, limit }: ListPayload) => {
    setLoading(true);
      
    try {
      const response = await getList({ offset, limit });
      setTotal(response.total);
      
      const { min, max } = state.range;
      
      (setRange({
        min: Math.min(min, offset),
        max: Math.max(max, offset + limit),
      }));
      
      return response.items.map(item => item.id);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };
      
  const load = async (range: ListPayload) => {
    setLoaded(false);
    setRange(initialState.range);
      
    try {
      const items = await fetch(range);
      setItems(items);
      setLoaded(true);
      return items;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };
      
  const loadPrev = async (range: ListPayload) => {
    try {
      const items = await fetch(range);
      unshiftItems(items);
      return items;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };
      
  const loadNext = async (range: ListPayload) => {
    try {
      const items = await fetch(range);
      pushItems(items);
      return items;
    } catch (e) {
      setError(e.message);
      throw e;
    }
  };

  return {
    ...state,
    load,
    loadNext,
    loadPrev,
  };
};
