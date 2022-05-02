import React, { useEffect, useState } from 'react';
import './Feed.css';

import FlipMove from 'react-flip-move';

import PostBox from './PostBox';
import Post from './Post';

function Feed(props) {
    const [posts, setPosts] = useState(null);
    const [commentsHidden, setCommentsHidden] = useState(true);
    const [comments, setComments] = useState(null);

    const getPostComments = post_id => {
        fetch('http://localhost:5000/get-post-comments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: post_id
            })
        })
        .then(response => {
            response.json()
        })
        .then(comments => {
            let placeholder_posts = posts;
            const post = placeholder_posts.find(post => post.post_id === post_id);
            const post_index = placeholder_posts.findIndex(post => post.post_id === post_id);
            post.comments = comments;
            placeholder_posts[post_index] = post;
            setPosts(placeholder_posts);
        });
    };

    const getPosts = () => {
        fetch('https://sticknein-listener.herokuapp.com/get-posts')
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

    useEffect(() => {
        if (!posts) {
            getPosts();
        };
    });

    return (
        <div className='feed'>
            <div className='feed-header'>
                <h2>Welcome to listener, {props.user.display_name}.</h2>  
            </div>
            
            <PostBox user={props.user} getPosts={getPosts} />

            {!posts && 
                <h3 className='no-posts'>No posts yet!</h3>
            }

            {posts &&
            <FlipMove>
                <div className='posts'>
                    {posts.map(post => (
                        <div className='post' key={post.post_id}>
                            <Post 
                                active_user={props.user}
                                comments={post.comments}
                                post_id={post.post_id}
                                getPosts={getPosts}
                                liked_by={post.liked_by}
                                link={post.link}
                                text={post.text}
                                timestamp={post.timestamp}
                                user={post.user}
                            /> 
                        </div>
                    ))}   
                </div>
            </FlipMove>
            }   
        </div>
    )
}

export default Feed;
