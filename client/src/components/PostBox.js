import React, { useState } from 'react';
import './PostBox.css';
import { Avatar, Button } from '@material-ui/core';
import axios from 'axios';

function PostBox(props) {
    const [postText, setPostText] = useState('');
    const [postLink, setPostLink] = useState('');

    const sendPost = e => {
        e.preventDefault();

        const postObject = {
            user: props.user,
            postText: postText,
            postLink: postLink
        }

        axios.post('/post', postObject)
            .then(res => {
                console.log('Post successfully added!')
            })
            .catch(error => {
                console.log(error);
            });

        setPostText('');
        setPostLink('');
    }

    return (
        <div className='postBox'>
            <form>
                <div className='postBox-input'>
                    <Avatar src={props.user.prof_pic} />
                    <input 
                        onChange={e => setPostText(e.target.value)}
                        value={postText}
                        placeholder={'What are you listening to?'} 
                        type='text' 
                    />
                </div>
                <input 
                    value={postLink}
                    onChange={e => setPostLink(e.target.value)}
                    className='postBox-urlInput' 
                    placeholder='Optional: Enter Spotify URL' 
                    type='text' 
                />
                <Button onClick={sendPost} className='postBox-postButton'>Post</Button>
            </form>
        </div>
    )
}

export default PostBox;