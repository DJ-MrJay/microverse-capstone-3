import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IconContext } from 'react-icons';
import { BsHouseFill } from 'react-icons/bs';
import axios from 'axios';
import { updateImg } from './redux/previewSlice';
import MoreDetails from './MoreDetails';
import pokeball from '../assets/pokeball.png';
import { POKEMON_ENDPOINT } from '../constants/api';

function Details() {
  const [img, setImg] = useState(pokeball);
  const [img1, setImg1] = useState(pokeball);
  const [img2, setImg2] = useState(pokeball);
  const [img3, setImg3] = useState(pokeball);
  const [img4, setImg4] = useState();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const [type1, setType1] = useState('');
  const [ability1, setAbility1] = useState('');
  const [ability2, setAbility2] = useState('');
  const [more, setMore] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${POKEMON_ENDPOINT}/${params.id}`,
        );
        const data = response.data;
        setImg(data.sprites.other['official-artwork'].front_default || pokeball);
        setImg1(data.sprites.other['official-artwork'].front_default || pokeball);
        setImg2(data.sprites.other.dream_world?.front_default || pokeball);
        setImg3(data.sprites.other.home?.front_default || pokeball);
        setImg4(data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default);
        setPokemon(data);
        dispatch(updateImg({
          id: params.id,
          name: data.name,
          img: data.sprites.other['official-artwork'].front_default || pokeball,
        }));
        const types = data.types.map((el) => el.type.name);
        setType1(types[0] || '');
        const abilities = data.abilities.map((el) => el.ability.name);
        setAbility1(abilities[0] || '');
        setAbility2(abilities[1] || '');
      } catch (err) {
        console.error('Failed to fetch Pokémon details:', err);
        setError(err.response?.status === 404
          ? 'Pokémon not found. Please check the ID and try again.'
          : 'Failed to load Pokémon data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id, dispatch]);

  if (loading) {
    return (
      <section>
        <div className="details-header">
          <h1>Loading...</h1>
          <NavLink to="/">
            <IconContext.Provider value={{ className: 'homeBtn' }}>
              <BsHouseFill />
            </IconContext.Provider>
          </NavLink>
        </div>
        <div className="details-main">
          <div className="main-img">
            <img src={pokeball} alt="Loading..." />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        <div className="details-header">
          <h1>Error</h1>
          <NavLink to="/">
            <IconContext.Provider value={{ className: 'homeBtn' }}>
              <BsHouseFill />
            </IconContext.Provider>
          </NavLink>
        </div>
        <div className="details-main">
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p>{error}</p>
            <NavLink to="/">
              <button type="button" className="more-btn">Return to Home</button>
            </NavLink>
          </div>
        </div>
      </section>
    );
  }

  if (!pokemon) {
    return null;
  }

  const pokemonName = pokemon.name || 'Unknown';
  const pokemonId = pokemon.id || params.id;

  return (
    <section>
      <div className="details-header">
        <h1>
          {pokemonId < 10 ? (`0${pokemonId}`) : pokemonId}
        </h1>
        <h1>
          {pokemonName}
        </h1>
        <NavLink to="/">
          <IconContext.Provider value={{ className: 'homeBtn' }}>
            <BsHouseFill />
          </IconContext.Provider>
        </NavLink>
      </div>
      <div className="details-main">
        <div className="main-img">
          <img src={img} alt={`${pokemonName} official artwork`} />
        </div>
        <div className="photos">
          <img src={img1} alt={`${pokemonName} sprite variant 1`} onClick={() => setImg(img1)} />
          <img src={img2} alt={`${pokemonName} dream world sprite`} onClick={() => setImg(img2)} />
          <img src={img3} alt={`${pokemonName} home sprite`} onClick={() => setImg(img3)} />
        </div>
      </div>
      <div className="bottom">
        <ul className="statsContainer">
          <li className="property">
            Type: {' '}
            {type1}
          </li>

          <li className="property">
            Ability 01: {' '}
            {ability1}
          </li>

          <li className="property">
            Ability 02: {' '}
            {ability2 || 'N/A'}
          </li>

          <li className="property">
            Base Exp: {' '}
            {pokemon.base_experience || 'N/A'}
          </li>

          <li className="property">
            Height: {' '}
            {pokemon.height || 'N/A'}
          </li>

          <li className="property">
            Weight: {' '}
            {pokemon.weight || 'N/A'}
          </li>
        </ul>
        <div className="gifPhotos">
          {img4 && <img src={img4} alt={`${pokemonName} animated sprite`} onClick={() => setImg(img4)} />}
          {more ? (
            <MoreDetails id={pokemon.id} />
          ) : (
            <button type="button" onClick={() => setMore(true)}>More Details...</button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Details;
