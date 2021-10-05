import React, { useState } from 'react';
import './PostBox.css';
import { Avatar, Button } from '@material-ui/core';

function PostBox(props) {
    const [text, setText] = useState('');
    const [link, setLink] = useState('');

    const sendPost = e => {
        const post = {
            text: text,
            link: link
        }

        fetch('/send-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },  
            body: JSON.stringify(post)
        })
        .then(() => {
            props.getUserPosts()
        })
        .catch(error => console.log('Error: ', error));

        setText('');
        setLink('');
    };

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            sendPost();
        }
    };
    
    return (
        <div className='postBox'>
            <form>
                <div className='postBox-input'>
                    <Avatar src={props.user.avatar} />
                    <input 
                        onChange={e => setText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        value={text}
                        placeholder={'What are you listening to?'} 
                        type='text' 
                    />
                </div>
                <input 
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    className='postBox-urlInput' 
                    placeholder='Optional: Enter Spotify URL' 
                    type='text' 
                />
                <Button 
                    className='postBox-postButton'
                    onClick={sendPost} 
                >Post
                </Button>
            </form>
        </div>
    )
}

export default PostBox;