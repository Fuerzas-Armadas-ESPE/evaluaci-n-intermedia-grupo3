import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
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
		<div>
			{user ? (
				<div>          
          <h1>GRUPO 3:</h1>
		  <p>INTEGRANTES:</p>
		  <ul>
			<li>Ayo Dennis</li>
			<li>Chicaiza Michael</li>
      <li>Llumiquinga Dayana</li>
		  </ul>
          <TaskForm supabase={supabase} />
          <TaskList supabase={supabase} />    					
					<button onClick={logout}>Cerrar Sesion</button>
				</div>
			) : (
				<button onClick={login}>Ingrese con Github</button>
			)}
		</div>
	);
}