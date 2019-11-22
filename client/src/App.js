import React from 'react';
import './App.css';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Appnavbar from './components/Appnavbar';
import Home from './components/Home';
import Doctor from './components/Doctor';
import Patient from './components/Patient';
import NotFound from './components/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Appnavbar />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/patient' component={Patient} />
          <Route exact path='/doctor' component={Doctor} />
          <Route path='/' component={NotFound} />
        </Switch>
    </BrowserRouter>
  );
}

export default App;
