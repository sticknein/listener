import React, { useState, useEffect } from 'react';
import { 
    BrowserRouter as Router, 
    Switch, 
    Route
} from 'react-router-dom';

import './App.css';
import Activity from './components/Activity';
import EditAccount from './components/EditAccount';
import Feed from './components/Feed';
import Loading from './components/Loading';
import Login from './components/Login';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';

function App(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('/get-user')
            .then(response => { 
                const data = response.json();
                return data;
            })
            .then(userObject => {
                if (userObject !== null) {
                    setUser(userObject);
                    setIsLoggedIn(true);
                    setIsLoading(false);
                }
                else {
                    setIsLoggedIn(false);
                    setIsLoading(false);
                }
            })
            .catch(error => console.log(error));
    }, [])

    if (isLoading) {
        return (
            <div>
                <h1><Loading /></h1>
            </div>
        )
    }

    if (!isLoggedIn) {
        return (
            <div className='login'>
                <Login />
            </div>
        )
    }
    else if (isLoggedIn && !user.has_account) {
        return (
            <div className='setup'>
                <EditAccount user={user} />
            </div>
        )
    }
    else {
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