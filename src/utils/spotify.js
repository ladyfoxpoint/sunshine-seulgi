import SpotifyWebApi from "spotify-web-api-node";
import keys from '../data/keys.json' assert { type: "json" }
import Logger from './logger.js';
const logger = new Logger('spotify', '7af551', 'utils')

// Make a "query" object, with "type", "name", "songs"
// Make embed:tm:

export class Spotify {
    constructor() {
        this.api = new SpotifyWebApi({
            clientId: keys.spotify.id,
            clientSecret: keys.spotify.secret,
        })
    }

    async refreshToken() {
        let data = await this.api.clientCredentialsGrant()
        this.api.setAccessToken(data.body['access_token'])
    }

    async getAlbumArtist(id) {
        await this.refreshToken();
        return (await this.api.getArtistAlbums(id)).body['items'];
    }

    async getAlbum(id) {
        await this.refreshToken();
        return (await this.api.getAlbum(id)).body;
    }

    async getPlaylist(id) {
        await this.refreshToken();
        return (await this.api.getPlaylist(id)).body;
    }

    async getTrack(id) {
        await this.refreshToken();
        return (await this.api.getTrack(id)).body;
    }

    async parseQuery(query) {
        let id = query.replace(/https:\/\/open\.spotify\.com\/[A-Za-z]+\//i, "").replace(/\?si=.*[A-Za-z0-9]+/i, "");
        let result = {};
        let type = "";
        let name = "";
        let url = "";
        let thumbnail = "";
        let tracks = [];

        // Detect type and get info:
        switch(true) {
            case query.includes('album'):
                type = 'album';
                result = await this.getAlbum(id);
                name = result['name'];
                url = result['external_urls']['spotify']
                thumbnail = result['images'][0]['url']
                
                for (let track of result['tracks']['items']) {
                    tracks.push({
                        "name": track['name'],
                        "duration": ((track) => {
                            let date = new Date(track['duration_ms']);
                            return `${(date.getMinutes().toString()).padStart(2, '0')}:${(date.getSeconds().toString()).padStart(2, '0')}`
                        })(track)
                    })
                }
                break;
            
            case query.includes('playlist'):
                type = 'playlist';
                result = await this.getPlaylist(id);
                name = result['name'];
                url = result['external_urls']['spotify']
                thumbnail = result['images'][0]['url']

                for (let track of result['tracks']['items']) {
                    tracks.push({
                        "name": track['track']['name'],
                        "duration": ((track) => {
                            let date = new Date(track['track']['duration_ms']);
                            return `${(date.getMinutes().toString()).padStart(2, '0')}:${(date.getSeconds().toString()).padStart(2, '0')}`
                        })(track)
                    })
                }
                break;
            
            case query.includes('track'):
                type = 'track';
                result = await this.getTrack(id);
                name = result['name'];
                url = result['external_urls']['spotify']
                thumbnail = result['album']['images'][0]['url']

                tracks.push({
                    "artist": ((result) => {
                        let artists = ""
                        for (let [x, artist] of result['artists'].entries()) {
                            if (x == result['artists'].length - 1) {
                                artists = artists + `${artist['name']}`
                                return artists;
                            }
                            artists = artists + `${artist['name']}, `
                        }
                        return artists;
                    })(result),
                    "release": result['album']['release_date'],
                    "duration": ( (result) => {
                        let date = new Date(result['duration_ms']);
                        return `${(date.getMinutes().toString()).padStart(2, '0')}:${(date.getSeconds().toString()).padStart(2, '0')}`
                    })(result),
                })
                break;
            
            default:
                logger.warn(`something went wrong while parsing the spotify link! ${logger.bold('(case_default)')}`)
                break;
        }

        return {
            "type": type,
            "name": name,
            "tracks": tracks,
            "url": url,
            "thumbnail": thumbnail
        };

    }
}