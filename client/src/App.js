import { React, useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import Counter from "./Counter";
import Manager from "./Manager";
import ChooseCounter from "./ChooseCounter";
import API from './API';
import Officer from "./Officer";
import Client from "./Client";


function App() {

    return (
        <Router>
            <div>
                <Switch>
                    <Route path="/officer">
                        <Officer />
                    </Route>
                    <Route path="/counter">
                        <Counter />
                    </Route>
                    <Route path="/manager">
                        <Manager />
                    </Route>
                    <Route path="/choose">
                        <ChooseCounter />
                    </Route>
                    <Route path="/">
                        <Client />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
