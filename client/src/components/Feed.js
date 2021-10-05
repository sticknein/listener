import React, { useEffect, useState } from 'react';
import './Feed.css';
import PostBox from './PostBox';
import Post from './Post';
import FlipMove from 'react-flip-move';

function Feed(props) {
    const [posts, setPosts] = useState(null);

    useEffect(() => {
        if (!posts) {
            fetch('/get-user-posts')
                .then(response => response.json())
                .then(posts => setPosts(posts))
                .catch(error => console.log(error));
        };
    });

    const getUserPosts = post => {
        fetch('/get-user-posts')
            .then(response => response.json())
            .then(posts => setPosts(posts))
            .catch(error => console.log(error));
    }

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
                {posts.sort((x, y) => {
                    return x.timestamp - y.timestamp
                }).map(post => (
                    <Post  
                        link={post.link}
                        text={post.text}
                        timestamp={post.timestamp}
                        user={props.user}
                    /> 
                ))}    
            </FlipMove>
            }   
        </div>
    )
}

export default Feed;
