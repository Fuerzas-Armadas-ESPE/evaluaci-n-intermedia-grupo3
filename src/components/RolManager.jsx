import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const RolManager = ({ supabase }) => {
  const [roles, setRoles] = useState([]);
  const [nombrerol, setNombreRol] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editRolId, setEditRolId] = useState(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        let { data: roles, error } = await supabase.from('roles').select('*').order('rolid', { ascending: true });

        if (error) throw error;

        setRoles(roles);
      } catch (error) {
        console.error('Error fetching roles:', error.message);
      }
    };

    fetchRoles();
  }, [supabase]);

  const addRol = async () => {
    try {
      if (!nombrerol.trim()) return;
  
      const { data, error } = await supabase.from('roles').insert([{ nombrerol }]);
  
      if (error) throw error;
  
      // Verifica si data es una matriz no vacía
      if (data && data.length > 0) {
        // Extrae el primer elemento si hay datos
        const nuevoRol = data[0];
        if (nuevoRol) {
          setRoles([...roles, nuevoRol]);
          setNombreRol('');
        } else {
          console.error('Error adding rol: Data returned, but no valid rol object');
        }
      } else {
        // Maneja el caso en que data está vacío
        console.error('Error adding rol: No data returned');
      }
    } catch (error) {
      console.error('Error adding rol:', error.message);
    }
  };

  const updateRol = async () => {
    try {
      if (!nombrerol.trim() || !editRolId) return;

      const { error } = await supabase
        .from('roles')
        .update({ nombrerol })
        .eq('rolid', editRolId);

      if (error) throw error;

      setEditMode(false);
      setEditRolId(null);
      setRoles((prevRoles) =>
        prevRoles.map((rol) => (rol.rolid === editRolId ? { ...rol, nombrerol } : rol))
      );

      setNombreRol('');
    } catch (error) {
      console.error('Error updating rol:', error.message);
    }
  };

  const deleteRol = async (rolId) => {
    try {
      const { error } = await supabase.from('roles').delete().eq('rolid', rolId);
      if (error) throw error;

      setRoles(roles.filter((rol) => rol.rolid !== rolId));
    } catch (error) {
      console.error('Error deleting rol:', error.message);
    }
  };

  const handleEdit = (rol) => {
    setEditMode(true);
    setEditRolId(rol.rolid);
    setNombreRol(rol.nombrerol);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manejador de Roles</h2>
      <form onSubmit={(e) => { e.preventDefault(); editMode ? updateRol() : addRol(); }} className="mb-4">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre del Rol
          </label>
          <input
            type="text"
            id="nombre"
            className="form-control"
            placeholder="Ingrese el nombre del rol"
            value={nombrerol}
            onChange={(e) => setNombreRol(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {editMode ? 'Actualizar Rol' : 'Añadir Rol'}
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((rol) => (
            <tr key={rol.rolid}>
              <td>{rol.rolid}</td>
              <td>{rol.nombrerol}</td>
              <td>
                <button onClick={() => deleteRol(rol.rolid)} className="btn btn-danger me-2">
                  Borrar
                </button>
                <button onClick={() => handleEdit(rol)} className="btn btn-warning me-2">
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

RolManager.propTypes = {
  supabase: PropTypes.object.isRequired,
};

export default RolManager;
