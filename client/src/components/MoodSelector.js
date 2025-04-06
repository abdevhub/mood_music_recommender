import React, { useState, useEffect, useRef } from 'react';

const MoodSelector = ({ onMoodSelect, selectedMood, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  
  const moods = [
    { id: 'happy', name: 'Happy', emoji: '😊' },
    { id: 'sad', name: 'Sad', emoji: '😢' },
    { id: 'energetic', name: 'Energetic', emoji: '⚡' },
    { id: 'calm', name: 'Calm', emoji: '😌' },
    { id: 'romantic', name: 'Romantic', emoji: '❤️' },
    { id: 'angry', name: 'Angry', emoji: '😠' },
    { id: 'excited', name: 'Excited', emoji: '🤩' },
    { id: 'chill', name: 'Chill', emoji: '😎' },
    { id: 'focused', name: 'Focused', emoji: '🧠' },
    { id: 'melancholic', name: 'Melancholic', emoji: '🥺' },
    { id: 'party', name: 'Party', emoji: '🎉' },
    { id: 'relaxed', name: 'Relaxed', emoji: '🧘' }
  ];

  const filteredMoods = moods.filter(mood => 
    mood.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          event.target !== inputRef.current) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectMood = (moodId) => {
    onMoodSelect(moodId);
    setSearchTerm('');
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onMoodSelect(searchTerm.trim().toLowerCase());
      setShowSuggestions(false);
    }
  };

  const handleRefreshClick = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  return (
    <div className="mood-selector">
      <h2>How are you feeling today?</h2>
      
      <div className="search-container">
        <form onSubmit={handleSubmit}>
          <div className="search-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="mood-search"
              placeholder="Type ANY mood (happy, nostalgic, dreamy...)..."
              value={searchTerm}
              onChange={handleSearch}
              onFocus={handleInputFocus}
            />
            <button type="submit" className="search-button">Find Music</button>
          </div>
        </form>
        
        <div className="search-hint">
          Type your current mood, even if it's not in our suggestions!
        </div>
        
        {showSuggestions && (
          <div className="suggestions-dropdown" ref={suggestionsRef}>
            {searchTerm && filteredMoods.length > 0 ? (
              <>
                <div className="suggestion-category">Popular Moods</div>
                {filteredMoods.map(mood => (
                  <div 
                    key={mood.id} 
                    className="suggestion-item"
                    onClick={() => handleSelectMood(mood.id)}
                  >
                    <span className="suggestion-emoji">{mood.emoji}</span>
                    <span className="suggestion-name">{mood.name}</span>
                  </div>
                ))}
                <div className="custom-mood-option">
                  <div 
                    className="suggestion-item custom-suggestion"
                    onClick={() => handleSubmit({ preventDefault: () => {} })}
                  >
                    <span className="suggestion-emoji">🔍</span>
                    <span className="suggestion-name">
                      Search for "{searchTerm}"
                    </span>
                  </div>
                </div>
              </>
            ) : searchTerm && filteredMoods.length === 0 ? (
              <div className="suggestion-item custom-suggestion" onClick={() => handleSubmit({ preventDefault: () => {} })}>
                <span className="suggestion-emoji">🎵</span>
                <span className="suggestion-name">
                  Find music for "{searchTerm}" mood
                </span>
              </div>
            ) : (
              <>
                <div className="suggestion-category">Popular Moods</div>
                {moods.slice(0, 6).map(mood => (
                  <div 
                    key={mood.id} 
                    className="suggestion-item"
                    onClick={() => handleSelectMood(mood.id)}
                  >
                    <span className="suggestion-emoji">{mood.emoji}</span>
                    <span className="suggestion-name">{mood.name}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
      
      {selectedMood && (
        <div className="current-mood">
          <p>Current mood: <strong>{selectedMood}</strong></p>
          <button 
            onClick={handleRefreshClick} 
            className="refresh-button"
            title="Get new recommendations for this mood"
          >
            ↻
          </button>
        </div>
      )}
      
      <div className="mood-grid">
        {moods.slice(0, 6).map((mood) => (
          <div
            key={mood.id}
            className={`mood-card ${selectedMood === mood.id ? 'active' : ''}`}
            onClick={() => handleSelectMood(mood.id)}
          >
            <div className="mood-emoji">{mood.emoji}</div>
            <div className="mood-name">{mood.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodSelector; 