// TaskForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

const TaskForm = ({ supabase }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const { error } = await supabase.from('tasks').insert([{ title }]);
      if (error) {
        throw error;
      }
      setTitle('');
    } catch (error) {
      console.error('Error adding task:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ingrese la Tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">Añadir Tarea</button>
    </form>
  );
};

TaskForm.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default TaskForm;
