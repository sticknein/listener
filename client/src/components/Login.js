import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import HearingIcon from '@material-ui/icons/Hearing';
import './Login.css';

function Login(props) {
    const loginClick = e => {
        fetch('/authorize')
            .then(res => res.json())
            .then(url => {
                window.location.assign(url);
            })
            .catch(error => console.log(error))
    };

    return (
        <div id='login'>
            <div id='login-container'>
                <div className='login-sub-container'>
                    <h1>Welcome to listener</h1>
                    <h2>Please login using your Spotify account</h2>
                    <Button id='login-button' onClick={e => loginClick()}>Login</Button>
                    <div className='email-login'>
                        <p>Don't have a Spotify account?  </p>
                        <Button id='email-password-login-button' onClick={e => props.emailLogin()}>Login Here</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;