import React from 'react';

import Item from '../../../Catalog/components/Item';

import './EvolutionChain.css';

type Props = {
  ids: number[]
};

const EvolutionChain = ({ ids }: Props) => {
  return (
    <div className={['EvolutionChain', ids.length > 2 && 'EvolutionChain--narrow'].filter(Boolean).join(' ')}>
      <ul>
        {ids.map((id) => (
          <li key={id}>
            <Item id={id} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EvolutionChain;
