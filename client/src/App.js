import React, { useState, useEffect } from 'react';
import { 
    BrowserRouter as Router, 
    Switch, 
    Route
} from 'react-router-dom';

import './App.css';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Activity from './components/Activity';
import Profile from './components/Profile';
import Login from './components/Login';
import AccountSetup from './components/AccountSetup';

function App(props) {
    const [user, setUser] = useState(null);
    const [hasAccount, setHasAccount] = useState(false)

    useEffect(() => {
        if (user === null) {
            fetch('/get-user')
                .then(user => user.json()
                .then(jsonUser => {
                    setUser(jsonUser)
                    fetch('check-user')
                        .then(response => response.json()) 
                        .then(json => {
                            if (json === true) setHasAccount(true);
                            else setHasAccount(false);
                        })
                        .catch(error => console.log(error));
            }))
        } 
    });

    const accountCreated = input => {
        if (input === true) setHasAccount(true);
        else setHasAccount(false);
    }

    if (user && hasAccount) {
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
        )
    } else if (user && !hasAccount) {
        return (
            <div className='app'>
                <AccountSetup user={user} accountCreated={accountCreated}/>
            </div>
        )
    } else {
        return (
            <div className='app'>
                <Login />
            </div>
        )
    }
}

export default App;