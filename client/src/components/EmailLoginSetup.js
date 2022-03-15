import React, { useState } from 'react';
import { Button } from '@material-ui/core';

import './EmailLoginSetup.css';

function EmailLoginSetup(props) {
    const [avatar, setAvatar] = useState(null);
    const [bio, setBio] = useState('I\'m a bio! Weeeeeee!');
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [username, setUsername] = useState('');

    const onImageChange = e => {
        const reader = new FileReader();
        let file = e.target.files[0];
        if (file) {
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatar(file);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        else setAvatar(null);
    };

    const handleClick = e => {
        let user = {
            avatar: '',
            bio: bio,
            date_joined: new Date().toString(),
            display_name: displayName,
            email: email,
            password: password,
            has_account: true,
            last_online: new Date().toString(),
            tokens: {},
            username: username
        };

        if (password === passwordConfirmation) {
            if (avatar) {
                const formData = new FormData();
                formData.append('file', avatar);

                const user_payload = JSON.stringify(user);
                e.preventDefault();
                return fetch('/create-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: user_payload
                })
                .then(() => {
                    return fetch('/upload-avatar', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        return response.json()
                    })
                    .then(url => {
                        user.avatar = url;

                        const user_with_avatar = JSON.stringify(user);
                        e.preventDefault();

                        return fetch('/edit-user', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: user_with_avatar
                        })
                        .then(() => {
                            console.log('User created!');
                            localStorage.setItem('user', user_with_avatar);
                            window.location.assign('/');
                        })
                        .catch(error => console.log(error));
                    })
                    .catch(error => console.log(error));
                })
            }
            else {
                const user_payload = JSON.stringify(user);
                e.preventDefault();
                return fetch('create-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: user_payload
                })
                .then(() => {
                    console.log('User created!');
                    localStorage.setItem('user', user_payload);
                    window.location.assign('/');
                })
                .catch(error => console.log(error));
            }
        }
        else {
            e.preventDefault();

            window.alert('Ruh roh! The passwords don\'t match!');
        }
    }

    const cancelEmailLogin = () => {
        props.cancelEmailLogin();
    }

    return (
        <div className='email-password-setup'>
            <div className='email-password-container'>
                <div className='email-form'>
                    <h1>Create Account</h1>

                    <form 
                        onSubmit={e => handleClick(e)}
                    >
                        <input 
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            placeholder='email'
                            type='text'
                            maxLength='320'
                            className='input'
                        />
                        <br />
                        <br />
                        <input 
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            placeholder='password'
                            type='password'
                            maxLength='64'
                            className='input'
                        />
                        <br />
                        <br />
                        <input 
                            onChange={e => setPasswordConfirmation(e.target.value)}
                            value={passwordConfirmation}
                            placeholder='Confirm Password'
                            type='password'
                            maxLength='64'
                            className='input'
                        />
                        <br />
                        <br />
                        <input  
                            onChange={e => setUsername(e.target.value)}
                            value={username}
                            placeholder='username'
                            type='text'
                            maxLength='15'
                            className='input'
                        />
                        <br />
                        <br />
                        <input  
                            onChange={e => setDisplayName(e.target.value)}
                            value={displayName}
                            type='text'
                            placeholder='Your Name'
                            maxLength='50'
                            className='input'
                        />
                        <br />
                        <br />
                        <textarea  
                            onChange={e => setBio(e.target.value)}
                            value={bio}
                            placeholder={'I\'m a bio! Weeeeeee!'}
                            type='text'
                            maxLength='160'
                            className='bio'
                        />
                        <br />
                        <br />
                        <input
                            onChange={e => {onImageChange(e)}}
                            type='file'
                            id='avatar' name='avatar'
                            accept='.png, .jpg, .jpeg'
                            encType='multipart/form-data'
                        />
                        <p>Upload a profile picture (jpeg or png)</p>
                        <Button 
                        id='email-login-cancel-button' 
                        onClick={cancelEmailLogin}
                        >
                        Cancel
                        </Button>
                        <Button 
                        id='email-login-button' 
                        type='submit'
                        >
                        Create Account
                        </Button>
                    </form> 
                </div>
            </div>
        </div>
    )
}

export default EmailLoginSetup;