const Playlist = require('../models/Playlist');
const Album = require('../models/Album');

// Create a new playlist
const createPlaylist = async (req, res) => {
  const { name, description, songs } = req.body;
  const userId = req.user.id;

  try {
    if (!name || !songs || !Array.isArray(songs)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const newPlaylist = new Playlist({
      name,
      description,
      user: userId,
      songs,
    });
    await newPlaylist.save();

    res.status(201).json(newPlaylist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all playlists for a user
const getUserPlaylists = async (req, res) => {
  const userId = req.user.id;

  try {
    const playlists = await Playlist.find({ user: userId }).populate('songs');
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a specific playlist by ID
const getPlaylistById = async (req, res) => {
  const { id } = req.params;

  try {
    const playlist = await Playlist.findById(id).populate('songs');
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.json(playlist);
  } catch (error) {
    console.error('Error fetching playlist by ID:', error);
    res.status(500).json({ message: 'Error fetching playlist by ID', error: error.message });
  }
};


// Update a playlist
const updatePlaylist = async (req, res) => {
  const { id } = req.params;
  const { name, description, songs } = req.body;

  try {
    if (!name || !songs || !Array.isArray(songs)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
      id,
      { name, description, songs },
      { new: true }
    );

    if (!updatedPlaylist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    res.json(updatedPlaylist);
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a playlist
const deletePlaylist = async (req, res) => {
  const { id } = req.params;

  try {
    const playlist = await Playlist.findById(id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    await playlist.deleteOne();
    res.json({ message: 'Deleted playlist' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a song to a playlist
const addSongToPlaylist = async (req, res) => {
  const { playlistId, songId } = req.params;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    const album = await Album.findOne({ 'songs._id': songId });
    if (!album) {
      return res.status(404).json({ message: 'Album not found' });
    }

    const song = album.songs.find(s => s._id.toString() === songId);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }

    const completeSong = {
      _id: song._id,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      songUrl: song.songUrl,
      songImage: song.songImage
    };

    playlist.songs.push(completeSong);
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    console.error('Error adding song to playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Remove a song from a playlist
const removeSongFromPlaylist = async (req, res) => {
  const { playlistId, songId } = req.params;

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    playlist.songs = playlist.songs.filter(song => song.toString() !== songId);
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch song details by ID
const getSongById = async (req, res) => {
  const { id } = req.params;

  try {
    // Remove extra quotes from the id
    const cleanedId = id.replace(/"/g, ''); 

    const album = await Album.findOne({ 'songs._id': cleanedId });
    if (!album) {
      return res.status(404).json({ message: 'Song not found' });
    }

    const song = album.songs.id(cleanedId);
    res.json(song);
  } catch (error) {
    console.error('Error fetching song by ID:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  getSongById
};
