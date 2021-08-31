import React, { useState } from 'react';
import './AccountSetup.css';
import { Button } from '@material-ui/core'
import axios from 'axios';

function CreateAccount(props) {
    const [username, setUsername] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState(null)

    const onImageChange = e => {
        const reader = new FileReader();
        let file = e.target.files[0];
        if (file) {
            reader.onload = () => {
                if (reader.readyState === 2) {
                    console.log(`File: ${file}`);
                    setAvatar(file);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
        else setAvatar(null);
    };

    const handleClick = e => {
        axios.post('/create-account')
            .then(console.log('Account created!'))
            .catch(error => console.log(error));
        if (avatar === null) return;
        else {
            // Something's wrong in here, attach image data to axios.post. Empty object rn
            const formData = new FormData();
            formData.append(
                'avatar',
                avatar,
                avatar.name
            )
            axios.post('/upload-avatar', formData)
                .then(console.log('Avatar uploaded!'))
                .catch(error => console.log(error)); 
        } 
    }

    return (
        <div className='create-account'>
            <h1>Please Set Up Your Account</h1>

            <form>
                <input  
                    onChange={e => setUsername(e.target.value)}
                    value={username}
                    placeholder={`@${props.user.username}`}
                    type='text'
                    maxLength='15'
                    className='input'
                />
                <p>Please select your username. For example, @paulmccartney. Choose wisely, as this cannot be changed.</p>

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
                <p>Tell us about yourself. For example, "I am the walrus". This may be changed.</p>   

                <input
                    onChange={e => {onImageChange(e)}}
                    type='file'
                    id='avatar' name='avatar'
                    accept='image/png, image/jpeg'
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
}

export default CreateAccount;