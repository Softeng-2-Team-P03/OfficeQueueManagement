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
    const [serviceList, setServiceList] = useState([]);

    /* Function to get all offered services */
    useEffect(() => {
        API.getServices()
            .then((services) => {
                setServiceList(services);
            })
            .catch(err => { throw err });
        
    }, [])

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
                    <Route path="/client">
                        <Client serviceList={serviceList}/>
                    </Route>
                    <Route path="/">
                        <Manager />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
