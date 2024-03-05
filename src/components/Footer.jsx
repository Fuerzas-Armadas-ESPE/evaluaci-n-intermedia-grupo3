import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light text-center p-4">
      <div className="container">
      <div className="mt-3">
        <p>&copy; {new Date().getFullYear()} Mi Proyecto. Todos los derechos reservados.</p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;
