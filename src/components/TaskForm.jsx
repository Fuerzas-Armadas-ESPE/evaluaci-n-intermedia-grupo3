// TaskForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

const TaskForm = ({ supabase }) => {
  const [titulo, setTitulo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) return;
    try {
      const { error } = await supabase.from('Temas').insert([{ Titulo: titulo }]);
      if (error) {
        throw error;
      }
      setTitulo('');
    } catch (error) {
      console.error('Error adding tema:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ingrese el Título del Tema"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <button type="submit">Añadir Tema</button>
    </form>
  );
};

TaskForm.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default TaskForm;
