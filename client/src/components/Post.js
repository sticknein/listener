import React, { useState } from 'react';
import dayjs from 'dayjs';

import './Post.css';

import { Avatar, Button } from '@material-ui/core';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

function Post(props) {

    const [liked, setLiked] = useState(props.liked);
    const [likes, setLikes] = useState(props.likes);
    const [commentHidden, setCommentHidden] = useState(true);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    console.log('props.post_id', props.post_id)

    const likePost = () => {
        if (!liked) {
            setLikes(likes + 1);
            setLiked(true)

            fetch('/like-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post_id: props.post_id,
                    email: props.user.email
                })
            })
            .catch(error => console.log(error));
        }
        else {
            setLikes(likes - 1);
            setLiked(false);

            fetch('/unlike-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    post_id: props.post_id,
                    email: props.user.email
                })
            })
        }
    }

    const showComment = () => {
        let visible = commentHidden;
        setCommentHidden(!visible);
    }

    const sendComment = () => {
        const commentObject = {
            post_id: props.post_id,
            username: props.user.username,
            text: comment
        }

        fetch('/send-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentObject)
        })
        .then(() => {
            props.getPostComments()
                .then(response => {
                    console.log('response', response);
                    setComments(response);
                })
        })
        .catch(error => console.log(error));

        setComment('');
    }
  
    return (
        <div className='post'>
            <div className='post-avatar'>
                <Avatar src={props.user.avatar} />
            </div>
            <div className='post-body'>
                <div className='post-main'>
                    <div className='post-text'>
                        <h3>
                            {props.user.display_name}
                            <span className='post-username'>
                                @{props.user.username}
                            </span>
                            <span> • </span>
                            <span id='timestamp'>{dayjs(props.timestamp).fromNow()}</span>
                        </h3>
                    </div>
                    <div className='post-text'>
                        <p>{props.text}</p>
                    </div>
                </div>
                {/* <p> *** Spotify link Card will go here *** </p> */}
                <div className='post-footer'>
                    {liked ? 
                        <div id='likes'>
                            <FavoriteIcon 
                                id='liked' 
                                fontSize='small' 
                                onClick={likePost}
                            /> 
                            {likes > 0 ? 
                                <p id='like-count'>{likes}</p>
                                :
                                null}
                        </div>
                        : 
                        <div id='likes'>
                            <FavoriteBorderIcon 
                                id='like' 
                                fontSize='small' 
                                onClick={likePost}
                            />
                            {likes > 0 ? 
                                <p id='like-count'>{likes}</p>
                                :
                                null}
                        </div>}
                    
                    <ChatBubbleOutlineIcon 
                        id='comment-icon'
                        fontSize='small' 
                        onClick={showComment}
                    />
                    {!commentHidden ? 
                        <div className='comment'>
                            <Avatar id='avatar' src={props.user.avatar} />
                            <textarea 
                                autoFocus
                                className='comment-input' 
                                onChange={e => setComment(e.target.value)}
                                placeholder='Comment...' 
                            />
                            <Button 
                                className='comment-button'
                                onClick={sendComment}
                                type='submit'
                            >
                                Comment
                            </Button>
                        </div>
                    : null}
                </div>
            </div>
        </div>
    )
};

export default Post;