const express = require("express");
const axios = require("axios");
const getSpotifyToken = require("../utils/spotifyAuth");

const router = express.Router();

// Enhanced mood mappings with audio features and genres
const moodMappings = {
  happy: {
    genres: ["pop", "dance", "disco", "funk"],
    features: {
      min_valence: 0.7,
      min_energy: 0.6,
      target_tempo: 120
    }
  },
  sad: {
    genres: ["acoustic", "piano", "sad", "indie"],
    features: {
      max_valence: 0.4,
      max_energy: 0.5,
      target_tempo: 80
    }
  },
  energetic: {
    genres: ["edm", "dance", "work-out", "electro"],
    features: {
      min_energy: 0.8,
      min_danceability: 0.7,
      target_tempo: 130
    }
  },
  calm: {
    genres: ["chill", "ambient", "study", "sleep"],
    features: {
      max_energy: 0.4,
      max_loudness: -10,
      target_tempo: 90
    }
  },
  romantic: {
    genres: ["r-n-b", "soul", "jazz", "blues"],
    features: {
      target_valence: 0.6,
      target_energy: 0.5,
      max_tempo: 110
    }
  },
  angry: {
    genres: ["metal", "rock", "punk"],
    features: {
      min_energy: 0.7,
      max_valence: 0.4,
      target_tempo: 130
    }
  },
  excited: {
    genres: ["pop", "edm", "dance", "party"],
    features: {
      min_energy: 0.7,
      min_valence: 0.6,
      target_tempo: 125
    }
  },
  chill: {
    genres: ["chill", "lofi", "trip-hop", "indie"],
    features: {
      max_energy: 0.6,
      target_valence: 0.5,
      target_tempo: 95
    }
  },
  focused: {
    genres: ["study", "instrumental", "ambient", "classical"],
    features: {
      max_energy: 0.5,
      min_instrumentalness: 0.5,
      target_tempo: 100
    }
  },
  melancholic: {
    genres: ["indie", "folk", "piano", "sad"],
    features: {
      max_valence: 0.4,
      target_energy: 0.4,
      target_tempo: 85
    }
  },
  party: {
    genres: ["party", "dance", "edm", "pop"],
    features: {
      min_energy: 0.7,
      min_danceability: 0.7,
      target_tempo: 120
    }
  },
  relaxed: {
    genres: ["chill", "acoustic", "ambient", "lofi"],
    features: {
      max_energy: 0.5,
      target_valence: 0.6,
      target_tempo: 90
    }
  }
};

// Additional mood synonyms to improve matching
const moodSynonyms = {
  happy: ["joyful", "cheerful", "upbeat", "pleased", "content", "delighted", "jubilant", "gleeful"],
  sad: ["depressed", "unhappy", "sorrowful", "gloomy", "downcast", "blue", "miserable", "down"],
  energetic: ["active", "lively", "dynamic", "vigorous", "spirited", "pumped", "hyper"],
  calm: ["peaceful", "serene", "tranquil", "quiet", "soothing", "relaxing", "mellow"],
  romantic: ["loving", "passionate", "affectionate", "sensual", "intimate", "dreamy", "tender"],
  angry: ["mad", "furious", "outraged", "irritated", "annoyed", "hostile", "heated", "irate"],
  excited: ["thrilled", "eager", "enthusiastic", "animated", "ecstatic", "exhilarated"],
  chill: ["laid-back", "cool", "casual", "relaxing", "easy-going"],
  focused: ["concentrated", "attentive", "determined", "productive", "studious"],
  melancholic: ["wistful", "nostalgic", "reflective", "pensive", "somber", "bittersweet"],
  party: ["festive", "celebratory", "wild", "fun", "entertaining"],
  relaxed: ["unwound", "comfortable", "at ease", "restful", "placid", "chilled"]
};

// Find the best matching predefined mood or return the original
function findClosestMood(inputMood) {
  inputMood = inputMood.toLowerCase().trim();
  
  // Direct match with a known mood
  if (moodMappings[inputMood]) {
    return {
      matchedMood: inputMood,
      originalMood: inputMood,
      exactMatch: true
    };
  }
  
  // Check synonyms
  for (const [mood, synonyms] of Object.entries(moodSynonyms)) {
    if (synonyms.includes(inputMood)) {
      return {
        matchedMood: mood,
        originalMood: inputMood,
        exactMatch: false
      };
    }
  }
  
  // If no direct match, try to find the closest mood using a simple token match
  const moodWords = inputMood.split(/\s+/);
  let bestMatch = null;
  let bestScore = 0;
  
  for (const mood of Object.keys(moodMappings)) {
    // Check if the base mood is in the input
    if (inputMood.includes(mood)) {
      return {
        matchedMood: mood,
        originalMood: inputMood,
        exactMatch: false
      };
    }
    
    // Check if any synonym matches
    const synonyms = moodSynonyms[mood] || [];
    for (const synonym of synonyms) {
      if (inputMood.includes(synonym)) {
        return {
          matchedMood: mood,
          originalMood: inputMood,
          exactMatch: false
        };
      }
    }
    
    // Calculate a simple match score based on word overlap
    let score = 0;
    const allTerms = [mood, ...(moodSynonyms[mood] || [])];
    
    for (const term of allTerms) {
      const termWords = term.split(/\s+/);
      for (const word of moodWords) {
        if (word.length <= 2) continue; // Skip very short words
        
        for (const termWord of termWords) {
          if (termWord.includes(word) || word.includes(termWord)) {
            score += 1;
          }
        }
      }
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = mood;
    }
  }
  
  // Return the best match or the original if no good match
  return {
    matchedMood: bestScore > 0 ? bestMatch : inputMood,
    originalMood: inputMood,
    exactMatch: false
  };
}

// Cache to store already seen playlists for moods
const playlistCache = {};

// Get available genres endpoint
router.get("/", async (req, res) => {
  try {
    const token = await getSpotifyToken();
    const response = await axios.get("https://api.spotify.com/v1/recommendations/available-genre-seeds", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    
    console.log("✅ Allowed genres:", response.data.genres);
    res.json({ genres: response.data.genres });
  } catch (error) {
    console.error("❌ Error fetching genres:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch genres" });
  }
});

// Get recommendations by mood endpoint
router.post("/", async (req, res) => {
    const { mood, limit = 10, refresh = false } = req.body;
    
    if (!mood) {
      return res.status(400).json({ error: "Mood is required" });
    }
    
    // Find the closest matching mood from our predefined set
    const { matchedMood, originalMood, exactMatch } = findClosestMood(mood);
    
    console.log(`🎧 Mood requested: "${originalMood}" ${!exactMatch ? `(matched to "${matchedMood}")` : ''} ${refresh ? "(refresh requested)" : ""}`);
    
    try {
      const token = await getSpotifyToken();
      
      // Step 1: Search for playlists related to the mood - use original mood for search but enhanced with "music" or "playlist"
      // This helps find more relevant results when users enter very specific moods
      let query = originalMood;
      
      // If not an exact match with our predefined moods, add "music" or "mood" to the query
      if (!exactMatch && matchedMood !== originalMood) {
        query = `${originalMood} mood music`;
      } else {
        query = `${originalMood} mood`;
      }
      
      // If refresh is requested or we don't have a cached playlist for this mood, get a new one
      let playlistIndex = 0;
      const cacheKey = originalMood.toLowerCase();
      
      if (refresh && playlistCache[cacheKey]) {
        // Cycle through playlist indexes (0, 1, 2) on refresh
        playlistIndex = (playlistCache[cacheKey].currentIndex + 1) % 3;
      }
      
      const playlistResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=playlist&limit=3`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      // Check if we found any playlists
      if (!playlistResponse.data.playlists || playlistResponse.data.playlists.items.length === 0) {
        // If no playlists found with original mood, try with the matched mood
        if (matchedMood !== originalMood) {
          const fallbackQuery = `${matchedMood} mood`;
          console.log(`⚠️ No playlists found for "${originalMood}", trying "${fallbackQuery}" instead`);
          
          const fallbackResponse = await axios.get(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(fallbackQuery)}&type=playlist&limit=3`, 
            {
              headers: {
                Authorization: `Bearer ${token}`,
              }
            }
          );
          
          // If still no playlists, return error
          if (!fallbackResponse.data.playlists || fallbackResponse.data.playlists.items.length === 0) {
            return res.status(404).json({ error: `No playlists found for the mood "${originalMood}"` });
          }
          
          // Use the fallback response
          playlistResponse.data = fallbackResponse.data;
        } else {
          return res.status(404).json({ error: `No playlists found for the mood "${originalMood}"` });
        }
      }
      
      // Make sure the index is valid
      if (playlistIndex >= playlistResponse.data.playlists.items.length) {
        playlistIndex = 0;
      }
      
      // Update the cache
      if (!playlistCache[cacheKey]) {
        playlistCache[cacheKey] = { 
          currentIndex: 0,
          lastOffset: 0 
        };
      } else {
        playlistCache[cacheKey].currentIndex = playlistIndex;
      }
      
      // Get playlist ID based on index
      const playlistId = playlistResponse.data.playlists.items[playlistIndex].id;
      console.log("📀 Found playlist:", playlistResponse.data.playlists.items[playlistIndex].name);
      
      // Step 2: Get total tracks in playlist to calculate possible offsets
      const playlistInfoResponse = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      const totalTracks = playlistInfoResponse.data.tracks.total;
      
      // Generate a random offset, but make sure it's different from last time
      let offset = Math.floor(Math.random() * Math.max(1, totalTracks - limit));
      
      // If refreshing, make sure we get a different offset
      if (refresh && playlistCache[cacheKey].lastOffset === offset && totalTracks > limit * 2) {
        offset = (offset + limit) % Math.max(1, totalTracks - limit);
      }
      
      // Update last offset in cache
      playlistCache[cacheKey].lastOffset = offset;
      
      console.log(`🔢 Using offset ${offset} of ${totalTracks} total tracks`);
      
      // Step 3: Get tracks from the playlist with the offset
      const tracksResponse = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      
      // Process and transform the track data
      const tracks = tracksResponse.data.items
        .filter(item => item.track) // Make sure the track exists
        .map(item => {
          const track = item.track;
          return {
            id: track.id,
            name: track.name,
            artist: track.artists.map((a) => a.name).join(", "),
            album: track.album.name,
            release_date: track.album.release_date,
            preview_url: track.preview_url,
            image: track.album.images[0]?.url || null,
            popularity: track.popularity,
            spotify_url: track.external_urls.spotify,
          };
        });
      
      res.json({
        mood: originalMood,
        matchedMood: matchedMood !== originalMood ? matchedMood : undefined,
        count: tracks.length,
        playlist_name: playlistResponse.data.playlists.items[playlistIndex].name,
        playlist_url: playlistResponse.data.playlists.items[playlistIndex].external_urls.spotify,
        tracks: tracks,
        refreshed: refresh
      });
    } catch (error) {
      console.error("💥 Error getting tracks:", error);
      console.error("💥 Response data:", error.response?.data);
      res.status(500).json({ 
        error: "Failed to fetch tracks",
        details: error.response?.data?.error?.message || error.message,
        status: error.response?.status || "unknown"
      });
    }
  });
  
  module.exports = router;