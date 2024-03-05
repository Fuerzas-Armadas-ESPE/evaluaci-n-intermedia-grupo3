// EstudiantesManager.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const EstudiantesManager = ({ supabase }) => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedRol, setSelectedRol] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editEstudianteId, setEditEstudianteId] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data: rolesList, error } = await supabase.from('roles').select('rolid, nombrerol');
        if (error) {
          throw error;
        }
        setRoles(rolesList);
      } catch (error) {
        console.error('Error fetching roles:', error.message);
      }
    };

    const fetchEstudiantes = async () => {
      try {
        let { data: estudiantes, error } = await supabase
          .from('estudiantes')
          .select('*')
          .order('estudianteid', { ascending: true });

        if (error) {
          throw error;
        }

        const estudiantesWithRole = await Promise.all(
          estudiantes.map(async (estudiante) => {
            const { data: rolData, error: rolError } = await supabase
              .from('roles')
              .select('nombrerol')
              .eq('rolid', estudiante.rolid)
              .single();

            if (rolError) {
              throw rolError;
            }

            return {
              ...estudiante,
              nombrerol: rolData.nombrerol,
            };
          })
        );

        setEstudiantes(estudiantesWithRole);
      } catch (error) {
        console.error('Error fetching estudiantes:', error.message);
      }
    };

    fetchRoles();
    fetchEstudiantes();
  }, [supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !selectedRol) return;

    try {
      if (editMode && editEstudianteId) {
        // Modo de edición
        await supabase
          .from('estudiantes')
          .update([{ nombre, rolid: selectedRol.rolid }])
          .eq('estudianteid', editEstudianteId);
        
        setEditMode(false);
        setEditEstudianteId(null);
      } else {
        // Modo de añadir
        const { data, error } = await supabase
          .from('estudiantes')
          .insert([{ nombre, rolid: selectedRol.rolid }]);
        
        if (error) {
          throw error;
        }

        setEstudiantes((prevEstudiantes) => [...prevEstudiantes, { ...data[0], nombrerol: selectedRol.nombrerol }]);
      }

      setNombre('');
      setSelectedRol(null);
    } catch (error) {
      console.error('Error adding/editing estudiante:', error.message);
    }
  };

  const deleteEstudiante = async (id) => {
    try {
      await supabase.from('estudiantes').delete().eq('estudianteid', id);
      setEstudiantes(estudiantes.filter((estudiante) => estudiante.estudianteid !== id));
    } catch (error) {
      console.error('Error deleting estudiante:', error.message);
    }
  };

  const handleEdit = (estudiante) => {
    setEditMode(true);
    setEditEstudianteId(estudiante.estudianteid);
    setNombre(estudiante.nombre);
    setSelectedRol({ rolid: estudiante.rolid, nombrerol: estudiante.nombrerol });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manejador de Estudiantes</h2>
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre del Estudiante
              </label>
              <input
                type="text"
                id="nombre"
                className="form-control"
                placeholder="Ingrese el nombre del estudiante"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="rol" className="form-label">
                Rol
              </label>
              <select
                id="rol"
                className="form-select"
                value={selectedRol ? selectedRol.rolid : ''}
                onChange={(e) => {
                  const selectedrolid = parseInt(e.target.value, 10);
                  const rol = roles.find((r) => r.rolid === selectedrolid);
                  setSelectedRol(rol);
                }}
              >
                <option value="" disabled>
                  Seleccione un rol
                </option>
                {roles.map((rol) => (
                  <option key={rol.rolid} value={rol.rolid}>
                    {rol.nombrerol}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              {editMode ? 'Actualizar Estudiante' : 'Añadir Estudiante'}
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <div>
            <h2>Lista de Estudiantes</h2>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre del Estudiante</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((estudiante) => (
                    <tr key={estudiante.estudianteid}>
                      <td>{estudiante.estudianteid}</td>
                      <td>{estudiante.nombre}</td>
                      <td>{estudiante.nombrerol}</td>
                      <td>
                        <button className="btn btn-danger me-2" onClick={() => deleteEstudiante(estudiante.estudianteid)}>
                          Borrar
                        </button>
                        <button className="btn btn-warning me-2" onClick={() => handleEdit(estudiante)}>
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
  );
};

EstudiantesManager.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default EstudiantesManager;
