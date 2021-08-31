import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import HearingIcon from '@material-ui/icons/Hearing';
import './Login.css';

function Login() {
    const handleLoginClick = e => {
        fetch('/authorize')
            .then(res => res.json())
            .then(json => window.location.assign(json))
            .catch(error => console.log(error))
    };

    return (
        <div id='login'>
            <div id='loginContainer'>
                <h1>Welcome to listener</h1>
                <h2>Please login using your Spotify account</h2>
                <Button id='loginButton' onClick={e => handleLoginClick()}>Login</Button>
            </div>
        </div>
    )
}

export default Login;