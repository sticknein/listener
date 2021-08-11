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

function App(props) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (user === null) {
            fetch('/get-user')
        .then(user => user.json()
        .then(jsonUser => {
            console.log(jsonUser)
            setUser(jsonUser);
        }))
        }
    });

    if (user !== null) {
        return (
            <Router>
                <div className='app'>
                    <Route component={() => <Sidebar user={user} />} />
                    <Switch>
                        <Route exact path='/' component={() => <Feed user={user} test='test'/>} />
                        <Route path='/profile' component={() => <Profile user={user} />} />
                    </Switch>
                    <Route component={() => <Activity user={user} />} />  
                </div>
            </Router>
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