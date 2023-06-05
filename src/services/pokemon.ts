import Api from './Api';
import { extractId } from './helpers';

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

export type Pokemon = {
  id: number,
  name: string,
  picture: string,
  types: string[],
  speciesName: string,
};

const pokemonApi =  new Api({
  hostname: 'pokeapi.co',
  pathname: 'api/v2/pokemon',
});

export const getList = async (range: ListPayload): Promise<List> => {
  const response =  await pokemonApi.get<ListResponse>({
    query: range,
  });

  return {
    items: response.results.map((result) => ({
      id: extractId(result.url),
      name: result.name,
    })),
    total: response.count,
  };
};

export const get = async (id: number): Promise<Pokemon> => {
  const response = await pokemonApi.get<ItemResponse>({
    pathname: id,
  });

  return {
    id: response.id,
    name: response.name.replace(/-/g, ' '),
    picture: response.sprites.other.dream_world.front_default || response.sprites.front_default || response.sprites.front_shiny,
    types: response.types.map((item: any) => item.type.name),
    speciesName: response.species.name,
  };
};
