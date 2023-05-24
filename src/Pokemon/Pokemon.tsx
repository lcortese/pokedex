import React, { Fragment, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { usePokemonItem } from './hooks/usePokemon';
import HeaderPage from '../components/HeaderPage';
import Heading, { Types } from '../components/Heading';
import Card, { CardHeader, CardContent } from '../components/Card';
import Loading from '../components/Loading';
import SingleLine from '../components/SingleLine';

import './Pokemon.css';

import BackButton from './components/BackButton';
import EvolutionChain from './components/EvolutionChain';

const Pokemon = () => {
  const navigate = useNavigate();
  const id = parseInt(useParams().id);

  const { item, load, loadSpecies, loadEvolutionChain } = usePokemonItem(id);

  useEffect(() => {
    window.scrollTo(0, 0);
    ((async () => {
      await load();
      await loadSpecies();
      loadEvolutionChain();
    })());
  }, [id]);

  if (!item) {
    return null;
  }

  const goBack = () => {
    if (history.length > 1) {
      history.back();  
    } else {
      navigate('/');
    }
  };

  return (
    <main className="Pokemon">
      <HeaderPage>
        <BackButton onClick={goBack} />
        <Heading capitalize size={Types.H2}>
          <SingleLine title={item.data?.name}>{item.data?.name || '-'}</SingleLine>
        </Heading>
      </HeaderPage>

      {item.error ? (
        <p>{item.error}</p>
      ) : null}

      <article className="Pokemon__content">

        {item.loading ? (
          <Loading />
        ) : null}

        <Card className="Pokemon__content__general" shadow>
          <CardContent className="picture">
            {item.loaded ? (
              <img src={item.data.picture} alt={item.data.name} />
            ) : null}
          </CardContent>

          <CardContent className="summary">
            <dl className="Pokemon__content__list">
              <dt><Heading type={Types.H2} size={Types.H6}>Name</Heading></dt>
              <dd className="capitalize">{item.data?.name || '-'}</dd>

              <dt><Heading type={Types.H2} size={Types.H6}>Habitat</Heading></dt>
              <dd className="capitalize">{item.data?.species?.habitat || '-'}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card shadow className="Pokemon__content__description">
          <CardHeader>
            <Heading type={Types.H1} size={Types.H5}>Description</Heading>
          </CardHeader>

          <CardContent>
            {item.loaded && item.data.species?.versions.length ? (
              item.data?.species?.versions.map(version => (
                <Fragment key={version.name}>
                  <Heading type={Types.H2} size={Types.H6} capitalize>{version.name}</Heading>
                  <p>{version.description}</p>
                </Fragment>
              ))
            ) : <p>-</p>}
          </CardContent>
        </Card>

        <Card shadow>
          <CardHeader>
            <Heading type={Types.H1} size={Types.H5}>Evolution Chain</Heading>
          </CardHeader>
          <CardContent>
            {item.loaded && item.data?.evolutionChain?.length ? (
              <EvolutionChain ids={item.data.evolutionChain} />
            ) : '-'}
          </CardContent>
        </Card>
      </article>
    </main>
  );
};

export default Pokemon;
