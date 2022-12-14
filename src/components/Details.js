import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { IconContext } from 'react-icons';
import { BsHouseFill } from 'react-icons/bs';
import axios from 'axios';
import { updateImg } from './redux/previewSlice';
import MoreDetails from './MoreDetails';
import pokeball from '../assets/pokeball.png';

function Details() {
  const [img, setImg] = useState(pokeball);
  const [img1, setImg1] = useState(pokeball);
  const [img2, setImg2] = useState(pokeball);
  const [img3, setImg3] = useState(pokeball);
  const [img4, setImg4] = useState();
  const [pokemon, setPokemon] = useState('');
  const params = useParams();
  const types = [];
  const [type1, setType1] = useState();
  const abilities = [];
  const [ability1, setAbility1] = useState();
  const [ability2, setAbility2] = useState();
  const [more, setMore] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchData() {
      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${params.id}`,
      );
      setImg(response.data.sprites.other['official-artwork'].front_default);
      setImg1(response.data.sprites.other['official-artwork'].front_default);
      setImg2(response.data.sprites.other.dream_world.front_default || pokeball);
      setImg3(response.data.sprites.other.home.front_default);
      setImg4(response.data.sprites.versions['generation-v']['black-white'].animated.front_default);
      setPokemon(response.data);
      dispatch(updateImg({
        id: params.id, name: response.data.name, img: response.data.sprites.other['official-artwork'].front_default,
      }));
      Object.values(response.data.types).map((el) => types.push(el.type.name));
      setType1(types[0]);
      Object.values(response.data.abilities).map((el) => abilities.push(el.ability.name));
      setAbility1(abilities[0]);
      setAbility2(abilities[1]);
    }
    fetchData();
  }, []);

  return (
    <section>
      <div className="details-header">
        <h1>
          {pokemon.id < 10 ? (`0${pokemon.id}`) : pokemon.id}
        </h1>
        <h1>
          {pokemon.name}
        </h1>
        <NavLink to="/">
          <IconContext.Provider value={{ className: 'homeBtn' }}>
            <BsHouseFill />
          </IconContext.Provider>
        </NavLink>
      </div>
      <div className="details-main">
        <div className="main-img">
          <img src={img} alt="" />
        </div>
        <div className="photos">
          <img src={img1} alt="" aria-hidden="true" onClick={() => setImg(img1)} />
          <img src={img2} alt="" aria-hidden="true" onClick={() => setImg(img2)} />
          <img src={img3} alt="" aria-hidden="true" onClick={() => setImg(img3)} />
        </div>
      </div>
      <div className="bottom">
        <ul className="statsContainer">
          <li className="property">
            Type:&nbsp;
            {type1}
          </li>

          <li className="property">
            Ability 01:&nbsp;
            {ability1}
          </li>

          <li className="property">
            Ability 02:&nbsp;
            {ability2 || null}
          </li>

          <li className="property">
            Base Exp:&nbsp;
            {pokemon.base_experience}
          </li>

          <li className="property">
            Height:&nbsp;
            {pokemon.height}
          </li>

          <li className="property">
            Weight:&nbsp;
            {pokemon.weight}
          </li>
        </ul>
        <div className="gifPhotos">
          <img src={img4} alt="" aria-hidden="true" onClick={() => setImg(img4)} />
          { more ? (<MoreDetails id={pokemon.id} />) : (<button type="button" onClick={() => setMore(true)}>More Details...</button>)}
        </div>
      </div>
    </section>
  );
}

export default Details;
