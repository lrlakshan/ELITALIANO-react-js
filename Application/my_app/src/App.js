import React, { Component } from 'react';
import { Router, Route } from 'react-router-dom';

import history from './utils/history';
import login from './components/login';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router history={history}>
        <div>
          <Route exact path="/" component={login} />
        </div>

      </Router>

    );
  }
}

export default App;
