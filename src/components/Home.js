import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApi } from './redux/previewSlice';
import Header from './Header';
import Preview from './Preview';
import MainPreview from './MainPreview';

function Home() {
  const { pokemons, loading, error } = useSelector((state) => state.preview);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!pokemons.length && !loading) dispatch(fetchApi());
  }, [pokemons.length, loading, dispatch]);

  return (
    <>
      <Header />
      <MainPreview />
      <h3 className="list-header">POKEMON BY ID</h3>
      {loading && <p style={{ padding: '1rem', textAlign: 'center' }}>Loading Pokémon...</p>}
      {error && (
        <p style={{ padding: '1rem', textAlign: 'center', color: 'red' }}>
          {error}
          <button type="button" onClick={() => dispatch(fetchApi())} style={{ marginLeft: '1rem' }}>
            Retry
          </button>
        </p>
      )}
      {!loading && !error && (
        <section className="list">
          {pokemons.map((pokemon) => (<Preview key={pokemon.id} pokemon={pokemon} />))}
        </section>
      )}
    </>
  );
}

export default Home;
