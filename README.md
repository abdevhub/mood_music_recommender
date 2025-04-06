# Mood-Based Music Recommendation App

A Spotify-powered application that recommends music based on your current mood.

## Features

- **Search for any mood** - Type any mood (happy, nostalgic, dreamy, etc.) and get personalized recommendations
- **Mood matching** - Intelligent matching for custom moods to find the most relevant music
- **Song previews** - Listen to song previews directly in the app
- **Refresh capability** - Get new song recommendations for the same mood
- **Responsive design** - Works on desktop and mobile devices

## Setup

### Prerequisites
- Node.js and npm installed
- Spotify Developer account with API credentials

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your Spotify credentials:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   PORT=5000
   ```

4. Start the server:
   ```
   node app.js
   ```

### Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React app:
   ```
   npm start
   ```

4. Open your browser to `http://localhost:3000`

## How to Use

1. **Search for a mood**:
   - Type any mood in the search bar
   - Select from suggested moods or use your own
   - Click "Find Music" to get recommendations

2. **Browse recommendations**:
   - Play song previews directly in the app
   - Click "Open in Spotify" to listen to the full song

3. **Refresh recommendations**:
   - Click the "↻" refresh button to get new songs for the same mood

## Technologies

- **Frontend**: React, CSS
- **Backend**: Node.js, Express
- **API**: Spotify Web API 