import React, { useEffect, useState } from 'react';
import './Feed.css';

import FlipMove from 'react-flip-move';

import PostBox from './PostBox';
import Post from './Post';

function Feed(props) {
    const [posts, setPosts] = useState(null);

    const getUserPosts = () => {
        fetch('/get-user-posts') // get-user-feed -- eventually
            .then(response => response.json())
            .then(posts => setPosts(posts))
            .catch(error => console.log(error));
    }

    useEffect(() => {
        if (!posts) {
            getUserPosts();
        };
    });

    console.log(typeof posts)

    return (
        <div className='feed'>
            <div className='feed-header'>
                <h2>Welcome to listener, {props.user.username}.</h2>  
            </div>
            
            <PostBox user={props.user} getUserPosts={getUserPosts} />

            {!posts && 
                <h3 className='no-posts'>No posts yet!</h3>
            }

            {posts &&
            <FlipMove>
                <div className='posts'>
                    {posts.map(post => (
                        <Post 
                            post_id={post.post_id}
                            liked_by={post.liked_by}
                            link={post.link}
                            text={post.text}
                            timestamp={post.timestamp}
                            user={post.user}
                        /> 

                    ))}   
                </div>
            </FlipMove>
            }   
        </div>
    )
}

export default Feed;
