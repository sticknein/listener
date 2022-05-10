import React, { useState, useEffect } from 'react';
import './Profile.css';
import FlipMove from 'react-flip-move';
import Post from './Post';
import { useParams } from 'react-router-dom';
import { Button } from '@material-ui/core';

function Profile(props) {
    const [posts, setPosts] = useState(null);
    const [commentHidden, setCommentHidden] = useState(true);
    const [profileUser, setProfileUser] = useState(props.user);
    const { username } = useParams();

    const getUserPosts = () => {
        fetch('/get-user-posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username
            })
        })
        .then(response => {
            return response.json()
        })
        .then(posts => {
            let all_comments = [];
            posts.forEach(post => {
                if (post.comments > 0) {
                    for (let i = 0; i < post.comments; i++) {
                        all_comments.push(post.comments[i])
                    }
                }
            })
            return setPosts(posts)
        })
        .catch(error => console.log(error));
    };

    const getUserByUsername = input => {
        fetch('/get-user-by-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: input
            })
        })
        .then(response => {
            return response.json();
        })
        .then(db_user => {
            setProfileUser(db_user);
        })
    }

    useEffect(() => {
        getUserByUsername(username)
        if (!posts) {
            getUserPosts();
        }
    }, [])

    return (
        <div className='profile'>
            <div className='profile-header'>
                <div id='prof-pic-row'>
                    <img src={profileUser.avatar} id='prof-pic' alt='Profile picture' />
                </div>
                <div id='name-row'>
                    <h1>{profileUser.display_name}</h1>
                    <h2>@{profileUser.username}</h2>
                    {/* <Button className='edit-profile-button'>Edit Profile</Button> */}
                </div>   
                <p className='bio'>{profileUser.bio}</p>
            </div>

            <hr />

            {posts &&
            <FlipMove>
                <div className='posts'>
                    {posts.map(post => (
                        <div className='post' key={post.post_id}>
                            <Post 
                                active_user={props.user}
                                comments={post.comments}
                                post_id={post.post_id}
                                liked_by={post.liked_by}
                                link={post.link}
                                text={post.text}
                                timestamp={post.timestamp}
                                user={post.user}
                                getUserPosts={getUserPosts}
                            /> 
                            {!commentHidden ? 
                                <div className='comments'>
                                    
                                </div>
                                : null}
                        </div>
                    ))}   
                </div>
            </FlipMove>
            }   
        </div>
    )
}

export default Profile;