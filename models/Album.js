const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const songSchema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    duration: { type: Number, required: true },
    songUrl: { type: String, required: true },
    songImage: { type: String, required: true }
});

const albumSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    genre: String,
    albumImage: { type: String, required: true },
    songs: [songSchema],
    Bgcolor: { type: String, default: "#FFFFFF" },  
    created_at: { type: Date, default: Date.now }
});


const Album = mongoose.model('Album', albumSchema);
module.exports = Album;
