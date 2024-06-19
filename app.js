// const express = require("express");
// const app = express();
// require("./db/connection");
// const path = require("path");
// const compression = require('compression');
// app.use(compression());

// const port = process.env.PORT || 8000;
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const albumsControllers = require("./Controllers/albums");
// const usersControllers = require('./Controllers/Users');
// const playlistRoutes = require('./routes/playlisRoutes');
// require("dotenv").config();

// app.use(bodyParser.json());
// app.use("/images", express.static(path.join(__dirname, "Images")));
// app.use("/songurl", express.static(path.join(__dirname, "Songurl")));

// // Updated CORS configuration
// const allowedOrigins = ['http://localhost:5173', 'https://musifyapp1.vercel.app'];
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   credentials: true,
// }));

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });

// app.use('/api', playlistRoutes);
// app.get("/", albumsControllers.allAlbums);
// app.get("/api/search", albumsControllers.searchAlbums);
// app.get("/api/:id", albumsControllers.allAlbumsById);
// app.post("/api/albums", albumsControllers.newAlbum);
// app.put("/api/:id", albumsControllers.updateAlbum);
// app.delete("/api/:id", albumsControllers.deleteAlbum);

// app.post("/login", usersControllers.login);
// app.post("/signUp", usersControllers.signUp);

// app.listen(port, () => console.log("Server is running on port", port));



const express = require("express");
const app = express();
require("./db/connection");
const path = require("path");
const compression = require('compression');
const bodyParser = require("body-parser");
const cors = require("cors");
const rateLimit = require('express-rate-limit');
const albumsControllers = require("./Controllers/albums");
const usersControllers = require('./Controllers/Users');
const playlistRoutes = require('./routes/playlisRoutes');
require("dotenv").config();

// Enable Gzip compression
app.use(compression());

const port = process.env.PORT || 8000;

// Body parser middleware
app.use(bodyParser.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Serve static files with cache control
app.use("/images", express.static(path.join(__dirname, "Images"), { maxAge: '1d' }));
app.use("/songurl", express.static(path.join(__dirname, "Songurl"), { maxAge: '1d' }));

// Updated CORS configuration


app.use(cors({
  origin: true, // Allow any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));



// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Route handlers
app.use('/api', playlistRoutes);
app.get("/", albumsControllers.allAlbums);
app.get("/api/search", albumsControllers.searchAlbums);
app.get("/api/:id", albumsControllers.allAlbumsById);
app.post("/api/albums", albumsControllers.newAlbum);
app.put("/api/:id", albumsControllers.updateAlbum);
app.delete("/api/:id", albumsControllers.deleteAlbum);

app.post("/login", usersControllers.login);
app.post("/signUp", usersControllers.signUp);

app.listen(port, () => console.log("Server is running on port", port));
