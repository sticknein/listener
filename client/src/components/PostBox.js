import React, { useState } from 'react';
import './PostBox.css';
import { Avatar, Button } from '@material-ui/core';

function PostBox(props) {
    const [postText, setPostText] = useState('');
    const [postLink, setPostLink] = useState('');

    const sendPost = e => {
        const postObject = {
            postText: postText,
            postLink: postLink
        }

        fetch('/send-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },  
            body: JSON.stringify(postObject)
        })
        .then(post => {
            props.getUserPosts()
        })
        .catch(error => console.log('Error: ', error));

        setPostText('');
        setPostLink('');
    };

    return (
        <div className='postBox'>
            <form>
                <div className='postBox-input'>
                    <Avatar src={props.user.avatar} />
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