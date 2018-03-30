import React from 'react';
import './SearchBar.css';


class SearchBar extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			term: '',
		}

		this.handleSearch = this.handleSearch.bind(this);
		this.handleTermChange = this.handleTermChange.bind(this);
	}

	handleSearch(event) {
      //console.log(event);
      this.props.searchSpotify(this.state.term, 'track,album,artist');
      event.preventDefault();

    }

    handleTermChange(event) {
    	this.setState({
    		term: event.target.value
    	});
    }

	render() {
		return (
			<div className="SearchBar">
          		<input  onChange={this.handleTermChange} placeholder="Enter A Song Title" />
          		<a onClick={this.handleSearch} >SEARCH</a>
        	</div>
			)

	}
}

export default SearchBar;