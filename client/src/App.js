import { React, useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import Counter from "./Counter";
import Manager from "./Manager";
import ChooseCounter from "./ChooseCounter";
import API from './API';
import Officer from "./Officer";
import Client from "./Client";
import { LoginComponent } from './LoginComponent';
import { AppNavbar } from './AppNavbar';

function App() {

    const [loggedIn, setLoggedIn] = useState(false);
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(undefined);



    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userInfo = await API.getUserInfo();
                setLoggedIn(true);
                setUser(userInfo);
            } catch (err) {
                console.error(err.error);
            }
        };
        checkAuth();
    }, []);

    const userLoginCallback = async (email, password) => {
        // Make POST request to authentication server
        try {
            const userInfo = await API.logIn({ username: email, password: password });
            setMessage({ msg: `Welcome!`, type: 'text-success' });
            setLoggedIn(true);
            setUser(userInfo);
        } catch (err) {
            setMessage({ msg: err, type: 'text-danger' });
        }
    };

    const userLogoutCallback = () => {
        API.logOut().then(() => {
            setLoggedIn(false);
            setMessage('');
            setUser(undefined);
        });
    }

    return (
        <Router>
            <div>
                <AppNavbar loggedIn={loggedIn} userLogoutCallback={userLogoutCallback} />
                <Switch>
                    <Route exact path="/login" render={() => (<>{loggedIn ? <Redirect to='/choose' /> :
                        <LoginComponent userLoginCallback={userLoginCallback} message={message} />}</>)} />
                    <Route path="/officer" render={() => (<>{!loggedIn ? <Redirect to='/' /> :
                        <Officer />}</>)} />
                    <Route path="/counter">
                        <Counter />
                    </Route>
                    <Route path="/manager">
                        <Manager />
                    </Route>
                    <Route path="/choose" render={() => (<>{!loggedIn ? <Redirect to='/' /> :
                        <ChooseCounter />}</>)} />
                    <Route path="/" render={() => (<>{loggedIn ? <Redirect to='/choose' /> :
                        <Client />}</>)} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;
