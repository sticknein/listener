const SpotifyWebApi = require('spotify-web-api-node');

require('dotenv').config({ path: '../.env'})

const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;
const redirect_uri = process.env.REACT_APP_REDIRECT_URI;

const Spotify = new SpotifyWebApi({
    clientId: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    redirectUri: process.env.REACT_APP_REDIRECT_URI
});

const nowPlaying = tokens => {
    Spotify.setAccessToken(tokens.access_token);
    Spotify.setRefreshToken(tokens.refresh_token);
    return Spotify.getMyCurrentPlayingTrack()
                .then(data => {
                    if (data !== {} && data.body.item !==  null) {
                        return data.body.item 
                    }
                    else {
                        Spotify.getMyRecentlyPlayedTracks({limit: 1})
                            .then(recents => {
                                return recents.body.item
                            })
                            .catch(error => console.log(error));
                    }
                })
                .catch(error => console.log(error));
}

module.exports = {
    nowPlaying,
    Spotify
};