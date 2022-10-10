import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '../../../hooks';
import Heading, { Types } from '../../../components/Heading';
import Card, { CardHeader, CardContent, CardFooter } from '../../../components/Card';
import Loading from '../../../components/Loading';
import Square from '../../../components/Square';
import SingleLine from '../../../components/SingleLine';
import Tag from '../../../components/Tag';

import './Item.css';

type Props = {
  id: number,
};

const Item = ({ id }: Props) => {
  const pokemonState = useAppSelector((rootState) => rootState.pokemon);
  const item = pokemonState.items[id];
  const callout = useRef<HTMLAnchorElement>();

  const clickHandler = () => {
    callout.current.click();
  };

  const auxClickHandler = () => {
    const auxClick = new MouseEvent('click', { ctrlKey: true });
    callout.current.dispatchEvent(auxClick);
  };

  return item ? (
    <Card className="Item" onClick={clickHandler} onAuxClick={auxClickHandler} disabled={item.loading}>
      <CardHeader>
        <Heading capitalize size={Types.H6}>
          <SingleLine title={item.data.name}>{item.data.name || '-'}</SingleLine>
        </Heading>
      </CardHeader>

      <CardContent>
        {item.loading ? (<Loading />) : null}
        <Square>
          {item.loaded ? (
            <img src={item.data.picture} alt={item.data.name} />
          ) : null}
          {!item.loaded && item.error ? (
            item.error
          ) : null}
        </Square>
        {item.loaded ? (
          <div className="types">
            {item.data.types.map((type: string) => (
              <Tag key={type}>{type}</Tag>
            ))}
          </div>
        ) : null}
      </CardContent>

      <CardFooter>
        <Link ref={callout} onClick={e => e.stopPropagation()} to={`/${item.data.id}`}>View Details</Link>
      </CardFooter>
    </Card>
  ) : null;
};

export default Item;
