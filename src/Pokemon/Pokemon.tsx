import React, { Fragment, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from '../hooks';
import HeaderPage from '../components/HeaderPage';
import Heading, { Types } from '../components/Heading';
import Card, { CardHeader, CardContent } from '../components/Card';
import Loading from '../components/Loading';
import SingleLine from '../components/SingleLine';

import './Pokemon.css';

import BackButton from './components/BackButton';
import EvolutionChain from './components/EvolutionChain';
import { loadItem, loadItemSpecies, loadEvolutionChain } from './reducer';

const Pokemon = () => {
  const { items } = useAppSelector((rootState) => rootState.pokemon);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const id = parseInt(useParams().id);
  const state = items[id];

  useEffect(() => {
    window.scrollTo(0, 0);

    (async () => {
      await dispatch(loadItem(id));
      await dispatch(loadItemSpecies(id));
      dispatch(loadEvolutionChain(id));
    })();
  }, [id]);

  if (!state) {
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
          <SingleLine title={state.data?.name}>{state.data?.name || '-'}</SingleLine>
        </Heading>
      </HeaderPage>

      {state.error ? (
        <p>{state.error}</p>
      ) : null}

      <article className="Pokemon__content">

        {state.loading ? (
          <Loading />
        ) : null}

        <Card className="Pokemon__content__general" shadow>
          <CardContent className="picture">
            {state.loaded ? (
              <img src={state.data.picture} alt={state.data.name} />
            ) : null}
          </CardContent>

          <CardContent className="summary">
            <dl className="Pokemon__content__list">
              <dt><Heading type={Types.H2} size={Types.H6}>Name</Heading></dt>
              <dd className="capitalize">{state.data?.name || '-'}</dd>

              <dt><Heading type={Types.H2} size={Types.H6}>Habitat</Heading></dt>
              <dd className="capitalize">{state.data?.species?.habitat || '-'}</dd>
            </dl>
          </CardContent>
        </Card>

        <Card shadow className="Pokemon__content__description">
          <CardHeader>
            <Heading type={Types.H1} size={Types.H5}>Description</Heading>
          </CardHeader>

          <CardContent>
            {state.loaded && state.data.species?.versions.length ? (
              state.data?.species?.versions.map(version => (
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
            {state.loaded && state.data?.evolutionChain?.length ? (
              <EvolutionChain ids={state.data.evolutionChain} />
            ) : '-'}
          </CardContent>
        </Card>
      </article>
    </main>
  );
};

export default Pokemon;
