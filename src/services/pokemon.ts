import queryString from 'query-string';

import { extractId } from './helpers';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

const buildUrl = (query?: Object) => {
  return `${BASE_URL}${query ? '?' + queryString.stringify(query) : ''}`;
};

export type ListPayload = {
  offset: number,
  limit: number,
};

type ListResponse = {
  count: number,
  next: string,
  previous: string,
  results: {
    name: string,
    url: string,
  }[]
};

type ListItem = {
  id: number,
  name: string,
};

type List = {
  items: ListItem[],
  total: number
};

type ItemResponse = {
  id: number,
  name: string,
  sprites: {
    front_shiny: string,
    front_default: string,
    other: {
      dream_world: {
        front_default: string
      }
      home: {
        front_default: string
      }
    }
  },
  types: Array<{
    type: {
      name: string
    }
  }>,
  species: {
    name: string
  }
};

type Pokemon = {
  id: number,
  name: string,
  picture: string,
  types: string[],
  speciesName: string,
};

export const getList = (data: ListPayload): Promise<List> => {
  return fetch(buildUrl(data))
    .then(response => response.json())
    .then((response: ListResponse) => ({
      items: response.results.map((result) => ({
        id: extractId(result.url),
        name: result.name,
      })),
      total: response.count,
    }));
};

export const get = (id: number): Promise<Pokemon> => {
  return fetch(`${BASE_URL}/${id}`)
    .then(response => response.json())
    .then((response: ItemResponse) => ({
      id: response.id,
      name: response.name.replace(/-/g, ' '),
      picture: response.sprites.other.dream_world.front_default || response.sprites.front_default || response.sprites.front_shiny,
      types: response.types.map((item: any) => item.type.name),
      speciesName: response.species.name,
    }));
};
