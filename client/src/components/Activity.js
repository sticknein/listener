import React, { useEffect, useState } from 'react';

import './Activity.css';

function Activity(props) {
    const [nowPlaying, setNowPlaying] = useState(null);

    useEffect(() => {
        fetch('/now-playing')
            .then(response => {
                console.log(response);
            })
            .catch(error => console.log(error));
    })

    return (
        <div className='activity'>
            <h2>Activity</h2>
            <br/>
            <p>NOW PLAYING BREH</p>
            <br/>
        </div>
    )
}

export default Activity;
