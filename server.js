const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// Route to serve a simple message for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the YouTube Downloader API!');
});

// Endpoint to fetch video info based on the provided YouTube video URL
app.get('/info', async (req, res) => {
    const videoURL = req.query.url;
    if (!videoURL) {
        return res.status(400).json({ error: 'Missing video URL' });
    }

    try {
        const info = await ytdl.getInfo(videoURL);
        const formats = info.formats.map(format => {
            return {
                quality_label: format.qualityLabel,
                url: format.url,
                title: info.videoDetails.title
            };
        });
        const thumbnail_url = info.videoDetails.thumbnails[0].url;
        res.json({ formats, thumbnail_url });
    } catch (error) {
        console.error('Error fetching video info:', error);
        res.status(500).json({ error: 'Failed to fetch video info' });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
