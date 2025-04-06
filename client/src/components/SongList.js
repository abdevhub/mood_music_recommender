import React, { useState, useEffect } from 'react';

const SongList = ({ songs, playlistInfo, refreshCount }) => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [showRefreshAnimation, setShowRefreshAnimation] = useState(false);

  // Effect to show refresh animation when refresh count changes
  useEffect(() => {
    if (refreshCount > 0) {
      setShowRefreshAnimation(true);
      const timer = setTimeout(() => {
        setShowRefreshAnimation(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [refreshCount]);

  // Stop audio playback when songs change
  useEffect(() => {
    if (currentlyPlaying) {
      const audioElement = document.getElementById(`audio-${currentlyPlaying}`);
      if (audioElement) {
        audioElement.pause();
      }
      setCurrentlyPlaying(null);
    }
  }, [songs]);

  const handlePlay = (songId, previewUrl) => {
    if (!previewUrl) {
      alert('Sorry, no preview available for this song');
      return;
    }

    // Stop currently playing audio if any
    if (currentlyPlaying) {
      const audioElement = document.getElementById(`audio-${currentlyPlaying}`);
      if (audioElement) {
        audioElement.pause();
      }
    }

    // Play the new audio or toggle if it's the same song
    if (currentlyPlaying === songId) {
      setCurrentlyPlaying(null);
    } else {
      const audioElement = document.getElementById(`audio-${songId}`);
      if (audioElement) {
        audioElement.play();
        setCurrentlyPlaying(songId);
        
        // When audio ends, reset the currently playing state
        audioElement.onended = () => {
          setCurrentlyPlaying(null);
        };
      }
    }
  };

  return (
    <div className={`song-list-container ${showRefreshAnimation ? 'refresh-animation' : ''}`}>
      {playlistInfo && (
        <div className="playlist-info">
          <h2>Based on the "{playlistInfo.name}" playlist</h2>
          <a 
            href={playlistInfo.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Open in Spotify
          </a>
        </div>
      )}

      <h3>
        Recommended Songs for "{playlistInfo?.mood || ''}" 
        {playlistInfo?.matchedMood && (
          <span className="mood-match-info">
            (matching "{playlistInfo.matchedMood}" music)
          </span>
        )}
        {playlistInfo?.refreshed && (
          <span className="refreshed-badge">New Selection</span>
        )}
      </h3>
      
      <div className="songs-grid">
        {songs.map((song) => (
          <div key={song.id} className="song-card">
            <img 
              src={song.image || 'https://via.placeholder.com/100'} 
              alt={song.name} 
              className="song-image" 
            />
            <div className="song-info">
              <h4 className="song-title">{song.name}</h4>
              <p className="song-artist">{song.artist}</p>
              
              <div className="song-controls">
                <button 
                  className="btn-primary" 
                  onClick={() => handlePlay(song.id, song.preview_url)}
                >
                  {currentlyPlaying === song.id ? 'Pause' : 'Play Preview'}
                </button>
                
                <a 
                  href={song.spotify_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Open in Spotify
                </a>
              </div>
              
              {song.preview_url && (
                <audio id={`audio-${song.id}`} src={song.preview_url} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SongList; 