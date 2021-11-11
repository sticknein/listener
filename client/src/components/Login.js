import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import HearingIcon from '@material-ui/icons/Hearing';
import './Login.css';

function Login(props) {
    const handleClick = e => {
        fetch('/authorize')
            .then(res => res.json())
            .then(url => {
                window.location.assign(url);
            })
            .catch(error => console.log(error))
    };

    return (
        <div id='login'>
            <div id='loginContainer'>
                <h1>Welcome to listener</h1>
                <h2>Please login using your Spotify account</h2>
                <Button id='loginButton' onClick={e => handleClick()}>Login</Button>
            </div>
        </div>
    )
}

export default Login;