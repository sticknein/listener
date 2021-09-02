import React, { useState } from 'react';
import './AccountSetup.css';
import { Button } from '@material-ui/core'

function CreateAccount(props) {
    const [avatar, setAvatar] = useState(null)
    const [bio, setBio] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');

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
        let data = {
            bio: bio,
            displayName: displayName,
            username: username
        }

        fetch('/create-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))

        if (avatar === null) return;
        else {
            const formData = new FormData();
            formData.append('file', avatar)

            fetch('/upload-avatar', {
                method: 'POST',
                body: formData
            })
            .then(res => console.log(res))
            .catch(error => console.error(error))
        }
        props.accountCreated(true);
    }

    return (
        <div className='account-setup'>
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
}

export default CreateAccount;