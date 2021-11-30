import React, { useState } from 'react';
import './EditAccount.css';
import { Button } from '@material-ui/core'

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
        let userObject = {};
        console.log(1)
        userObject.access_token = props.user.access_token;
        userObject.avatar = props.user.avatar;
        userObject.bio = bio;
        userObject.date_joined = props.user.date_joined;
        userObject.display_name = displayName;
        userObject.email = props.user.email;
        userObject.has_account = true;
        userObject.last_online = props.user.last_online;
        userObject.username = username;
        
        console.log(2)

        // const editUser = () => {
        //     console.log('EditAccount.js editUser function triggered')
        //     fetch('/edit-user', {
        //         method: 'POST',
        //         body: user
        //     })
        //     .then(() => {
        //         console.log(`Edited user @${username}`);
        //     })
        //     .catch(error => console.log(error));
        // }

        if (avatar) { 
            console.log(4)
            const formData = new FormData();
            formData.append('file', avatar);
            console.log(5)
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
                body: userObject
            })
            .then(() => {
                console.log(`Edited user @${username}`);
                return window.location.assign('/');
            })
            .catch(error => console.log(error));
        }
    };

    return (
        <div className='edit-account'>
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
                id='loginButton' 
                type='submit'
                >
                Create Account
                </Button>
            </form> 
        </div>
    )
};

export default EditAccount;