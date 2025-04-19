document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const lyricsForm = document.getElementById('lyrics-form');
    const artistInput = document.getElementById('artist');
    const titleInput = document.getElementById('title');
    const songHeader = document.getElementById('song-header');
    const lyricsContent = document.getElementById('lyrics-content');
    const loadingElement = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const lyricsResult = document.getElementById('lyrics-result');
    const resultsSection = document.getElementById('results-section');
    const currentYearSpan = document.getElementById('current-year');
    
    // Karaoke elements
    const normalMode = document.getElementById('normal-mode');
    const karaokeMode = document.getElementById('karaoke-mode');
    const normalView = document.getElementById('normal-view');
    const karaokeView = document.getElementById('karaoke-view');
    const previousLine = document.getElementById('previous-line');
    const currentLine = document.getElementById('current-line');
    const nextLine = document.getElementById('next-line');
    const karaokePlay = document.getElementById('karaoke-play');
    const karaokePause = document.getElementById('karaoke-pause');
    const karaokeRestart = document.getElementById('karaoke-restart');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    
    // Additional karaoke elements
    const karaokeProgress = document.getElementById('karaoke-progress');
    const currentTimeDisplay = document.getElementById('current-time');
    const totalTimeDisplay = document.getElementById('total-time');
    const currentLineNumber = document.getElementById('current-line-number');
    const totalLinesDisplay = document.getElementById('total-lines');
    const equalizerBars = document.querySelectorAll('.equalizer .bar');
    
    // Karaoke state
    let karaokeLines = [];
    let currentLineIndex = 0;
    let karaokeInterval;
    let karaokeSpeed = 1.0;
    let pausedPosition = 0;
    let highlightPosition = 0;
    let isKaraokePlaying = false;
    
    // Enhanced karaoke state
    let totalKaraokeTime = 0;
    let currentKaraokeTime = 0;
    let karaokeStartTime = 0;
    let lastTimerUpdate = 0;
    let isEqualizerActive = false;
    
    // Initialize particles background
    if (window.particlesJS) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#ffffff" },
                shape: { type: "circle", stroke: { width: 0, color: "#000000" } },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
    
    // Set current year in the footer
    currentYearSpan.textContent = new Date().getFullYear();
    
    // Focus on artist input when page loads
    artistInput.focus();

    // Form submission handler
    lyricsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get input values
        const artist = artistInput.value.trim();
        const title = titleInput.value.trim();
        
        // Clear previous results and karaoke state
        resetResults();
        stopKaraoke();
        
        // Show loading indicator
        loadingElement.classList.remove('hidden');
        scrollToResults();
        
        try {
            // Fetch lyrics from LyricsOVH API
            const lyrics = await fetchLyrics(artist, title);
            
            // Hide loading indicator
            loadingElement.classList.add('hidden');
            
            // Display results if found
            if (lyrics && lyrics.trim() !== '') {
                songHeader.textContent = `${capitalizeFirstLetter(artist)} - ${capitalizeFirstLetter(title)}`;
                lyricsResult.classList.remove('hidden');
                
                // Add the lyrics with a typewriter-like effect in normal view
                animateLyrics(lyrics);
                
                // Process lyrics for karaoke view
                processLyricsForKaraoke(lyrics);
            } else {
                throw new Error('No lyrics found for this song.');
            }
            
        } catch (error) {
            loadingElement.classList.add('hidden');
            errorText.textContent = error.message || 'Failed to fetch lyrics. Please try again.';
            errorMessage.classList.remove('hidden');
        }
    });

    // Fetch lyrics from API
    async function fetchLyrics(artist, title) {
        const apiUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`;
        
        try {
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Lyrics not found. Check the artist name and song title.');
                } else if (response.status === 429) {
                    throw new Error('Too many requests. Please try again in a moment.');
                } else {
                    throw new Error(`API error: ${response.statusText || response.status}`);
                }
            }
            
            const data = await response.json();
            return data.lyrics;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                throw new Error('Network error. Please check your internet connection.');
            }
            throw error;
        }
    }
    
    // Mode switching
    normalMode.addEventListener('click', () => {
        if (!normalMode.classList.contains('active')) {
            normalMode.classList.add('active');
            karaokeMode.classList.remove('active');
            normalView.classList.remove('hidden');
            karaokeView.classList.add('hidden');
            stopKaraoke();
        }
    });
    
    karaokeMode.addEventListener('click', () => {
        if (!karaokeMode.classList.contains('active')) {
            karaokeMode.classList.add('active');
            normalMode.classList.remove('active');
            karaokeView.classList.remove('hidden');
            normalView.classList.add('hidden');
            
            // Initialize karaoke view if not already playing
            if (!isKaraokePlaying && karaokeLines.length > 0) {
                resetKaraokeDisplay();
            }
        }
    });
    
    // Karaoke controls
    karaokePlay.addEventListener('click', () => {
        karaokePlay.classList.add('hidden');
        karaokePause.classList.remove('hidden');
        startKaraoke();
    });
    
    karaokePause.addEventListener('click', () => {
        karaokePause.classList.add('hidden');
        karaokePlay.classList.remove('hidden');
        pauseKaraoke();
    });
    
    karaokeRestart.addEventListener('click', () => {
        stopKaraoke();
        resetKaraokeDisplay();
        // Auto-start after restart
        setTimeout(() => {
            karaokePlay.classList.add('hidden');
            karaokePause.classList.remove('hidden');
            startKaraoke();
        }, 100);
    });
    
    // Speed control
    speedSlider.addEventListener('input', () => {
        karaokeSpeed = parseFloat(speedSlider.value);
        speedValue.textContent = `${karaokeSpeed}x`;
        
        // If playing, restart with new speed
        if (isKaraokePlaying) {
            clearInterval(karaokeInterval);
            startKaraokeInterval();
        }
    });
    
    // Process lyrics for karaoke
    function processLyricsForKaraoke(lyrics) {
        // Clean up the lyrics
        const cleanedLyrics = lyrics
            .replace(/\r\n/g, '\n')
            .replace(/\n{3,}/g, '\n\n') // Replace 3+ newlines with 2
            .trim();
        
        // Split into lines, filtering out empty lines
        karaokeLines = cleanedLyrics.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        // Update total lines display
        totalLinesDisplay.textContent = karaokeLines.length;
        
        // Estimate total time (based on character count)
        let totalChars = karaokeLines.reduce((acc, line) => acc + line.length, 0);
        totalKaraokeTime = (totalChars * 100) + (karaokeLines.length * 1000);
        updateTimeDisplay(0, totalKaraokeTime);
    }
    
    // Karaoke control functions
    function startKaraoke() {
        isKaraokePlaying = true;
        karaokeStartTime = Date.now() - currentKaraokeTime;
        toggleEqualizer(true);
        startKaraokeInterval();
        updateTimerInterval();
    }
    
    function pauseKaraoke() {
        isKaraokePlaying = false;
        clearInterval(karaokeInterval);
        clearInterval(timerInterval);
        toggleEqualizer(false);
    }
    
    function stopKaraoke() {
        isKaraokePlaying = false;
        clearInterval(karaokeInterval);
        clearInterval(timerInterval);
        currentLineIndex = 0;
        highlightPosition = 0;
        pausedPosition = 0;
        currentKaraokeTime = 0;
        updateKaraokeProgress(0);
        toggleEqualizer(false);
        
        karaokePlay.classList.remove('hidden');
        karaokePause.classList.add('hidden');
    }
    
    let timerInterval;
    
    function updateTimerInterval() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            if (isKaraokePlaying) {
                currentKaraokeTime = Date.now() - karaokeStartTime;
                if (currentKaraokeTime > totalKaraokeTime) {
                    currentKaraokeTime = totalKaraokeTime;
                }
                updateTimeDisplay(currentKaraokeTime, totalKaraokeTime);
                updateKaraokeProgress(currentKaraokeTime / totalKaraokeTime * 100);
            }
        }, 100);
    }
    
    function updateTimeDisplay(current, total) {
        currentTimeDisplay.textContent = formatTime(current);
        totalTimeDisplay.textContent = formatTime(total);
    }
    
    function formatTime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    function updateKaraokeProgress(percent) {
        karaokeProgress.style.width = `${percent}%`;
    }
    
    function toggleEqualizer(active) {
        isEqualizerActive = active;
        
        equalizerBars.forEach(bar => {
            if (active) {
                bar.style.animationPlayState = 'running';
            } else {
                bar.style.animationPlayState = 'paused';
            }
        });
    }
    
    function resetKaraokeDisplay() {
        currentLineIndex = 0;
        highlightPosition = 0;
        currentKaraokeTime = 0;
        updateKaraokeProgress(0);
        updateTimeDisplay(0, totalKaraokeTime);
        
        currentLineNumber.textContent = currentLineIndex + 1;
        updateKaraokeDisplay();
    }
    
    function startKaraokeInterval() {
        const currentText = karaokeLines[currentLineIndex] || '';
        const timePerChar = 100 / karaokeSpeed; // ms per character
        
        karaokeInterval = setInterval(() => {
            if (highlightPosition < currentText.length) {
                highlightPosition++;
                updateCurrentLineHighlight();
            } else {
                // Move to next line
                clearInterval(karaokeInterval);
                
                setTimeout(() => {
                    if (isKaraokePlaying) {
                        if (currentLineIndex < karaokeLines.length - 1) {
                            currentLineIndex++;
                            currentLineNumber.textContent = currentLineIndex + 1;
                            highlightPosition = 0;
                            updateKaraokeDisplay();
                            startKaraokeInterval();
                        } else {
                            // End of lyrics
                            stopKaraoke();
                            resetKaraokeDisplay();
                        }
                    }
                }, 1000 / karaokeSpeed);
            }
        }, timePerChar);
    }
    
    function updateKaraokeDisplay() {
        // Set previous line
        previousLine.textContent = currentLineIndex > 0 ? 
            karaokeLines[currentLineIndex - 1] : '';
        
        // Set current line initial state
        const currentText = karaokeLines[currentLineIndex] || '';
        updateCurrentLineHighlight();
        
        // Set next line
        nextLine.textContent = currentLineIndex < karaokeLines.length - 1 ? 
            karaokeLines[currentLineIndex + 1] : '';
    }
    
    function updateCurrentLineHighlight() {
        const currentText = karaokeLines[currentLineIndex] || '';
        const highlightText = currentText.substring(0, highlightPosition);
        const restText = currentText.substring(highlightPosition);
        
        const highlightSpan = currentLine.querySelector('.highlight');
        const restSpan = currentLine.querySelector('.rest');
        
        highlightSpan.textContent = highlightText;
        restSpan.textContent = restText;
    }
    
    // Helper functions
    function resetResults() {
        lyricsContent.textContent = '';
        lyricsResult.classList.add('hidden');
        errorMessage.classList.add('hidden');
        karaokeLines = [];
    }
    
    function scrollToResults() {
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
    
    function capitalizeFirstLetter(string) {
        return string.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }
    
    function animateLyrics(text) {
        // Split the lyrics into chunks to avoid browser lag
        const chunks = splitTextIntoChunks(text, 500);
        let currentChunk = 0;
        
        function addNextChunk() {
            if (currentChunk < chunks.length) {
                lyricsContent.textContent += chunks[currentChunk];
                currentChunk++;
                setTimeout(addNextChunk, 50);
            }
        }
        
        addNextChunk();
    }
    
    function splitTextIntoChunks(text, chunkSize) {
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.slice(i, i + chunkSize));
        }
        return chunks;
    }
}); 