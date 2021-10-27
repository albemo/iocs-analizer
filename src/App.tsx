import React from 'react';
import NavbarComponent from './components/NavbarComponent';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import IocComponentP from './components/ioc/IocComponent';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import IpComponent from './components/ip/IpComponent';

function App() {
  return (
    <>
    <Router>
      <NavbarComponent />
      <Switch>
        <Route path="/virus-total">
          <IocComponentP />
        </Route>
        <Route path="/ip">
          <IpComponent />
        </Route>
      </Switch>
    </Router>
    </>
  );
}

export default App;
