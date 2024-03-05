// DocentesManager.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';

const DocentesManager = ({ supabase }) => {
  const [docentes, setDocentes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [roles, setRoles] = useState([]);
  const [selectedRol, setSelectedRol] = useState(roles.length > 0 ? roles[0] : null);
  const [editMode, setEditMode] = useState(false);
  const [editDocenteId, setEditDocenteId] = useState(null);

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

    const fetchDocentes = async () => {
      try {
        let { data: docentes, error } = await supabase
          .from('docentes')
          .select('*')
          .order('docenteid', { ascending: true });

        if (error) {
          throw error;
        }

        const docentesWithRole = await Promise.all(
          docentes.map(async (docente) => {
            const { data: rolData, error: rolError } = await supabase
              .from('roles')
              .select('nombrerol')
              .eq('rolid', docente.rolid)
              .single();
    
            if (rolError) {
              throw rolError;
            }
    
            const rol = rolData ? rolData.nombrerol : 'Rol no definido'; // Asegurarse de manejar el caso donde rolData no esté definido
    
            return {
              ...docente,
              nombrerol: rol,
            };
          })
        );
    
        setDocentes(docentesWithRole);
      } catch (error) {
        console.error('Error fetching docentes:', error.message);
      }
    };

    fetchRoles();
    fetchDocentes();
  }, [supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim() || !selectedRol) return;

    try {
      if (editMode && editDocenteId) {
        // Modo de edición
        await supabase
          .from('docentes')
          .update([{ nombre, rolid: selectedRol.rolid }])
          .eq('docenteid', editDocenteId);
        
        setEditMode(false);
        setEditDocenteId(null);
      } else {
        // Modo de añadir
        const { data, error } = await supabase
          .from('docentes')
          .insert([{ nombre, rolid: selectedRol.rolid }]);
        
        if (error) {
          throw error;
        }

        setDocentes((prevDocentes) => [...prevDocentes, { ...data[0], nombrerol: selectedRol.nombrerol }]);
      }

      setNombre('');
      setSelectedRol(null);
    } catch (error) {
      console.error('Error adding/editing docente:', error.message);
    }
  };

  const deleteDocente = async (id) => {
    try {
      await supabase.from('docentes').delete().eq('docenteid', id);
      setDocentes(docentes.filter((docente) => docente.docenteid !== id));
    } catch (error) {
      console.error('Error deleting docente:', error.message);
    }
  };

  const handleEdit = (docente) => {
    setEditMode(true);
    setEditDocenteId(docente.docenteid);
    setNombre(docente.nombre);

    // Verificar si docente.rolid está definido antes de asignarlo a selectedRol
    const rol = roles.find((r) => r.rolid === docente.rolid);
    setSelectedRol(rol || null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manejador de Docentes</h2>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre del Docente
              </label>
              <input
                type="text"
                id="nombre"
                className="form-control"
                placeholder="Ingrese el nombre del docente"
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
                  setSelectedRol(rol || null);
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
              {editMode ? 'Actualizar Docente' : 'Añadir Docente'}
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <div>
            <h2>Lista de Docentes</h2>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {docentes.map((docente) => (
                    <tr key={docente.docenteid}>
                      <td>{docente.nombre}</td>
                      <td>{docente.nombrerol}</td>
                      <td>
                      <button type="button" className="btn btn-danger me-2" onClick={(e) => { e.stopPropagation(); deleteDocente(docente.docenteid) }}>
                        Borrar
                      </button>
                      <button type="button" className="btn btn-warning me-2" onClick={(e) => { e.stopPropagation(); handleEdit(docente) }}>
                        Editar
                      </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-center">
                      {/* Aquí puedes agregar tus botones adicionales */}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

DocentesManager.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default DocentesManager;
