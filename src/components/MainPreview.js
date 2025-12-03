import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import pokeball from '../assets/pokeball.png';
import { POKEMON_ENDPOINT, FIRST_GENERATION_LIMIT } from '../constants/api';

function MainPreview() {
  const answer = useRef(null);
  const [img, setImg] = useState(pokeball);
  const [name, setName] = useState('');
  const [check, setCheck] = useState(false);
  const [input, setInput] = useState('');
  const [ID, setID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const randomId = Math.floor(Math.random() * FIRST_GENERATION_LIMIT) + 1;
        const response = await axios.get(
          `${POKEMON_ENDPOINT}/${randomId}`,
        );
        setID(response.data.id);
        setName(response.data.name);
        setImg(response.data.sprites.other['official-artwork'].front_default || pokeball);
      } catch (err) {
        console.error('Failed to fetch random Pokémon:', err);
        setError('Failed to load Pokémon');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const changeHandler = (e) => {
    const value = e.target.value.toLowerCase();
    setInput(value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!name || !answer.current) return;
    const userGuess = answer.current.value.toLowerCase().trim();
    if (userGuess === name.toLowerCase()) {
      setCheck(true);
    } else {
      answer.current.value = '';
      setInput('');
    }
  };

  if (loading) {
    return (
      <section className="container">
        <div className="guessBox" style={{ textDecoration: 'none' }}>
          <div className="guessOval">
            <h1>??</h1>
            <img className="hide" src={pokeball} alt="Loading..." />
          </div>
          <h2 className="subtitle">Loading Pokémon...</h2>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container">
        <div className="guessBox" style={{ textDecoration: 'none' }}>
          <div className="guessOval">
            <h1>??</h1>
            <img src={pokeball} alt="Error" />
          </div>
          <h2 className="subtitle">{error}</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="container">
      {ID && (
        <NavLink to={`/pokemon/details/${ID}`} className="guessBox" style={{ textDecoration: 'none' }}>
          <div className="guessOval">
            <h1>{ID < 10 ? `0${ID}` : ID}</h1>
            {check ? (
              <img className="reveal" src={img} alt={`${name} revealed`} />
            ) : (
              <img className="hide" src={img} alt="Hidden Pokémon - guess who it is!" />
            )}
          </div>
          <h2 className="subtitle">Who&apos;s that POKEMON?</h2>
        </NavLink>
      )}
      <form onSubmit={submitHandler}>
        <input
          type="text"
          ref={answer}
          placeholder="Type your Guess here"
          onChange={changeHandler}
          value={input}
          disabled={check}
        />
        <button type="submit" disabled={check || loading}>
          {check ? 'Correct!' : 'Check Answer'}
        </button>
      </form>
    </section>
  );
}

export default MainPreview;
