import React, { useState, useEffect } from 'react';
import { 
    BrowserRouter as Router, 
    Switch, 
    Route
} from 'react-router-dom';

import './App.css';
import Activity from './components/Activity';
import AccountSetup from './components/AccountSetup';
import Feed from './components/Feed';
import Loading from './components/Loading';
import Login from './components/Login';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';

function App(props) {
    const [hasAccount, setHasAccount] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
            console.log(1);
            fetch('/get-user')
                .then(response => {
                    console.log(2);
                    const data = response.json();
                    return data;
                })
                .then(json => {
                    console.log(3);
                    console.log(json);
                    if (json !== null) {
                        console.log(4);
                        setUser(json);
                        fetch('/check-user')
                            .then(exists => {
                                console.log(5)
                                const x = exists.json();
                                console.log(x)
                                return x;
                            })
                            .then(ex => {
                                console.log(6)
                                console.log(ex)
                                if (ex) {
                                    console.log(7)
                                    setHasAccount(true);
                                    setIsLoggedIn(true);
                                    setIsLoading(false);
                                }
                                else {
                                    console.log(8)
                                    setHasAccount(false);
                                    setIsLoggedIn(true);
                                    setIsLoading(false);
                                }
                            })
                    }
                    else {
                        console.log(9);
                        setHasAccount(false);
                        setIsLoggedIn(false);
                        setIsLoading(false);
                    }
                })
                .catch(error => console.log(error))
    }, [])

    const accountCreated = input => {
        if (input === true) {
            setHasAccount(true);
            // window.location.assign('/');
        }
        else setHasAccount(false);
    }

    if (isLoading) {
        return (
            <div>
                <h1><Loading /></h1>
            </div>
        )
    }

    if (!isLoggedIn) {
        return (
            <div className='app'>
                <Login />
            </div>
        )
    }
    else if (isLoggedIn && !hasAccount) {
        return (
            <div className='app'>
                <AccountSetup user={user} accountCreated={accountCreated} />
            </div>
        )
    }
    else if (isLoggedIn && hasAccount) {
        return (
            <Router>
                <div className='app'>
                    <Route component={() => <Sidebar user={user} />} />
                    <Switch>
                        <Route exact path='/' component={() => <Feed user={user} />} />
                        <Route path='/profile' component={() => <Profile user={user} />} />
                    </Switch>
                    <Route component={() => <Activity />} />  
                </div>
            </Router>
        );
    }
}

export default App;