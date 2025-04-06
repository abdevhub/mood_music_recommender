import React, { useState } from 'react';
import MoodSelector from './components/MoodSelector';
import SongList from './components/SongList';
import Header from './components/Header';
import Loading from './components/Loading';
import axios from 'axios';
import './styles/index.css';

function App() {
  const [selectedMood, setSelectedMood] = useState('');
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);

  const fetchRecommendations = async (mood, shouldRefresh = false, limit = 12) => {
    setLoading(true);
    setSongs([]);
    setError('');
    setPlaylistInfo(null);

    try {
      const response = await axios.post('/api/recommend', { 
        mood, 
        limit,
        refresh: shouldRefresh 
      });
      
      setSongs(response.data.tracks);
      setPlaylistInfo({
        name: response.data.playlist_name,
        url: response.data.playlist_url,
        mood: response.data.mood,
        refreshed: response.data.refreshed
      });
      setLoading(false);
      
      if (shouldRefresh) {
        setRefreshCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error fetching songs:', err);
      setError('Failed to fetch songs. Please try again.');
      setLoading(false);
    }
  };

  const handleMoodSelect = async (mood) => {
    const isRefresh = mood === selectedMood;
    setSelectedMood(mood);
    await fetchRecommendations(mood, isRefresh);
  };

  const handleRefresh = async () => {
    if (selectedMood) {
      await fetchRecommendations(selectedMood, true);
    }
  };

  return (
    <div className="container">
      <Header />
      <MoodSelector 
        onMoodSelect={handleMoodSelect} 
        selectedMood={selectedMood}
        onRefresh={handleRefresh}
      />
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <Loading />
      ) : (
        songs.length > 0 && (
          <SongList 
            songs={songs} 
            playlistInfo={playlistInfo} 
            refreshCount={refreshCount}
          />
        )
      )}

      {!loading && songs.length === 0 && selectedMood && !error && (
        <div className="no-results">
          <p>No songs found for the mood "{selectedMood}". Try a different mood.</p>
        </div>
      )}
    </div>
  );
}

export default App; 