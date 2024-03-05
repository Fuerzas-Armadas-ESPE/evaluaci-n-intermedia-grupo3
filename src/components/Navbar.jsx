import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid text-center">
        <Link className="navbar-brand" to="/">Mi Proyecto</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/tema">Tema</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/docentes">Docentes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/estudiantes">Estudiantes</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/actividad">Actividad</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/calificaciones">Calificaciones</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tarea">Tarea</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/rol">Rol</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reporte-curso">Reporte de Curso</Link>
            </li>
            {/* Agrega más enlaces para otros componentes */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
