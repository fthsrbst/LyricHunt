# LyricHunt 🎵

## Live Preview:https://fthsrbst.github.io/LyricHunt/

A stunning, elegant web application that allows users to find and enjoy song lyrics with a beautiful visual experience. The application fetches lyrics from the LyricsOVH API and offers both standard viewing and an interactive karaoke mode with smooth animations.

## ✨ Features

- **Elegant UI**: Modern design with animated particles background and smooth transitions
- **Responsive Design**: Works perfectly on all devices - mobile, tablet, and desktop
- **Real-time Lyrics Search**: Fast access to lyrics from thousands of songs
- **Karaoke Mode**: Interactive mode that highlights lyrics as they would be sung
- **Speed Control**: Adjust the speed of the karaoke display to match the song's tempo
- **Animated Effects**: Beautiful animations throughout the interface
- **Smart Error Handling**: Clear feedback when lyrics can't be found

## 🎤 Karaoke Mode

The karaoke mode lets you enjoy lyrics in a dynamic, timed display:
- **Word-by-Word Highlighting**: Words are highlighted in sync with the song
- **Speed Controls**: Adjust playback speed to match the actual song
- **Previous/Next Lines**: See what's coming next
- **Play/Pause/Restart**: Full control over your karaoke experience

## 🚀 Technologies Used

- **HTML5**: Semantic markup for better accessibility
- **CSS3**: Modern styling with CSS variables, flexbox, and animations
- **JavaScript (ES6+)**: Asynchronous API requests and interactive features
- **Particles.js**: Beautiful animated particle background effects
- **Font Awesome**: Beautiful icons for enhanced user experience
- **Google Fonts**: Elegant typography with Poppins and Dancing Script
- **LyricsOVH API**: Free API to fetch song lyrics

## 🎯 How to Use

1. Visit the application in your web browser
2. Enter the artist name and song title
3. Click the "Find Lyrics" button or press Enter
4. View the lyrics in normal mode or switch to karaoke mode:
   - Normal Mode: View all lyrics at once
   - Karaoke Mode: Experience lyrics with timed highlighting

### Karaoke Controls:
- **Play/Pause**: Start or pause the karaoke animation
- **Restart**: Start the karaoke from the beginning
- **Speed**: Adjust the speed using the slider (0.5x to 2x)

## 🔧 API Information

This application uses the LyricsOVH API to fetch song lyrics:
- **API Endpoint**: `https://api.lyrics.ovh/v1/{artist}/{title}`
- **API Documentation**: [LyricsOVH](https://lyricsovh.docs.apiary.io/)

## 💻 Local Development

To run this project locally:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/lyric-hunt.git
   ```
2. Navigate to the project directory:
   ```
   cd lyric-hunt
   ```
3. Open `index.html` in your browser

## 🌐 Deployment

This project is designed to be easily deployed to GitHub Pages for free hosting.

## 📝 Known Limitations

- The LyricsOVH API may not have lyrics for all songs, especially very new or obscure ones
- The API may have rate limiting that can temporarily affect the app's functionality
- The karaoke timing is estimated and not synced with actual audio
- For the best karaoke experience, play the actual song in another application while using karaoke mode

## 📄 License

MIT 
