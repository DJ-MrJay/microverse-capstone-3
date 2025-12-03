import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { IconContext } from 'react-icons';
import { RiCloseCircleFill } from 'react-icons/ri';
import { POKEMON_ENDPOINT } from '../constants/api';

function MoreDetails() {
  const [shown, setShown] = useState(true);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();

  const clickHandler = () => {
    setShown(false);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${POKEMON_ENDPOINT}/${Number(params.id)}`,
        );
        const statsData = response.data.stats.map((stat) => ({
          name: stat.stat.name,
          value: stat.base_stat,
        }));
        setStats(statsData);
      } catch (err) {
        console.error('Failed to fetch Pokémon stats:', err);
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (!shown) {
    return (
      <button className="more-btn" type="button" onClick={() => setShown(true)}>
        More Details...
      </button>
    );
  }

  return (
    <section className="background">
      <button className="closeBtn" type="button" onClick={clickHandler}>
        <IconContext.Provider value={{ className: 'closeIcon' }}>
          <RiCloseCircleFill />
        </IconContext.Provider>
      </button>
      {loading && <p>Loading stats...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <ul className="statsContainer">
          {stats.map((stat) => (
            <li key={stat.name} className="property">
              {`${stat.name}:`}
              {' '}
              {stat.value}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default MoreDetails;
