// Importa los estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const TemaManager = ({ supabase }) => {
  const [temas, setTemas] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [docentes, setDocentes] = useState([]);
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editTemaId, setEditTemaId] = useState(null);

  useEffect(() => {
    const fetchTemas = async () => {
      try {
        const { data: temasList, error } = await supabase
          .from('temas')
          .select(`
            temaid,
            titulo,
            docente:docentes(docenteid, nombre)
          `);
        if (error) throw error;
    
        setTemas(temasList);
      } catch (error) {
        console.error('Error fetching temas:', error.message);
      }
    };
    

    const fetchDocentes = async () => {
      try {
        const { data: docentesList, error } = await supabase.from('docentes').select('docenteid, nombre');
        if (error) throw error;
        setDocentes(docentesList);
      } catch (error) {
        console.error('Error fetching docentes:', error.message);
      }
    };

    fetchTemas();
    fetchDocentes();
  }, []);

  const addTema = async () => {
    try {
      if (!titulo.trim() || !selectedDocente) return;

      const { data, error } = await supabase
        .from('temas')
        .insert([{ titulo, docenteid: selectedDocente.docenteid }]);
      
      if (error) throw error;

      setTemas([...temas, data[0]]);
      setTitulo('');
      setSelectedDocente(null);
    } catch (error) {
      console.error('Error adding tema:', error.message);
    }
  };

  const updateTema = async () => {
    try {
      if (!titulo.trim() || !selectedDocente || !editTemaId) return;

      const { error } = await supabase
        .from('temas')
        .update({ titulo, docenteid: selectedDocente.docenteid })
        .eq('temaid', editTemaId);

      if (error) throw error;

      setEditMode(false);
      setEditTemaId(null);
      setTemas((prevTemas) =>
        prevTemas.map((tema) =>
          tema.temaid === editTemaId ? { ...tema, titulo, docenteid: selectedDocente.docenteid } : tema
        )
      );

      setTitulo('');
      setSelectedDocente(null);
    } catch (error) {
      console.error('Error updating tema:', error.message);
    }
  };

  const deleteTema = async (temaId) => {
    try {
      const { error } = await supabase.from('temas').delete().eq('temaid', temaId);
      if (error) throw error;

      setTemas(temas.filter((tema) => tema.temaid !== temaId));
    } catch (error) {
      console.error('Error deleting tema:', error.message);
    }
  };

  const handleEdit = (tema) => {
    setEditMode(true);
    setEditTemaId(tema.temaid);
    setTitulo(tema.titulo);
  
    // Buscar el docente correspondiente en la lista de docentes y establecerlo como selectedDocente
    const docente = docentes.find((d) => d.docenteid === tema.docente.docenteid);
    setSelectedDocente(docente);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manejador de Temas</h2>
      <form onSubmit={(e) => { e.preventDefault(); editMode ? updateTema() : addTema(); }} className="mb-4">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese el tema"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <select
            className="form-select"
            value={selectedDocente ? selectedDocente.docenteid : ''}
            onChange={(e) => {
              const selectedDocenteId = parseInt(e.target.value, 10);
              const docente = docentes.find((d) => d.docenteid === selectedDocenteId);
              setSelectedDocente(docente);
            }}
          >
            <option value="" disabled>
              Seleccione un docente
            </option>
            {docentes.map((docente) => (
              <option key={docente.docenteid} value={docente.docenteid}>
                {docente.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          {editMode ? 'Actualizar Tema' : 'Añadir Tema'}
        </button>
      </form>

      {/* Cambios aquí para presentar los datos en una tabla */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Docente</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {temas.map((tema) => (
            <tr key={tema.temaid}>
              <td>{tema.temaid}</td>
              <td>{tema.titulo}</td>
              <td>{tema.docente ? tema.docente.nombre : 'N/A'}</td>
              <td>
                <button onClick={() => deleteTema(tema.temaid)} className="btn btn-danger me-2">
                  Borrar
                </button>
                <button onClick={() => handleEdit(tema)} className="btn btn-warning me-2">
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

TemaManager.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default TemaManager;
