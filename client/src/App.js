import React, { useState, useEffect } from 'react';
import { 
    BrowserRouter as Router, 
    Switch, 
    Route
} from 'react-router-dom';

import './App.css';
import EditAccount from './components/EditAccount';
import Feed from './components/Feed';
import Loading from './components/Loading';
import Login from './components/Login';
import Logout from './components/Logout';
import NowPlaying from './components/NowPlaying';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';

function App(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const localStorageUser = localStorage.getItem('user');
        const localStorageObject = JSON.parse(localStorageUser);
        if (!localStorageUser) {
            fetch('/get-user')
                .then(response => { 
                    const data = response.json();
                    return data;
                })
                .then(userObject => {
                    if (userObject !== null) {
                        localStorage.setItem('user', JSON.stringify(userObject));
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
            }
            else {
                fetch('/set-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: localStorageUser
                })
                    .then(() => {
                        setUser(localStorageObject);
                        setIsLoggedIn(true);
                        setIsLoading(false);
                    })
                    .catch(error => console.log(error));


            }
    }, [])

    const logout = () => {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },  
            body: JSON.stringify({})
        })
            .then(() => {
                localStorage.clear();
                setUser({})
                setIsLoggedIn(false);
                setIsLoading(false); 
                window.location = '/';
            })
            .catch(error => console.log(error));
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
            <div className='login'>
                <Login />
            </div>
        )
    }
    if (isLoggedIn && !user.has_account) {
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
                        <Route path='/logout' component={() => <Logout logout={logout} />} />
                    </Switch>
                    <Route component={() => <NowPlaying user={user}/>} />  
                </div>
            </Router>
        );
    }
}

export default App;