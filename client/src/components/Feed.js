import React, { useEffect, useState } from 'react';
import './Feed.css';

import FlipMove from 'react-flip-move';

import PostBox from './PostBox';
import Post from './Post';

function Feed(props) {
    const [posts, setPosts] = useState(null);

    const getUserPosts = () => {
        fetch('/get-user-posts')
            .then(response => response.json())
            .then(posts => setPosts(posts))
            .catch(error => console.log(error));
    }

    useEffect(() => {
        if (!posts) {
            getUserPosts();
        };
    });

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
                            id={post.id}
                            liked={post.liked}
                            likes={post.likes}
                            link={post.link}
                            text={post.text}
                            timestamp={post.timestamp}
                            user={props.user}
                        /> 

                    ))}   
                </div>
            </FlipMove>
            }   
        </div>
    )
}

export default Feed;
