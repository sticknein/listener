import React, { useState } from 'react';
import './PostBox.css';
import { Avatar, Button } from '@material-ui/core';

function PostBox(props) {
    const [text, setText] = useState('');
    const [link, setLink] = useState('');

    const sendPost = () => {
        if (text !== '') {
            const post = {
            user: props.user,
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
        }
        else {
            window.alert('No empty posts!')
        }
    };
    
    return (
        <div className='postBox'>
            <form>
                <div className='postBox-input'>
                    <Avatar src={props.user.avatar} />
                    <textarea 
                        onChange={e => setText(e.target.value)}
                        placeholder={'What are you listening to?'}
                        type='text'
                        value={text}  
                    />
                </div>
                <Button 
                    className='post-button'
                    onClick={sendPost} 
                    type='submit'
                >Post
                </Button>
            </form>
        </div>
    )
}

export default PostBox;