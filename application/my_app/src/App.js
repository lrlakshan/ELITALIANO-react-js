import React, { Component } from 'react';
import { withRouter, Route, Redirect, Router, Switch } from 'react-router-dom';
import { createBrowserHistory } from "history";
import indexRoutes from "./routes/index.jsx";
import "./assets/scss/material-dashboard-pro-react.css?v=1.4.0";



//import history from './utils/history';
import Login from './pages/login';
import Main from "./pages/dashboard";

import './App.css';

const hist = createBrowserHistory();

const oUser = JSON.parse(localStorage.getItem('user'));

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (localStorage.length > 0) {
      console.log('length is zero');
    }
  }

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
