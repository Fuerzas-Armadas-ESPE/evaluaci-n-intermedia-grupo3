// TaskList.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import React from 'react';

const TaskList = ({ supabase }) => {
  const [temas, setTemas] = useState([]);

  useEffect(() => {
    async function fetchTemas() {
      try {
        let { data: temas, error } = await supabase
          .from('Temas')
          .select('*')
          .order('TemaID', { ascending: true });

        if (error) {
          throw error;
        }

        setTemas(temas);
      } catch (error) {
        console.error('Error fetching temas:', error.message);
      }
    }

    fetchTemas();
  }, [supabase]);

  async function deleteTema(id) {
    try {
      await supabase.from('Temas').delete().eq('TemaID', id);
      setTemas(temas.filter((tema) => tema.TemaID !== id));
    } catch (error) {
      console.error('Error deleting tema:', error.message);
    }
  }

  return (
    <div>
      <h2>Lista de Temas</h2>
      <ul>
        {temas.map((tema) => (
          <li key={tema.TemaID}>
            {tema.Titulo}
            <button onClick={() => deleteTema(tema.TemaID)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

TaskList.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default TaskList;
