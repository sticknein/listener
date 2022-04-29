import React, { useState } from 'react';
import './EditAccount.css';
import { Button } from '@material-ui/core'
import Cookies from 'js-cookie';

function EditAccount(props) {
    const [avatar, setAvatar] = useState(null);
    const [bio, setBio] = useState('I\'m a bio! Weeeeeee!');
    const [displayName, setDisplayName] = useState(props.user.display_name);
    const [username, setUsername] = useState(props.user.username);

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
        let userObject = {
            avatar: props.user.avatar,
            bio: bio,
            date_joined: props.user.date_joined,
            display_name: displayName,
            email: props.user.email,
            password: '',
            has_account: true,
            last_online: props.user.last_online,
            tokens: props.user.tokens,
            username: username
        };

        if (avatar) { 
            const formData = new FormData();
            formData.append('file', avatar);
            formData.append('email', props.user.email);
            formData.append('username', username);
            e.preventDefault();
            fetch('/upload-avatar', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                return response.json()
            })
            .then(url => {
                userObject.avatar = url;

                const userFetchBody = JSON.stringify(userObject);

                e.preventDefault()
                fetch('/edit-user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: userFetchBody
                })
                .then(() => {
                    console.log(`Edited user @${username}`);
                    localStorage.setItem('user', userFetchBody);
                    Cookies.set('user', userFetchBody);
                    return window.location.assign('/');
                })
                .catch(error => console.log(error));
            })
            .catch(error => console.log(error));
        }
        else {
            const userFetchBody = JSON.stringify(userObject);

            e.preventDefault();
            
            fetch('/edit-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: userFetchBody
            })
            .then(() => {
                console.log(`Edited user @${username}`);
                localStorage.setItem('user', userFetchBody)
                Cookies.set('user', userFetchBody)
                return window.location.assign('/');
            })
            .catch(error => console.log(error));
        }
    };

    return (
        <div className='edit-account'>
            <div className='edit-account-container'>
                <h1>Edit Account</h1>

                <form onSubmit={e => handleClick(e)}>
                    <input  
                        onChange={e => setUsername(e.target.value)}
                        value={username}
                        placeholder={props.user.username}
                        type='text'
                        maxLength='15'
                        className='input'
                    />
                    <p>Please select your username. For example, paulmccartney.</p>

                    <input  
                        onChange={e => setDisplayName(e.target.value)}
                        value={displayName}
                        placeholder={props.user.display_name}
                        type='text'
                        maxLength='50'
                        className='input'
                    />
                    <p>Please select your display name. For example, Paul McCartney.</p>    

                    <textarea  
                        onChange={e => setBio(e.target.value)}
                        value={bio}
                        placeholder={'I\'m a bio! Weeeeeee!'}
                        type='text'
                        maxLength='160'
                        className='bio'
                    />
                    <p>Tell us about yourself. For example, "I am the walrus."</p>   

                    <input
                        onChange={e => {onImageChange(e)}}
                        type='file'
                        id='avatar' name='avatar'
                        accept='.png, .jpg, .jpeg'
                        encType='multipart/form-data'
                    />
                    <p>Upload a profile picture (jpeg or png)</p>
                    <Button 
                    id='login-button' 
                    type='submit'
                    >
                    Confirm
                    </Button>
                </form> 
            </div>          
        </div>
    )
};

export default EditAccount;