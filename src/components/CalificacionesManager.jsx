// CalificacionesManager.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const CalificacionesManager = ({ supabase }) => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [actividades, setActividades] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [selectedActividad, setSelectedActividad] = useState(null);
  const [puntuacion, setPuntuacion] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editCalificacionId, setEditCalificacionId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [estudiantesResponse, actividadesResponse, calificacionesResponse] = await Promise.all([
          supabase.from('estudiantes').select('estudianteid, nombre'),
          supabase.from('actividades').select('actividadid, descripcion'),
          supabase.from('calificaciones').select('*').order('calificacionid', { ascending: true }),
        ]);
  
        const estudiantesList = estudiantesResponse.data || [];
        const actividadesList = actividadesResponse.data || [];
        const calificacionesList = calificacionesResponse.data || [];
  
        setEstudiantes(estudiantesList);
        setActividades(actividadesList);
  
        const calificacionesWithNames = calificacionesList.map((calificacion) => {
          const estudianteID = calificacion.estudianteid;
          const actividadID = calificacion.actividadid;
  
          const estudiante = estudiantesList.find((est) => est.estudianteid === estudianteID);
          const actividad = actividadesList.find((act) => act.actividadid === actividadID);
  
          return {
            ...calificacion,
            estudianteNombre: estudiante ? estudiante.nombre : 'N/A',
            actividadDescripcion: actividad ? actividad.descripcion : 'N/A',
          };
        });
  
        setCalificaciones(calificacionesWithNames);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
  
    fetchData();
  }, [supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!puntuacion.trim() || !selectedEstudiante || !selectedActividad) return;
  
    try {
      let updatedCalificaciones;
  
      if (editMode && editCalificacionId) {
        // Modo de edición
        await supabase
          .from('calificaciones')
          .update({
            estudianteid: selectedEstudiante.estudianteid,
            actividadid: selectedActividad.actividadid,
            puntuacion: parseFloat(puntuacion),
          })
          .eq('calificacionid', editCalificacionId);
  
        setEditMode(false);
        setEditCalificacionId(null);
  
        // Buscar el estudiante y la actividad correspondientes
        const estudiante = estudiantes.find((est) => est.estudianteid === selectedEstudiante.estudianteid);
        const actividad = actividades.find((act) => act.actividadid === selectedActividad.actividadid);
  
        // Actualizar los nombres de estudiante y actividad después de la edición
        updatedCalificaciones = calificaciones.map((calificacion) =>
          calificacion.calificacionid === editCalificacionId
            ? {
                ...calificacion,
                estudianteNombre: estudiante ? estudiante.nombre : 'N/A',
                actividadDescripcion: actividad ? actividad.descripcion : 'N/A',
                puntuacion: parseFloat(puntuacion),
              }
            : calificacion
        );
      } else {
        // Modo de añadir
        const { data, error } = await supabase
          .from('calificaciones')
          .insert({
            estudianteid: selectedEstudiante.estudianteid,
            actividadid: selectedActividad.actividadid,
            puntuacion: parseFloat(puntuacion),
          });
  
        if (error) {
          throw error;
        }
  
        // Actualizar la lista de calificaciones con el nuevo registro
        if (data && data.length > 0) {
          const nuevaCalificacion = {
            ...data[0],
            estudianteNombre: selectedEstudiante.nombre,
            actividadDescripcion: selectedActividad.descripcion,
          };
          updatedCalificaciones = [...calificaciones, nuevaCalificacion];
        } else {
          console.error('Error adding/editing calificacion: No data returned');
          return;
        }
      }
  
      setCalificaciones(updatedCalificaciones);
      setPuntuacion('');
      setSelectedEstudiante(null);
      setSelectedActividad(null);
    } catch (error) {
      console.error('Error adding/editing calificacion:', error.message);
    }
  };
  

  const deleteCalificacion = async (id) => {
    try {
      await supabase.from('calificaciones').delete().eq('calificacionid', id);
      setCalificaciones(calificaciones.filter((calificacion) => calificacion.calificacionid !== id));
    } catch (error) {
      console.error('Error deleting calificacion:', error.message);
    }
  };

  const handleEdit = (calificacion) => {
    setEditMode(true);
    setEditCalificacionId(calificacion.calificacionid);
    setSelectedEstudiante({ estudianteid: calificacion.estudianteid, nombre: calificacion.estudianteNombre });
    setSelectedActividad({ actividadid: calificacion.actividadid, descripcion: calificacion.actividadDescripcion });
    setPuntuacion(calificacion.puntuacion.toString());
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manejador de Calificaciones</h2>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="estudiante" className="form-label">
                Estudiante
              </label>
              <select
                id="estudiante"
                className="form-select"
                value={selectedEstudiante ? selectedEstudiante.estudianteid : ''}
                onChange={(e) => {
                  const selectedEstudianteID = parseInt(e.target.value, 10);
                  const estudiante = estudiantes.find((est) => est.estudianteid === selectedEstudianteID);
                  setSelectedEstudiante(estudiante);
                }}
              >
                <option value="" disabled>
                  Seleccione un estudiante
                </option>
                {estudiantes.map((estudiante) => (
                  <option key={estudiante.estudianteid} value={estudiante.estudianteid}>
                    {estudiante.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="actividad" className="form-label">
                Actividad
              </label>
              <select
                id="actividad"
                className="form-select"
                value={selectedActividad ? selectedActividad.actividadid : ''}
                onChange={(e) => {
                  const selectedActividadID = parseInt(e.target.value, 10);
                  const actividad = actividades.find((act) => act.actividadid === selectedActividadID);
                  setSelectedActividad(actividad);
                }}
              >
                <option value="" disabled>
                  Seleccione una actividad
                </option>
                {actividades.map((actividad) => (
                  <option key={actividad.actividadid} value={actividad.actividadid}>
                    {actividad.descripcion}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="puntuacion" className="form-label">
                Puntuación
              </label>
              <input
                type="number"
                id="puntuacion"
                className="form-control"
                placeholder="Ingrese la puntuación"
                value={puntuacion}
                onChange={(e) => setPuntuacion(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {editMode ? 'Actualizar Calificación' : 'Añadir Calificación'}
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <div>
            <h2>Lista de Calificaciones</h2>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Estudiante</th>
                    <th>Actividad</th>
                    <th>Puntuación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {calificaciones.map((calificacion) => (
                    <tr key={calificacion.calificacionid}>
                      <td>{calificacion.calificacionid}</td>
                      <td>{calificacion.estudianteNombre}</td>
                      <td>{calificacion.actividadDescripcion}</td>
                      <td>{calificacion.puntuacion}</td>
                      <td>
                        <button className="btn btn-danger me-2" onClick={() => deleteCalificacion(calificacion.calificacionid)}>
                          Borrar
                        </button>
                        <button className="btn btn-warning me-2" onClick={() => handleEdit(calificacion)}>
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

CalificacionesManager.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default CalificacionesManager;
