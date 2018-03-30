import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResult from '../SearchResult/SearchResult';
import PlayList from '../PlayList/PlayList';

import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResult:[],
      playList:[],
      playListName:'New Playlist'
    };
    

    this.editPlaylistName = this.editPlaylistName.bind(this);
    this.searchSpotify = this.searchSpotify.bind(this);
    this.addTrackToPlaylist = this.addTrackToPlaylist.bind(this);
    this.removeTrackFromPlaylist = this.removeTrackFromPlaylist.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  editPlaylistName(playListName) {
    this.setState({playListName:playListName});
  }

  addTrackToPlaylist(track) {
    
   
    for (let index=0;index<this.state.playList.length;index++) {
      if (this.state.playList[index].id === track.id) {
        alert('Track already exists!');
        return;  
      }
    }

    this.setState({
      playList: this.state.playList.concat([track])
    });
    
  }

  removeTrackFromPlaylist(track) {

    for (let index=0;index<this.state.playList.length;index++) {
      
      if (this.state.playList[index].id === track.id) {
        this.state.playList.splice(index, 1);
        this.setState({playList:this.state.playList});
        return;  
      }
    } 

  }

  searchSpotify(term, search_by) {
    
    let access_token = Spotify.getAccessToken();
    
    if (access_token) {
      Spotify.search(term, 'track').then(result => {
        this.setState({searchResult: result});
      });

    }

  }

  savePlaylist() {
    let pl = this.state.playList;

    Spotify.getUserInfo().then(user=> {
      if (user) {
        let user_id = user.id;
        let playListName = this.state.playListName;

        Spotify.createPlaylist(user_id, playListName).then(playlist => {
          let track_list = [];

          for (let i=0;i<pl.length;i++) {
            track_list.push(`spotify:track:${pl[i].id}`);
          }

          Spotify.addTracksToPlaylist(user_id, playlist.id, track_list).then(response => {
            console.log(response);
          });  


        })


      }

    })
  }

  render() {
    //console.log('renderer');
    //console.log(window.location.href);

    return (
      <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar searchSpotify={this.searchSpotify}></SearchBar>
          <div className="App-playlist">
            <SearchResult searchResult={this.state.searchResult} trackAction={this.addTrackToPlaylist}/>
            <PlayList trackList={this.state.playList} 
                      playListName={this.state.playListName} 
                      trackAction={this.removeTrackFromPlaylist}
                      editPlaylistName={this.editPlaylistName}
                      savePlaylist={this.savePlaylist}  />
          </div>
        </div>
      </div>
      
    );
  }
}

export default App;
