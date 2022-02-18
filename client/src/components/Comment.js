import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import './Comment.css'

import { Avatar, Button } from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

function Comment(props) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(props.liked_by.length)
    const [showDelete, setShowDelete] = useState(false);

    const deleteComment = () => {
        fetch('/delete-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment_id: props.comment_id
            })
        })
        .then(() => {
            console.log(`Deleted comment ${props.comment_id}`)
            toggleDeleteButton();
            // props.comment_count = props.comment_count - 1;

            props.getPostComments();
        })
        .catch(error => {
            console.log(error);
        })
    }

    const likeComment = () => {
        if (!liked) {
            setLikes(likes + 1);
            setLiked(true)

            fetch('/like-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    comment_id: props.comment_id,
                    email: props.user.email
                })
            })
            .catch(error => console.log(error));
        }
        else {
            setLikes(likes - 1);
            setLiked(false);

            fetch('/unlike-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    comment_id: props.comment_id,
                    email: props.user.email
                })
            })
        }
    }

    const toggleDeleteButton = () => {
        let visible = showDelete;
        setShowDelete(!visible);
    }

    return (
        <div className='comment'>
            <header className='comment-header'>
                <Avatar className='comment-avatar' src={props.user.avatar} />
                <div className='comment-header-text'>
                    <h3 className='comment-display-name'>{props.user.display_name}</h3>
                    <h4 className='comment-username'>@{props.user.username}</h4>
                    <h4> • </h4>
                    <h5 id='comment-timestamp'>{dayjs(props.timestamp).fromNow()}</h5>
                    <MoreHorizIcon 
                            id='comment-options'
                            onClick={toggleDeleteButton}
                        />
                </div>
                {showDelete ? 
                            <Button 
                                className='delete-comment-button'
                                onClick={deleteComment}
                            >Delete</Button>
                        : null}
            </header>
            <div className='comment-text'>
                <p>{props.text}</p>
            </div>
            <footer className='comment-footer'>
                {liked ? 
                        <div id='likes'>
                            <FavoriteIcon 
                                id='liked' 
                                fontSize='small' 
                                onClick={likeComment}
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
                                onClick={likeComment}
                            />
                            {likes > 0 ? 
                                <p id='like-count'>{likes}</p>
                                :
                                null}
                        </div>}

                        
            </footer>
        </div>
    )
}

export default Comment;