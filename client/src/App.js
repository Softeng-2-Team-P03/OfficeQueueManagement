import { React, useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Counter from "./Counter";
import Officer from "./Officer";
import API from './API';


function App() {

  return (
      <Router>
          <div>
              <Switch>
                  <Route path="/counter">
                      <Counter />
                  </Route>
                  <Route path="/">
                      <Officer/>
                  </Route>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
