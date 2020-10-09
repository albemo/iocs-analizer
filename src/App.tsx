import React from 'react';
import NavbarComponent from './components/NavbarComponent';
import IocComponent from './components/ioc/IocComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <>
      <NavbarComponent />
      <IocComponent />
    </>
  );
}

export default App;
