const express = require("express");
const cors = require("cors");
const recommendRoute = require("./routes/recommend");
require("dotenv").config();

const app = express();

// Configure CORS to allow requests from the client
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://mood-music-recommender.netlify.app',
    'https://mood-music-recommender.onrender.com'  // Add your Render frontend URL here
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// API routes
app.use("/api/recommend", recommendRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  // You now have the authorization code, exchange it for an access token
  // Send this code to a function that gets the access token
  res.send('Authorization code received: ' + code);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
