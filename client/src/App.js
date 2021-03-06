import React, { useState, useEffect } from 'react';
import { 
    BrowserRouter as Router, 
    Switch, 
    Route
} from 'react-router-dom';
import Cookies from 'js-cookie';

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
    const [hasSpotify, setHasSpotify] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [editAccount, setEditAccount] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!user && !Cookies.get('user')) {
            setIsLoading(false);
        }
        else if (Cookies.get('user')) {
            const cookie = Cookies.get('user');
            const backend_user = JSON.parse(cookie);
            setUser(backend_user);
            setIsLoggedIn(true);
            setIsLoading(false);
        }
        else if (Cookies.get('user').has_account === false) {
            const cookie = Cookies.get('user');
            const backend_user = JSON.parse(cookie);
            setUser(backend_user);
            setCreateAccount(true);
            setIsLoggedIn(true);
            setIsLoading(true);
        }
        else if (user) {
            setIsLoggedIn(true);
            setIsLoading(false);
        }
    }, [])

    const emailLogin = () => {
        setHasSpotify(false);
    }

    const cancelEmailLogin = () => {
        setCreateAccount(false);
        setHasSpotify(false);
        setIsLoggedIn(false);
    }

    const setupEmailLogin = () => {
        setHasSpotify(false);
        setCreateAccount(true);
    }

    const spotifyLogin = () => {
        setHasSpotify(true);
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
            Cookies.set('user', JSON.stringify(db_user))
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
                Cookies.remove('user')
                setUser({})
                setIsLoggedIn(false);
                setIsLoading(false); 
                window.location = '/';
            })
            .catch(error => console.log(error));
    }

    const handleEditAccount = () => {
        setEditAccount(true);
    }

    const cancelEditAccount = () => {
        setEditAccount(false);
    }

    if (isLoading) {
        return (
            <div>
                <h1><Loading /></h1>
            </div>
        )
    }
    if (editAccount) {
        return (
            <div className='edit-account'>
                <EditAccount user={user} cancelEditAccount={cancelEditAccount} />
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
                    spotifyLogin={spotifyLogin}
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
                        <Route exact path='/u/:username' component={() => <Profile user={user} handleEditAccount={handleEditAccount} />} />
                    </Switch>
                    <Route component={() => <PlaybackFeed user={user}/>} />  
                </div>
            </Router>
        );
    }
}

export default App;