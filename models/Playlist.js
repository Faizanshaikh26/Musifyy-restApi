const mongoose = require('mongoose');
const { Schema } = mongoose;

const playlistSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  songs: [{ type: Schema.Types.ObjectId, ref: 'Album.songs' }],
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', playlistSchema);
