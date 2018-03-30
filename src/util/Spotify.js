const client_id = 'c8e121a8d4b6473fa3430f420882b9c5';
const redirect_uri = 'http://localhost:3000';
const cors_uri = 'https://cors-anywhere.herokuapp.com/';
const token_uri = 'https://accounts.spotify.com/api/token';
const scope = 'user-read-private user-read-email playlist-modify-private';

const authorize_url = 'https://accounts.spotify.com/authorize?client_id='+client_id+'&response_type=token&redirect_uri='+redirect_uri+'&scope='+scope;
const search_uri = 'https://api.spotify.com/v1/search';
const me_uri = 'https://api.spotify.com/v1/me';

//const create_playlist_uri = 'https://api.spotify.com/v1/users/{user_id}/playlists'
let access_token = '';


const Spotify = {

	getAccessToken() {
		

		if (access_token) {
			return access_token;
		}

		let now = Date.now();

		let accessRE = /access_token=([A-Za-z0-9_-]*)/
		let expiresRE = /expires_in=([0-9]*)/
		let current_url = window.location.href;

		let re_result = accessRE.exec(current_url);
		let expires_result = expiresRE.exec(current_url);

		//console.log(current_url);
		//console.log(re_result);
		if (re_result) {
			access_token = re_result[1];
			
			let expiresIn = Number(expires_result[1]);
			
			window.setTimeout(() => access_token = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			
			return access_token;

		} else {
			
			window.location = authorize_url;
		}


	},

	createPlaylist(user_id, playlistName) {
		const create_playlist_uri = `https://api.spotify.com/v1/users/${user_id}/playlists`;

		return fetch(create_playlist_uri, {
			headers: {
					'Authorization': `Bearer ${access_token}`,
					'Content-Type':'application/json'	
					},
			body: JSON.stringify({
				name: playlistName,
				'public': false,
				description: 'Playlist created by Jammming web application.'
				}),
			method: 'POST'
			}
			
		).then(response => {
			return response.json();
		}).then(jsonResponse => {
			return jsonResponse;
		});
		

	},

	addTracksToPlaylist(user_id, playlist_id, tracks) {
		let add_tracks_uri = `https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`;
		return fetch(add_tracks_uri, {
			headers: {
					'Authorization': `Bearer ${access_token}`,
					'Content-Type':'application/json'	
					},
			body: JSON.stringify({
				uris: tracks
				}),
			method: 'POST'
			}
		);
	},


	getUserInfo() {
		access_token = this.getAccessToken();
		if (access_token) {

			return fetch(me_uri, {
				headers: {
					'Authorization': `Bearer ${access_token}`
				},
				method: 'GET'	
			}).then(response => {
				return response.json();
			}).then(jsonResponse => {
				console.log(jsonResponse);
				return jsonResponse;
			});

		}
	},

	search(term, searchBy) {
		let results = [];
		//console.log('SEARCHING!');
		//console.log(access_token);
		if (access_token) {
			return fetch(`${search_uri}?q=${term}&type=${searchBy}`, {
				headers: {
					'Authorization': `Bearer ${access_token}`
				},
				method: 'GET',

			}).then(response => {
				return response.json();
			}).then(jsonResponse => {
				
				if (jsonResponse) {
					//console.log(jsonResponse);
					let tracks = jsonResponse.tracks.items;
					//let albums = jsonResponse.albums.items;
					//let artists = jsonResponse.artists.items;
					
					results = results.concat(tracks.map(item => ({
						id: item.id,
						name: item.name,
						artist: item.artists[0].name,
						album: item.album.name
					})));
					//console.log('SONGS!');
					//console.log(results);
					//let album_tracks = [];

					/*
					for (let index=0;index<albums.length;index++) {
						let album_id = albums[index].id;
						let album_name = albums[index].name;

						this.getTracksFromAlbum(album_id).then(jsonResponse => {
							//console.log(jsonResponse);
							return jsonResponse.items.map(item => {
								//console.log(item);
									return {
										id: item.id,
										name: item.name,
										artist: item.artists[0].name,
										album: album_name
									};
								}

						)}).then(tracks => {
							results = results.concat(tracks);
							return results;
						});	
						console.log('ALBUM');
						console.log(index);
						console.log(results);
					}
					*/

						
				}
				return results;

			});

		}
		
	},

	getTracksFromAlbum(album_id) {
		
		if (access_token) {
			let album_tracks_uri = `https://api.spotify.com/v1/albums/${album_id}/tracks`;

			return fetch(album_tracks_uri, {
				headers: {
					'Authorization': `Bearer ${access_token}`
				},
				method: 'GET',

			}).then(response => {
				return response.json();
			});
		}		
	}


}

export default Spotify;