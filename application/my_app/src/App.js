import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import indexRoutes from "./routes/index.jsx";
import "./assets/scss/material-dashboard-pro-react.css?v=1.4.0";

import Login from './pages/login';

import './App.css';

class App extends Component {

  render() {
    return (
      <div>
        <Switch>
          {indexRoutes.map((prop, key) => {
            if (localStorage.length > 0) {
              return <Route path={prop.path} component={prop.component} key={key} />;
            }
            return <Route path='/' component={Login} key={key} />;
        })}
        </Switch>
      </div>

    );
  }
}

export default App;
