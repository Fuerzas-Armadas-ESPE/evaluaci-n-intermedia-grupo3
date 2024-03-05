import React from 'react';
import Navbar from './Navbar';

const Home = ({ user }) => {
  return (
    <div>
        <Navbar />
      <h1>GRUPO 3:</h1>
      <p>INTEGRANTES:</p>
      <ul>
        <li>Ayo Dennis</li>
        <li>Chicaiza Michael</li>
        <li>Llumiquinga Dayana</li>
      </ul>
      {user && (
        <p>Bienvenido, {user.email}!</p>
      )}
    </div>
  );
};

export default Home;
