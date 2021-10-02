import React, { useState } from 'react';
import './AccountSetup.css';
import { Button } from '@material-ui/core'

function CreateAccount(props) {
    const [avatar, setAvatar] = useState(null);
    const [bio, setBio] = useState('I\'m a bio! Weeeeeee!');
    const [displayName, setDisplayName] = useState(props.user.display_name);
    const [username, setUsername] = useState(props.user.username);

    const onImageChange = e => {
        const reader = new FileReader();
        let file = e.target.files[0];
        if (file) {
            reader.onload = () => {
                if (reader.readyState === 2) setAvatar(file);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        else setAvatar(null);
    };

    const handleClick = e => {
        if (avatar) {
            const formData = new FormData();
            formData.append('file', avatar);

            fetch('/upload-avatar', {
                method: 'POST',
                body: formData
            })
            .then(response => { // the problem is here
                const url = response.json();
                return url;
            })
            .then(url => {
                let data = {
                    access_token: props.user.access_token,
                    avatar: url,
                    bio: bio,
                    date_joined: new Date(),
                    display_name: displayName,
                    email: props.user.email,
                    last_online: new Date(),
                    username: username
                };
                return data;
            })
            .then(userData => {
                fetch('/create-account', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                })
                .then(user => {
                    
                    props.accountCreated(true);
                    return window.location.assign('/');
                })
            })
            .catch(error => console.log(error));
        }
        else {
            let data = {
                access_token: props.user.access_token,
                avatar: '',
                bio: bio,
                date_joined: new Date(),
                display_name: displayName,
                email: props.user.email,
                last_online: new Date(),
                username: username
            };
        
            fetch('/create-account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(user => {
                props.accountCreated(true);
                return window.location.assign('/');
            })
        }
    };
    

    return (
        <div className='account-setup'>
            <h1>Please Set Up Your Account</h1>

            <form>
                <input  
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                    placeholder={`${props.user.username}`}
                    type='text'
                    maxLength='15'
                    className='input'
                />
                <p>Please select your username. For example, paulmccartney. Choose wisely, as this cannot be changed.</p>

                <input  
                    onChange={e => setDisplayName(e.target.value)}
                    value={displayName}
                    placeholder={props.user.display_name}
                    type='text'
                    maxLength='50'
                    className='input'
                />
                <p>Please select your display name. For example, Paul McCartney. This may be changed.</p>    

                <textarea  
                    onChange={e => setBio(e.target.value)}
                    value={bio}
                    placeholder={'I\'m a bio! Weeeeeee!'}
                    type='text'
                    maxLength='160'
                    className='bio'
                />
                <p>Tell us about yourself. For example, "I am the walrus." This may be changed.</p>   

                <input
                    onChange={e => {onImageChange(e)}}
                    type='file'
                    id='avatar' name='avatar'
                    accept='.png, .jpg, .jpeg'
                    encType='multipart/form-data'
                />
                <p>Upload a profile picture (jpeg or png)</p>
            </form> 

            <Button 
                id='loginButton' 
                onClick={e => {
                    handleClick()
                }}
            >
                Create Account
            </Button>
        </div>
    )
};

export default CreateAccount;