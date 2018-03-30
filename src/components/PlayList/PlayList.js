import React from 'react';
import './PlayList.css';

import TrackList from '../TrackList/TrackList';

class PlayList extends React.Component {

	constructor(props) {
		super(props);

		this.handlePlaylistNameChange = this.handlePlaylistNameChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	handlePlaylistNameChange(event) {
		this.props.editPlaylistName(event.target.value);
	}

	handleSave(event) {
		this.props.savePlaylist();
		event.preventDefault();
	}

	render() {
		return (
			
			<div className="Playlist">
				<input onChange={this.handlePlaylistNameChange} value={this.props.playListName} />
				<TrackList trackList={this.props.trackList} trackAction={this.props.trackAction}/>
				<a className="Playlist-save" onClick={this.handleSave}>SAVE TO SPOTIFY</a>
			</div>
			
			
			)
	}
}

export default PlayList;