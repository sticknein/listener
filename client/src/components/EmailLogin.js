import { Email } from '@material-ui/icons';
import React, { useState } from 'react';
import { Button } from '@material-ui/core';

import './EmailLogin.css';

function EmailLogin(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const cancelEmailLogin = () => {
        props.cancelEmailLogin();
    }

    const setupEmailLogin = () => {
        props.setupEmailLogin();
    }

    const handleClick = e => {
        const credentials = JSON.stringify({
            email: email,
            password: password
        })

        return fetch('/email-password-login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: credentials
        })
        .then(response => {
            return response.json();
        })
        .then(authorized => {
            if (authorized === true) {
                props.loginUser(email);
            }
            else {
                window.alert('Password incorrect')
            }
        })
    }

    return (
        <div className='email-password-login'>
            <div className='email-login-container'>
                <h1>Login</h1>

                <form onSubmit={e => handleClick(e)}>
                    <input 
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        placeholder='Email'
                        type='text'
                        maxLength={320}
                        className='input'
                    />
                    <br />
                    <br />
                    <input 
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        placeholder='Password'
                        type='password'
                        maxLength={64}
                        className='input'
                    />
                    <div className='button-box'>
                        <Button
                            id='email-login-cancel-button'   
                            onClick={cancelEmailLogin} 
                        >Cancel</Button>
                        <Button
                            id='email-login-button'
                            onClick={handleClick}
                        >Login</Button>
                    </div>
                    <p>Don't have an account?</p>
                    <Button
                        id='email-password-setup-button'
                        onClick={setupEmailLogin}
                    >Click Here</Button>
                </form>
            </div>
        </div>
    )
};

export default EmailLogin;