import { extractId } from './helpers';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon-species';

const buildUrl = (param: string) => {
  return `${BASE_URL}/${param}`;
};

export type SpeciesResponse = {
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

export type Species = {
  name: string,
  habitat?: string,
  versions: Array<{
    name: string,
    description: string,
  }>
  evolutionChainId: number
};

export default new class PokemonSpeciesApi {
  get(name: string): Promise<Species> {
    return fetch(buildUrl(name))
      .then(response => response.json())
      .then((response: SpeciesResponse) => {
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
          }, []),
          evolutionChainId: extractId(response.evolution_chain.url),
        };
      });
  }
};
