import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TareaManager = ({ supabase }) => {
  const [tareas, setTareas] = useState([]);
  const [observaciones, setObservaciones] = useState('');
  const [claseImpartida, setClaseImpartida] = useState(false);
  const [actividadPendiente, setActividadPendiente] = useState(false);
  const [temas, setTemas] = useState([]);
  const [selectedTema, setSelectedTema] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTareaId, setEditTareaId] = useState(null);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        let { data: tareas, error } = await supabase
          .from('tareas')
          .select('*')
          .order('tareaid', { ascending: true });

        if (error) throw error;

        const tareasWithTema = await Promise.all(
          tareas.map(async (tarea) => {
            const { data: temaData, error: temaError } = await supabase
              .from('temas')
              .select('titulo')
              .eq('temaid', tarea.temaid)
              .single();

            if (temaError) throw temaError;

            return {
              ...tarea,
              temaTitulo: temaData.titulo,
            };
          })
        );

        setTareas(tareasWithTema);
      } catch (error) {
        console.error('Error fetching tareas:', error.message);
      }
    };

    const fetchTemas = async () => {
      try {
        const { data: temasList, error } = await supabase.from('temas').select('temaid, titulo');
        if (error) throw error;
        setTemas(temasList);
      } catch (error) {
        console.error('Error fetching temas:', error.message);
      }
    };

    fetchTareas();
    fetchTemas();
  }, [supabase]);

  const addTarea = async () => {
    try {
      if (!observaciones.trim() || !selectedTema) return;
  
      const { data, error } = await supabase
        .from('tareas')
        .insert([
          {
            observaciones,
            claseimpartida: claseImpartida,
            actividadpendiente: actividadPendiente,
            temaid: selectedTema.temaid,
          },
        ]);

      console.log('Data:', data);
      console.log('Error:', error);

      if (error) {
        console.error('Error adding tarea:', error.message);
      } else if (data && data.length > 0) {
        setTareas([...tareas, { ...data[0], temaTitulo: selectedTema.titulo }]);
        setObservaciones('');
        setClaseImpartida(false);
        setActividadPendiente(false);
        setSelectedTema(null);
      } else {
        console.error('Error adding tarea: No data returned');
      }
    } catch (error) {
      console.error('Error adding tarea:', error.message);
    }
  };
  

  const updateTarea = async () => {
    try {
      if (!observaciones.trim() || !selectedTema || !editTareaId) return;
  
      const { error } = await supabase
        .from('tareas')
        .update({
          observaciones,
          claseimpartida: claseImpartida,
          actividadpendiente: actividadPendiente,
          temaid: selectedTema.temaid,
        })
        .eq('tareaid', editTareaId);
  
      if (error) throw error;
  
      setEditMode(false);
      setEditTareaId(null);
  
      setTareas((prevTareas) =>
        prevTareas.map((tarea) =>
          tarea.tareaid === editTareaId
            ? { ...tarea, observaciones, claseImpartida, actividadPendiente, temaTitulo: selectedTema.titulo }
            : tarea
        )
      );
  
      // Imprime el estado actualizado
      console.log('Updated Tareas:', tareas.map((tarea) =>
        tarea.tareaid === editTareaId
          ? { ...tarea, observaciones, claseImpartida, actividadPendiente, temaTitulo: selectedTema.titulo }
          : tarea
      ));
  
      setObservaciones('');
      setClaseImpartida(false);
      setActividadPendiente(false);
      setSelectedTema(null);
    } catch (error) {
      console.error('Error updating tarea:', error.message);
    }
  };
  

  const deleteTarea = async (tareaId) => {
    try {
      const { error } = await supabase.from('tareas').delete().eq('tareaid', tareaId);
      if (error) throw error;

      setTareas(tareas.filter((tarea) => tarea.tareaid !== tareaId));
    } catch (error) {
      console.error('Error deleting tarea:', error.message);
    }
  };

  const handleEdit = (tarea) => {
    setEditMode(true);
    setEditTareaId(tarea.tareaid);
    setObservaciones(tarea.observaciones);
    setClaseImpartida(tarea.claseimpartida);
    setActividadPendiente(tarea.actividadpendiente);
    setSelectedTema(temas.find((tema) => tema.temaid === tarea.temaid));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manejador de Tareas</h2>
      <form onSubmit={(e) => { e.preventDefault(); editMode ? updateTarea() : addTarea(); }} className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese observaciones de la tarea"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <select
            className="form-select"
            value={selectedTema ? selectedTema.temaid : ''}
            onChange={(e) => {
              const selectedTemaID = parseInt(e.target.value, 10);
              const tema = temas.find((t) => t.temaid === selectedTemaID);
              setSelectedTema(tema);
            }}
          >
            <option value="" disabled>
              Seleccione un tema
            </option>
            {temas.map((tema) => (
              <option key={tema.temaid} value={tema.temaid}>
                {tema.titulo}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={claseImpartida}
            onChange={() => setClaseImpartida(!claseImpartida)}
          />
          <label className="form-check-label">Clase Impartida</label>
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            checked={actividadPendiente}
            onChange={() => setActividadPendiente(!actividadPendiente)}
          />
          <label className="form-check-label">Actividad Pendiente</label>
        </div>
        <button type="submit" className="btn btn-primary">
          {editMode ? 'Actualizar Tarea' : 'Añadir Tarea'}
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Tema</th>
            <th scope="col">Observaciones</th>
            <th scope="col">Clase Impartida</th>
            <th scope="col">Actividad Pendiente</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={tarea.tareaid}>
              <td>{tarea.temaTitulo}</td>
              <td>{tarea.observaciones}</td>
              <td>{tarea.claseimpartida ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}</td>
              <td>{tarea.actividadpendiente ? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} />}</td>
              <td>
                <button onClick={() => deleteTarea(tarea.tareaid)} className="btn btn-danger me-2">
                  Borrar
                </button>
                <button onClick={() => handleEdit(tarea)} className="btn btn-warning me-2">
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

TareaManager.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default TareaManager;
