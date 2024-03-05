import React from 'react';
import Navbar from './Navbar';

const Home = ({ user }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '150px',
      backgroundColor: '#76D7C4',
      borderRadius: '10px',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      width: '120%', /* Ajusta el ancho aquí */
      margin: '0 auto' /* Centra el contenido horizontalmente */
    }}>
      <Navbar />
      <h1 style={{ 
        fontSize: '90px', 
        marginBottom: '20px',
        color: '#333'
      }}>GRUPO 3:</h1>
      <p style={{ 
        fontSize: '18px', 
        fontWeight: 'bold',
        color: '#555'
      }}>INTEGRANTES:</p>
      <ul style={{ 
        listStyleType: 'none', 
        padding: 0,
        textAlign: 'center'
      }}>
        <li style={{ 
          fontSize: '16px', 
          marginBottom: '5px',
          color: '#777'
        }}>Ayo Dennis</li>
        <li style={{ 
          fontSize: '16px', 
          marginBottom: '5px',
          color: '#777'
        }}>Chicaiza Michael</li>
        <li style={{ 
          fontSize: '16px', 
          marginBottom: '5px',
          color: '#777'
        }}>Llumiquinga Dayana</li>
      </ul>
      {user && (
        <p style={{ 
          fontSize: '16px', 
          marginTop: '20px',
          color: '#444'
        }}>Bienvenido, {user.email}!</p>
      )}
    </div>
  );
};

export default Home;
