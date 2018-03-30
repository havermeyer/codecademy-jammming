import React from 'react';
import './TrackList.css';

import Track from '../Track/Track';

class TrackList extends React.Component {


	render() {
		return (
			<div className="TrackList">
			{
      			this.props.trackList.map((track) => {
        			return ( 
        				<Track
        				key={track.id} 
        				track={track} 
        				addEnable={this.props.addEnable} 
        				trackAction={this.props.trackAction} />
        				)
      			})
        	}		
			</div>
			)
	}

}

export default TrackList;
