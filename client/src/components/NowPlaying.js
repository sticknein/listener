import React, { useEffect, useState } from 'react';

import './NowPlaying.css';

import { Avatar } from '@material-ui/core';

function NowPlaying(props) {
    const empty = {
        album: {
            name: '', 
            external_urls: {spotify: ''},
            images: [{url: ''}]
        }, 
        artists: [{name: '', external_urls: {spotify: ''}}], 
        external_urls: {spotify: ''},
        name: '', external_urls: {spotify: ''}
    }

    const [nowPlaying, setNowPlaying] = useState(empty);

    useEffect(() => {
        fetch('/now-playing')
            .then(response => {
                return response.json()
            })
            .then(playback => {
                setNowPlaying(playback)
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <div className='now-playing'>
            <h2>Now Playing</h2>
            <br/>
                <div className='user-now-playing' >
                    <div className='now-playing-header'>
                        <Avatar className='now-playing-avatar' src={props.user.avatar}/>
                        <p className='now-playing-username'>@{props.user.username}</p>
                    </div>
                    <div className='user-track' >
                        <a className='now-playing-track' href={nowPlaying.external_urls.spotify} target='_blank' >{nowPlaying.name}</a>
                        <p>by</p>
                        <a className='now-playing-artist' href={nowPlaying.artists[0].external_urls.spotify} target='_blank' >{nowPlaying.artists[0].name}</a>
                        <p>from</p>
                        <a className='now-playing-album' href={nowPlaying.album.external_urls.spotify} target='_blank' >{nowPlaying.album.name}</a>
                    </div>
                </div>
            <br/>
        </div>
    )
}

export default NowPlaying;
