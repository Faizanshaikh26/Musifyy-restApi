const express = require("express");
const router = express.Router();
const {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getSongById,
} = require("../Controllers/Playlist");

// Middleware for user authentication
const { authenticateUser } = require("../middleware/authMiddleware");

router.post("/playlists", authenticateUser, createPlaylist);

router.get("/playlistsongs/:id", authenticateUser, getSongById);
router.get("/playlists", authenticateUser, getUserPlaylists);
router.get("/playlists/:id", authenticateUser, getPlaylistById);
router.put("/playlists/:id", authenticateUser, updatePlaylist);
router.delete("/playlists/:id", authenticateUser, deletePlaylist);
router.put(
  "/playlists/:playlistId/songs/:songId",
  authenticateUser,
  addSongToPlaylist
);
router.delete(
  "/playlists/:playlistId/songs/:songId",
  authenticateUser,
  removeSongFromPlaylist
);

module.exports = router;
