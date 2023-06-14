import { extractId } from './helpers';
import Api from './Api';

export type PokemonSpeciesDto = {
  name: string,
  habitat?: {
    name: string
  },
  flavor_text_entries: Array<{
    flavor_text: string,
    language: {
      name: string
    },
    version: {
      name: string
    }
  }>,
  evolution_chain: {
    url: string
  }
  url: string,
};

export type PokemonSpecies = {
  name: string,
  habitat?: string,
  versions: Array<{
    name: string,
    description: string,
  }>
  evolutionChainId: number
};

const pokemonSpeciesApi = new Api({
  hostname: 'pokeapi.co',
  pathname: 'api/v2/pokemon-species',
});


export const get = async (name: string): Promise<PokemonSpecies> => {
  const response = await pokemonSpeciesApi.get<PokemonSpeciesDto>({
    pathname: name,
  });

  return {
    name: response.name,
    habitat: response.habitat?.name,
    versions: response.flavor_text_entries.reduce((collector, item) => {
      if (item.language.name === 'en') {
        collector.push({
          name: item.version.name,
          description: item.flavor_text,
        });
      }
      return collector;
    }, [] as PokemonSpecies['versions']),
    evolutionChainId: extractId(response.evolution_chain.url),
  };
};

