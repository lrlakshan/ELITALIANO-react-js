import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from "history";

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { HashRouter as Router } from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './store/reducer';

const hist = createBrowserHistory();

const store = createStore(reducer);

// import React from "react";
// import ReactDOM from "react-dom";
// import { createBrowserHistory } from "history";
// import { Router, Route, Switch } from "react-router-dom";

// import indexRoutes from "./routes/index.jsx";

// import "./assets/scss/material-dashboard-pro-react.css?v=1.4.0";

// const hist = createBrowserHistory();

ReactDOM.render(<Router><Provider store={store}><App /></Provider></Router>, document.getElementById('root'));
// ReactDOM.render(
//     <Router history={hist}>
//         <Switch>
//             {indexRoutes.map((prop, key) => {
//                 return <Route path={prop.path} component={prop.component} key={key} />;
//             })}
//         </Switch>
//     </Router>,
//     document.getElementById("root")
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
