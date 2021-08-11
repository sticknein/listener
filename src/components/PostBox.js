import React, { useState } from 'react';
import './PostBox.css';
import { Avatar, Button } from '@material-ui/core';
// import db from '../../server/firebase';

function PostBox(props) {
    const [postMessage, setPostMessage] = useState('');
    const [postLink, setPostLink] = useState('');
    const sendPost = e => {
        e.preventDefault();

        // db.collection('posts').add({
        //     displayName: 'Holophone', //HARD CODED
        //     username: 'holophone', //HARD CODED
        //     artist: true, //HARD CODED
        //     text: postMessage, //HARD CODED
        //     link: postLink, //HARD CODED
        //     avatar: 'https://www.dropbox.com/s/v9sn8tvtn5125fz/eyelogoFINAL.png?raw=1', //HARD CODED
        //     timestamp: new Date().toString()
        // })

        setPostMessage('');
        setPostLink('');
    }

    return (
        <div className='postBox'>
            <form>
                <div className='postBox_input'>
                    <Avatar src='https://www.dropbox.com/s/v9sn8tvtn5125fz/eyelogoFINAL.png?raw=1' /> {/* HARD CODED */}
                    <input 
                        onChange={e => setPostMessage(e.target.value)}
                        value={postMessage}
                        placeholder={'What\'s crackin\'?'} 
                        type='text' 
                    />
                </div>
                <input 
                    value={postLink}
                    onChange={e => setPostLink(e.target.value)}
                    className='postBox_urlInput' 
                    placeholder='Optional: Enter Spotify URL' 
                    type='text' 
                />
                <Button onClick={sendPost} className='postBox_postButton'>Post</Button>
            </form>
        </div>
    )
}

export default PostBox;