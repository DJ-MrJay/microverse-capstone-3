import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import Capitalize from './utils/Capitalize';
import pokeball from '../assets/pokeball.png';
import { POKEMON_ENDPOINT } from '../constants/api';

function Preview({ pokemon }) {
  const [img, setImg] = useState(pokeball);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Skip if image already exists in pokemon object
    if (pokemon.img) {
      setImg(pokemon.img);
      return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${POKEMON_ENDPOINT}/${pokemon.id}`);
        setImg(response.data.sprites.other['official-artwork'].front_default);
      } catch (err) {
        console.error(`Failed to fetch Pokémon ${pokemon.id}:`, err);
        setError(err.message);
        // Keep default pokeball image on error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [pokemon.id, pokemon.img]);

  return (
    <NavLink to={`/pokemon/details/${pokemon.id}`} className="box">
      <div>
        <h1>
          {pokemon.id < 10 ? (`0${pokemon.id}`) : pokemon.id}
        </h1>
        {pokemon.img ? (
          <img src={pokemon.img} alt={`${Capitalize(pokemon.name)} official artwork`} />
        ) : (
          <img src={img} alt={loading ? 'Loading...' : error ? 'Error loading image' : `${Capitalize(pokemon.name)} official artwork`} />
        )}
        <h2>
          {Capitalize(pokemon.name)}
        </h2>
      </div>
    </NavLink>
  );
}

Preview.propTypes = {
  pokemon: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    img: PropTypes.string,
  }).isRequired,
};

export default Preview;
