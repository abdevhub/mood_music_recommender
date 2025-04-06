const express = require("express");
const cors = require("cors");
const recommendRoute = require("./routes/recommend");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/recommend", recommendRoute);

app.get('/callback', async (req, res) => {
    const code = req.query.code;
  
    // You now have the authorization code, exchange it for an access token
    // Send this code to a function that gets the access token
    res.send('Authorization code received: ' + code);
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
