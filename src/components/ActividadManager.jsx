import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const ActividadManager = ({ supabase }) => {
  const [actividades, setActividades] = useState([]);
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('Pendiente');
  const [temas, setTemas] = useState([]);
  const [selectedTema, setSelectedTema] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editActividadId, setEditActividadId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [temasResponse, actividadesResponse] = await Promise.all([
          supabase.from('temas').select('temaid, titulo'),
          supabase.from('actividades').select('*').order('actividadid', { ascending: true }),
        ]);

        const temasList = temasResponse.data || [];
        const actividadesList = actividadesResponse.data || [];

        setTemas(temasList);

        const actividadesWithTopics = actividadesList.map((actividad) => {
          const temaID = actividad.temaid;
          const tema = temasList.find((tem) => tem.temaid === temaID);

          return {
            ...actividad,
            tema: tema || null,
          };
        });

        setActividades(actividadesWithTopics);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, [supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!descripcion.trim() || !selectedTema) return;

    try {
      let updatedActividades;

      if (editMode && editActividadId) {
        // Modo de edición
        await supabase
          .from('actividades')
          .update([{ descripcion, estado, temaid: selectedTema.temaid }])
          .eq('actividadid', editActividadId);

        setEditMode(false);
        setEditActividadId(null);

        // Buscar el tema correspondiente
        const tema = temas.find((tem) => tem.temaid === selectedTema.temaid);

        // Actualizar la lista de actividades después de la edición
        updatedActividades = actividades.map((actividad) =>
          actividad.actividadid === editActividadId
            ? {
                ...actividad,
                descripcion,
                estado,
                tema,
              }
            : actividad
        );
      } else {
        // Modo de añadir
        const { data, error } = await supabase
          .from('actividades')
          .insert([{ descripcion, estado, temaid: selectedTema.temaid }]);

        if (error) {
          throw error;
        }

        // Actualizar la lista de actividades con el nuevo registro
        updatedActividades = [...actividades, { ...data[0], tema: selectedTema }];
      }

      setActividades(updatedActividades);
      setDescripcion('');
      setEstado('Pendiente');
      setSelectedTema(null);
    } catch (error) {
      console.error('Error adding/editing actividad:', error.message);
    }
  };

  const deleteActividad = async (id) => {
    try {
      await supabase.from('actividades').delete().eq('actividadid', id);
      setActividades(actividades.filter((actividad) => actividad.actividadid !== id));
    } catch (error) {
      console.error('Error deleting actividad:', error.message);
    }
  };

  const handleEdit = (actividad) => {
    setEditMode(true);
    setEditActividadId(actividad.actividadid);
    setDescripcion(actividad.descripcion);
    setEstado(actividad.estado);
    setSelectedTema(temas.find((tema) => tema.temaid === actividad.temaid));
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manejador de Actividades</h2>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="descripcion" className="form-label">
                Descripción
              </label>
              <input
                type="text"
                id="descripcion"
                className="form-control"
                placeholder="Ingrese la descripción de la actividad"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tema" className="form-label">
                Tema
              </label>
              <select
                className="form-control"
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
            <div className="mb-3">
              <label htmlFor="estado" className="form-label">
                Estado
              </label>
              <select
                className="form-control"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Realizada">Realizada</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              {editMode ? 'Actualizar Actividad' : 'Añadir Actividad'}
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <div>
            <h2>Lista de Actividades</h2>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Descripción</th>
                    <th>Estado</th>
                    <th>Tema</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {actividades.map((actividad) => (
                    <tr key={actividad.actividadid}>
                      <td>{actividad.actividadid}</td>
                      <td>{actividad.descripcion}</td>
                      <td>{actividad.estado}</td>
                      <td>{actividad.tema ? actividad.tema.titulo : 'N/A'}</td>
                      <td>
                        <button className="btn btn-danger me-2" onClick={() => deleteActividad(actividad.actividadid)}>
                          Borrar
                        </button>
                        <button className="btn btn-warning me-2" onClick={() => handleEdit(actividad)}>
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ActividadManager.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default ActividadManager;
