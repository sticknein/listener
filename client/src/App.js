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
import PlaybackFeed from './components/PlaybackFeed';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';
import EmailLoginSetup from './components/EmailLoginSetup';
import EmailLogin from './components/EmailLogin';

function App(props) {
    const [createAccount, setCreateAccount] = useState(false);
    const [hasSpotify, setHasSpotify] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const localStorageUser = localStorage.getItem('user');
        const localStorageObject = JSON.parse(localStorageUser);
        if (!user && !localStorageUser) {
            fetch('/check-user')
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
            else if (!user && localStorageUser) {
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

    const emailLogin = () => {
        setHasSpotify(false);
    }

    const cancelEmailLogin = () => {
        setCreateAccount(false);
        setHasSpotify(true);
        setIsLoggedIn(false);
    }

    const setupEmailLogin = () => {
        setHasSpotify(false);
        setCreateAccount(true);
    }

    const loginUser = email => {
        return fetch('/get-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        })
        .then(response => {
            return response.json();
        })
        .then(db_user => {
            localStorage.setItem('user', JSON.stringify(db_user));
            setUser(db_user);
            setIsLoggedIn(true);
        })
    }

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
    if (!isLoggedIn && hasSpotify) {
        return (
            <div className='login'>
                <Login emailLogin={emailLogin} />
            </div>
        )
    }
    if (!isLoggedIn && !hasSpotify && !createAccount) {
        return (
            <div className='email-login'>
                <EmailLogin 
                    cancelEmailLogin={cancelEmailLogin} 
                    setupEmailLogin={setupEmailLogin}
                    loginUser={loginUser}
                />
            </div>
        )
    }
    if (!isLoggedIn && !hasSpotify && createAccount) {
        return (
            <div className='setup-email-password-account'>
                <EmailLoginSetup 
                    cancelEmailLogin={cancelEmailLogin}
                />    
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
                        <Route path='/logout' component={() => <Logout logout={logout} />} />
                        <Route exact path='/u/:username' component={() => <Profile user={user} />} />
                    </Switch>
                    <Route component={() => <PlaybackFeed user={user}/>} />  
                </div>
            </Router>
        );
    }
}

export default App;