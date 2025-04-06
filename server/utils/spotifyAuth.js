const axios = require("axios");
require("dotenv").config(); // make sure this is present

let accessToken = "";
let tokenExpiry = 0;

module.exports = async function getSpotifyToken() {
  const currentTime = Date.now();

  // If token exists and not expired, return it
  if (accessToken && currentTime < tokenExpiry) {
    console.log("🔁 Reusing cached Spotify token");
    return accessToken;
  }

  // Otherwise, fetch a new token
  try {
    const authOptions = {
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: "grant_type=client_credentials",
    };

    const response = await axios(authOptions);
    accessToken = response.data.access_token;
    tokenExpiry = currentTime + response.data.expires_in * 1000;

    console.log("✅ Fetched new Spotify token");
    return accessToken;
  } catch (error) {
    console.error("❌ Failed to get Spotify token:", error.response?.data || error.message);
    throw new Error("Could not fetch Spotify access token");
  }
};
