import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons';
import { BsSearch } from 'react-icons/bs';
import { MdKeyboardVoice } from 'react-icons/md';
import { RiSettings2Fill } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import pokeball from '../assets/pokeball.png';
import pokemonLogo from '../assets/Pokémon_logo.png';
import { POKEMON_ENDPOINT, FIRST_GENERATION_LIMIT, MAX_POKEMON_ID } from '../constants/api';

function Header() {
  const pokemonList = useSelector((state) => state.preview.pokemons);
  const [hidden, setHidden] = useState(false);
  const [focus, setFocus] = useState(false);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();
  const [img, setImg] = useState(pokeball);
  const [name, setName] = useState('?');
  const [shown, setShown] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const random = Math.floor(Math.random() * FIRST_GENERATION_LIMIT) + 1;
        const response = await axios.get(`${POKEMON_ENDPOINT}/${random}`);
        setName(response.data.name);
        setImg(response.data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || pokeball);
      } catch (err) {
        console.error('Failed to fetch random Pokémon:', err);
        // Keep default values on error
      }
    }
    fetchData();
  }, []);

  const filter = (value) => {
    if (!value) {
      setSearch('');
      setSearchError('');
      return;
    }
    const list = [...pokemonList];
    const filteredData = list.filter((el) => el.name.toLowerCase().includes(value.toLowerCase()));
    if (filteredData.length) {
      setSearch(filteredData[0].name);
      setSearchError('');
    } else {
      setSearch('');
      setSearchError('No Pokémon found');
    }
  };

  const inputHandler = (e) => {
    const value = e.target.value;
    setInput(value);
    setSearchError('');
    filter(value);
  };

  const searchHandler = () => {
    const searchValue = input.trim();
    if (!searchValue) {
      setSearchError('Please enter a Pokémon name or ID');
      return;
    }

    // Check if it's a number (ID search)
    const id = parseInt(searchValue, 10);
    if (!Number.isNaN(id)) {
      if (id > 0 && id <= MAX_POKEMON_ID) {
        navigate(`/pokemon/details/${id}`);
        setInput('');
        setSearchError('');
      } else {
        setSearchError(`Please enter an ID between 1 and ${MAX_POKEMON_ID}`);
      }
    } else {
      // Search by name
      const found = pokemonList.find((p) => p.name.toLowerCase() === searchValue.toLowerCase());
      if (found) {
        navigate(`/pokemon/details/${found.id}`);
        setInput('');
        setSearchError('');
      } else {
        setSearchError('Pokémon not found');
      }
    }
  };

  const focusHandler = () => {
    setFocus(true);
  };

  return (
    <>
      <section className="header">
        <div className="title">
          <Link to="/">
            <img src={pokemonLogo} alt="Pokémon Logo" className="original-logo" />
          </Link>
          <img className="logo" src={img} alt={`Random Pokémon: ${name}`} onMouseEnter={() => setShown(true)} onMouseLeave={() => setShown(false)} />
          {shown && <p>{name}</p>}
        </div>
        <div className="search">

          {hidden ? (
            <>
              <div className="searchField">
                <input
                  className="searchBar"
                  type="text"
                  placeholder="Search Name or ID"
                  onChange={inputHandler}
                  onFocus={focusHandler}
                  value={input}
                  required
                />
                {focus && input && (
                  <span className="searchResults">
                    {search ? (
                      <>
                        Best result: {' '}
                        <NavLink to={`/pokemon/details/${search}`}>{search}</NavLink>
                      </>
                    ) : (
                      <span style={{ color: 'red' }}>{searchError || 'No results'}</span>
                    )}
                  </span>
                )}
              </div>
              <button type="button" onClick={searchHandler}>
                <IconContext.Provider value={{ className: 'ball' }}>
                  <BsSearch />
                </IconContext.Provider>
              </button>
            </>
          ) : (
            <>
              <button type="button">
                <IconContext.Provider value={{ className: 'ball' }}>
                  <RiSettings2Fill />
                </IconContext.Provider>
              </button>
              <button type="button">
                <IconContext.Provider value={{ className: 'ball' }}>
                  <MdKeyboardVoice />
                </IconContext.Provider>
              </button>
              <button type="button" data-testid="searchIcon" onClick={() => setHidden(true)}>
                <IconContext.Provider value={{ className: 'ball' }}>
                  <BsSearch />
                </IconContext.Provider>
              </button>
            </>
          )}
        </div>
      </section>
    </>
  );
}
export default Header;
