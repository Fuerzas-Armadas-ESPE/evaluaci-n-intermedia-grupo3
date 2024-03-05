import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import DocentesManager from './components/DocentesManager';
import EstudiantesManager from './components/EstudiantesManager';
import ActividadManager from './components/ActividadManager';
import CalificacionesManager from './components/CalificacionesManager';
import ReporteCurso from './components/ReporteCurso';
import TemaManager from './components/TemaManager';
import TareaManager from './components/TareaManager';
import RolManager from './components/RolManager';
import Home from './components/Home';
import './index.css';

// Configurar el cliente Supabase
const supabaseUrl = import.meta.env.VITE_REACT_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_REACT_APP_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const session = supabase.auth.getSession();
		setUser(session?.user);
		const { data: authListener } = supabase.auth.onAuthStateChange(
			(event, session) => {
				switch (event) {
					case "SIGNED_IN":
						setUser(session?.user);
						break;
					case "SIGNED_OUT":
						setUser(null);
						break;
					default:
				}
			}
		);
		return () => {
			supabase.auth.onAuthStateChange((event, session) => {
      });
		};
	}, []);

	const login = async () => {
		await supabase.auth.signInWithOAuth({
			provider: "github",
		});
	};
	const logout = async () => {
		await supabase.auth.signOut();
	};

	return (
		<Router>
			<div>
				<div className="container md-12 align-center">
				<Routes>
					<Route path="/tema" element={<TemaManager supabase={supabase} />} />
					<Route path="/docentes" element={<DocentesManager supabase={supabase} />} />
					<Route path="/estudiantes" element={<EstudiantesManager supabase={supabase} />} />
					<Route path="/actividad" element={<ActividadManager supabase={supabase} />} />
					<Route path="/calificaciones" element={<CalificacionesManager supabase={supabase} />} />
					<Route path="/reporte-curso" element={<ReporteCurso supabase={supabase} />} />
					<Route path="/tarea" element={<TareaManager supabase={supabase} />} />
					<Route path="/rol" element={<RolManager supabase={supabase} />} />
					<Route path="/home" element={<Home />} />
				</Routes>

				{user ? (
					<div>
					<Home user={user} />
					<button onClick={logout}>Cerrar Sesión</button>
					</div>
				) : (
					<button onClick={login}>Ingresar con Github</button>
				)}
				</div>
			</div>
		</Router>
		);
	};