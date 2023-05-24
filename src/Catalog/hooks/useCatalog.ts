import { create } from 'zustand';
import { ListPayload, getList } from '../../services/pokemon';

type Range = {
  min: number
  max: number
};

export type State = {
  loading: boolean,
  loaded: boolean,
  items: number[],
  total: number,
  range: Range,
  error?: string,
};

type Actions = {
  load: (value: ListPayload) => Promise<State['items']>,
  loadPrev: (value: ListPayload) => Promise<State['items']>,
  loadNext: (value: ListPayload) => Promise<State['items']>,
};
  

const DEFAULT_STATE: State = {
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

const unshiftItems = (items: State['items'], newItems: State['items']) =>
  items.reduce((collector, item) => {
    return !collector.includes(item)
      ? [...collector, item]
      : collector;
  }, newItems);

const pushItems = (items: State['items'], newItems: State['items']) =>
  newItems.reduce((collector, item) => {
    return !collector.includes(item)
      ? [...collector, item]
      : collector;
  }, items);
  

const useCatalog = create<State & Actions>((set, get) => {
  const fetch = async ({ offset, limit }: ListPayload) => {
    const { range } = get();
    set({ loading: true });
      
    try {
      const response = await getList({ offset, limit });
      set({ total: response.total });
      
      const { min, max } = range;
      
      set({
        range: {
          min: Math.min(min, offset),
          max: Math.max(max, offset + limit),
        },
      });
      
      return response.items.map(item => item.id);
    } catch (e) {
      throw e;
    } finally {
      set({ loading: false });
    }
  };

  return {
    ...DEFAULT_STATE,
    load: async (range: ListPayload) => {
      set({ loaded: false });
      set({ range: DEFAULT_STATE.range });
        
      try {
        const items = await fetch(range);
        set({ items });
        set({ loaded: true });
        return items;
      } catch (e) {
        set({ error: e.message });
        throw e;
      }
    },
    loadPrev: async (range: ListPayload) => {
      const { items } = get();
      try {
        const newItems = await fetch(range);
        set({ items: unshiftItems(items, newItems) });
        return newItems;
      } catch (e) {
        set({ error: e.message });
        throw e;
      }
    },
    loadNext: async (range: ListPayload) => {
      const { items } = get();
      try {
        const newItems = await fetch(range);
        set({ items: pushItems(items, newItems) });
        return newItems;
      } catch (e) {
        set({ error: e.message });
        throw e;
      }
    },
  };

});

export default useCatalog;
