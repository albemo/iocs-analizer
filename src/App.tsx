import React from 'react';
import NavbarComponent from './components/NavbarComponent';
// import IocComponent from './components/ioc/IocComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import IocComponentP from './components/ioc/IocComponentP';

function App() {
  return (
    <>
      <NavbarComponent />
      {/* <IocComponent /> */}
      <IocComponentP />
    </>
  );
}

export default App;
