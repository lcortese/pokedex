const BASE_URL = 'https://pokeapi.co/api/v2/evolution-chain';

import { PokemonSpeciesDto } from './pokemonSpecies';
import { extractId } from './helpers';

const buildUrl = (param: string) => {
  return `${BASE_URL}/${param}`;
};

type Chain = {
  species: PokemonSpeciesDto;
  evolves_to: Chain[];
};

type EvolutionChainResponse = {
  chain: Chain;
};

const parseItems = (data: Chain): number[] => {
  const id = extractId(data.species.url);

  const ids = data.evolves_to.reduce<number[]>(
    (collector, item) => collector.concat(parseItems(item)),
    [],
  );

  return [id, ...ids];
};

export const get = (id: string) => {
  return fetch(buildUrl(id))
    .then((response) => response.json())
    .then((response: EvolutionChainResponse) => parseItems(response.chain));
};
