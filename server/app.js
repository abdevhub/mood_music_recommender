const express = require("express");
const cors = require("cors");
const recommendRoute = require("./routes/recommend");
require("dotenv").config();

const app = express();

// Updated CORS configuration to allow requests from the frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://mood-music-recommender.onrender.com',  // Replace with your frontend URL when deployed
    'https://mood-music-app.onrender.com'           // Alternative frontend URL
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

app.use("/api/recommend", recommendRoute);

app.get('/callback', async (req, res) => {
    const code = req.query.code;
  
    // You now have the authorization code, exchange it for an access token
    // Send this code to a function that gets the access token
    res.send('Authorization code received: ' + code);
  });
  
// Add a health check endpoint
app.get('/', (req, res) => {
  res.send('Mood Music Recommendation API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
