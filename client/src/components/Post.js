import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

import './Post.css';
import Comment from './Comment';

import { Avatar, Button } from '@material-ui/core';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import FlipMove from 'react-flip-move';

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

function Post(props) {

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(props.liked_by.length);
    const [commentHidden, setCommentHidden] = useState(true);
    const [commentCount, setCommentCount] = useState(0);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [showDelete, setShowDelete] = useState(false);

    useEffect(() => {
        if (props.liked_by.includes(props.user.email)) {
            setLiked(true)
        };
        if (commentCount === 0) {
            setCommentCount(props.comments)
        };
        document.addEventListener('keydown', e => {
            if (e.keyCode === 27) {
                setCommentHidden(true);
                setComments([]);
            }
        })
    })

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

    const getPostComments = () => {
        fetch('/get-post-comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_id: props.post_id
            })
        })
        .then(response => {
            return response.json();
        })
        .then(post_comments => {
            setCommentCount(post_comments.length);
            return setComments(post_comments);
        })
        .catch(error => console.log(error));
    }

    const showComment = () => {
        if (commentHidden) {
            setCommentHidden(false);
            if (props.comments > 0) {
                getPostComments();
            }
        }
        else {
            setComments([]);
            setCommentHidden(true);
        }
    };

    const sendComment = () => {
        const commentObject = {
            post_id: props.post_id,
            user: props.user,
            text: comment
        }
        console.log(1)
        fetch('/send-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentObject)
        })
            .then(response => {
                return response.json();
            })
            .then(db_comment => {
                let updated_comments = comments.slice();
                updated_comments.unshift(db_comment);
                console.log('commentCount 1', commentCount)
                const incr_count = commentCount + 1;
                setCommentCount(incr_count);
                console.log('commentCount 2', commentCount)
                console.log('incr_count', incr_count)
                setComments(updated_comments);
                setComment('');
            })
            .catch(error => console.log(error));

        setComment('');
    }

    const toggleDeleteButton = () => {
        let visible = showDelete;
        setShowDelete(!visible);
    }

    const deletePost = () => {
        fetch('/delete-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_id: props.post_id
            })
        })
        .then(() => {
            console.log(`Deleted post ${props.post_id}`);
            toggleDeleteButton();
            props.getUserPosts();
        })
        .catch(error => {
            console.log(error);
        })
    }
  
    return (
        <div className='post'>
            <header className='post-header'>
                <Avatar className='post-avatar' src={props.user.avatar} />
                <div className='post-header-text'>
                    <h3 className='post-display-name'>
                        {props.user.display_name}
                    </h3>
                    <h4 className='post-username'>
                        @{props.user.username}
                    </h4>
                    <h4> • </h4>
                    <h5 id='timestamp'>{dayjs(props.timestamp).fromNow()}</h5>
                    <div className='delete'>
                        <MoreHorizIcon 
                            id='post-options'
                            onClick={toggleDeleteButton}
                        />
                    </div>
                </div>
                {showDelete ? 
                        <div id='delete-post'>
                            <Button 
                                className='delete-post-button'
                                onClick={deletePost}
                            >Delete Post</Button>
                        </div> 
                        : null}
            </header>
            <div className='post-text'>
                <p>{props.text}</p>
            </div>
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

                {commentCount > 0 ? 
                    <div classname='comments-count'>
                        {commentCount}
                    </div>
                    : null
                }
                {!commentHidden ? 
                    <div className='comment-box'>
                        <Avatar id='avatar' src={props.user.avatar} />
                        <textarea 
                            autoFocus
                            className='comment-input' 
                            onChange={e => setComment(e.target.value)}
                            placeholder='Comment...' 
                            value={comment}
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
            {comments.length > 0 ? 
                <FlipMove>
                    <div className='comments'>
                        {comments.map(post_comment => (
                            <div className='comment' key={post_comment.comment_id}>
                                <Comment 
                                    comment_id={post_comment.comment_id}
                                    comments={post_comment.comments}
                                    getPostComments={getPostComments}
                                    post_id={post_comment.post_id}
                                    liked_by={post_comment.liked_by}
                                    text={post_comment.text}
                                    timestamp={post_comment.timestamp}
                                    user={post_comment.user}
                                />
                            </div>
                        ))}
                    </div>
                </FlipMove>
                : null}
        </div>
    )
};

export default Post;