import { Avatar } from '@material-ui/core';
import React, { useState } from 'react';
import './Post.css';
import dayjs from 'dayjs';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import RepeatIcon from '@material-ui/icons/Repeat';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import PublishIcon from '@material-ui/icons/Publish';

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

function Post(props) {
        
    return (
        <div className='post'>
            <div className='post_avatar'>
                <Avatar src={props.user.avatar} />
            </div>
            <div className='post_body'>
                <div className='post_header'>
                    <div className='post_headerText'>
                        <h3>
                            {props.user.display_name}{''} 
                            <span className='post_headerSpecial'>
                                @{props.user.username}
                            </span>
                            <span> • </span>
                            <span id='timestamp'>{dayjs(props.timestamp).fromNow()}</span>
                        </h3>
                    </div>
                    <div className='post_headerDescription'>
                        <p>{props.text}</p>
                    </div>
                </div>
                {/* <p>***Spotify link Card will go here***</p> */}
                <div className='post_footer'>
                    <ChatBubbleOutlineIcon fontSize='small' />
                    <RepeatIcon fontSize='small' />
                    <FavoriteBorderIcon fontSize='small' />
                    <PublishIcon fontSize='small' />
                </div>
            </div>
        </div>
    )
};

export default Post;