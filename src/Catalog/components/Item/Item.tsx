import React from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '../../../hooks';
import Heading, { Types } from '../../../components/Heading';
import Card, { CardHeader, CardContent, CardFooter } from '../../../components/Card';
import Loading from '../../../components/Loading';
import Square from '../../../components/Square';
import SingleLine from '../../../components/SingleLine';
import Tag from '../../../components/Tag';

import './styles.css';

type Props = {
  id: number,
};

const Item = ({ id }: Props) => {
  const pokemonState = useAppSelector((rootState) => rootState.pokemon);
  const item = pokemonState.items[id];

  const clickHandler = (e: React.MouseEvent<HTMLElement>) => {
    const callout = e.currentTarget.querySelector('.callout');
    (callout as HTMLElement).click();
  };

  return item ? (
    <Card className="Item" onClick={clickHandler} disabled={item.loading}>
      <CardHeader>
        <Heading capitalize size={Types.H6}>
          <SingleLine title={item.data.name}>{item.data.name || '-'}</SingleLine>
        </Heading>
      </CardHeader>

      <CardContent>
        {item.loading ? (<Loading />) : ''}
        <Square>
          {item.loaded ? (
            <img src={item.data.picture} alt={item.data.name} />
          ) : ''}
          {!item.loaded && item.error ? (
            item.error
          ) : ''}
        </Square>
        {item.loaded ? (
          <div className="types">
            {item.data.types.map((type: string) => (
              <Tag key={type}>{type}</Tag>
            ))}
          </div>
        ) : ''}
      </CardContent>

      <CardFooter>
        <Link className="callout" onClick={e => e.stopPropagation()} to={`/${item.data.id}`}>View Details</Link>
      </CardFooter>
    </Card>
  ) : <></>;
};

export default Item;
