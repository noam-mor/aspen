document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       Audio Player Logic
       ========================================= */
    
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    document.querySelectorAll('.aspen-audio-wrapper').forEach(wrapper => {
        const audio = wrapper.querySelector('audio');
        const playBtn = wrapper.querySelector('.play-pause-btn');
        const label = playBtn.querySelector('.label');
        const slider = wrapper.querySelector('.seek-slider');
        const fill = wrapper.querySelector('.progress-fill');
        const currentTimeEl = wrapper.querySelector('.current-time');
        const durationEl = wrapper.querySelector('.duration-time');

        audio.addEventListener('loadedmetadata', () => {
            durationEl.textContent = formatTime(audio.duration);
            slider.max = Math.floor(audio.duration);
        });

        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                document.querySelectorAll('audio').forEach(a => {
                    if(a !== audio) { 
                        a.pause(); 
                        const otherWrapper = a.closest('.aspen-audio-wrapper');
                        if (otherWrapper) {
                             otherWrapper.querySelector('.play-pause-btn').classList.remove('playing');
                             otherWrapper.querySelector('.label').textContent = "ניגון";
                        }
                    }
                });

                audio.play();
                playBtn.classList.add('playing');
                label.textContent = "עצור";
            } else {
                audio.pause();
                playBtn.classList.remove('playing');
                label.textContent = "ניגון";
            }
        });

        audio.addEventListener('timeupdate', () => {
            slider.value = audio.currentTime;
            currentTimeEl.textContent = formatTime(audio.currentTime);
            
            const percent = (audio.currentTime / audio.duration) * 100;
            fill.style.width = `${percent}%`;
        });

        // גרירת הסליידר
        slider.addEventListener('input', () => {
            audio.currentTime = slider.value;
        });

        // איפוס בסיום השיר
        audio.addEventListener('ended', () => {
            playBtn.classList.remove('playing');
            label.textContent = "ניגון";
            fill.style.width = '0%';
        });
    });


    /* =========================================
       Interactive Toggles
       ========================================= */
    
    // בוחר גם את הציטוטים וגם את ה-Insights
    const interactives = document.querySelectorAll('.interactive-quote, .quote-wrapper, .interactive-insight, .insight-wrapper');
    
    interactives.forEach(wrapper => {
        const btn = wrapper.querySelector('.toggle-btn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                // הוספת/הסרת קלאס 'open' שפותח את האקורדיון ומסובב את החץ
                wrapper.classList.toggle('open');
            });
        }
    });


    /* =========================================
       Image Hover Effects 
       ========================================= */
    
    const activeImages = document.querySelectorAll('.image-wrapper, .image-container');
    const body = document.body;

    activeImages.forEach(item => {
        item.addEventListener('mouseenter', () => {
            body.classList.add('dim-mode');
        });

        item.addEventListener('mouseleave', () => {
            body.classList.remove('dim-mode');
        });
    });


    /* =========================================
       Films Gallery Logic + Cinema Mode
       ========================================= */
    
    const track = document.querySelector('.films-track');
    
    if (track) {
        const slides = Array.from(track.children);
        const nextBtn = document.querySelector('.next-film');
        const prevBtn = document.querySelector('.prev-film');
        const currentCounter = document.querySelector('.gallery-counter .current');
        const totalCounter = document.querySelector('.gallery-counter .total');
        
        let currentIndex = 0;

        if (totalCounter) {
            totalCounter.textContent = slides.length;
        }

        const handleCinemaMode = () => {
            slides.forEach(slide => {
                const video = slide.querySelector('video');
                if (video) {
                    video.addEventListener('play', () => {
                        document.body.classList.add('cinema-mode');
                    });

                    video.addEventListener('pause', () => {
                        document.body.classList.remove('cinema-mode');
                    });
                    video.addEventListener('ended', () => {
                        document.body.classList.remove('cinema-mode');
                    });
                }
            });
        };

        handleCinemaMode();

        const updateGallery = (index) => {
            const amountToMove = index * 100;
            track.style.transform = `translateX(${amountToMove}%)`;

            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');

            if (currentCounter) {
                currentCounter.textContent = index + 1;
            }

            slides.forEach((slide, i) => {
                if (i !== index) {
                    const video = slide.querySelector('video');
                    if (video) {
                        video.pause();
                        video.currentTime = 0;
                    }
                }
            });
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (currentIndex < slides.length - 1) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateGallery(currentIndex);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = slides.length - 1;
                }
                updateGallery(currentIndex);
            });
        }
    }

    /* =========================================
       Flipbook Logic
       ========================================= */

    const flipbooks = document.querySelectorAll('.aspen-flipbook-wrapper');

    flipbooks.forEach(wrapper => {
        const path = wrapper.dataset.path;
        const filename = wrapper.dataset.filename;
        const ext = wrapper.dataset.ext;
        const count = parseInt(wrapper.dataset.count);
        const speed = parseInt(wrapper.dataset.speed) || 100; 

        const imgEl = wrapper.querySelector('.flipbook-img');
        const stage = wrapper.querySelector('.flipbook-stage');
        const slider = wrapper.querySelector('.flip-slider');
        const playBtn = wrapper.querySelector('.flip-play-btn');
        const counter = wrapper.querySelector('.frame-counter');
        
        let currentFrame = 1;
        let isPlaying = false;
        let interval;
        const images = []; 

        const preloadImages = () => {
            wrapper.classList.add('loading');
            let loadedCount = 0;

            for (let i = 1; i <= count; i++) {
                const img = new Image();
                img.src = `${path}${filename}${i}${ext}`;
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === count) {
                        wrapper.classList.remove('loading');
                        console.log(`Flipbook loaded: ${filename}`);
                    }
                };
                images[i] = img.src; 
            }
        };

        const updateFrame = (index) => {
            if (index < 1) index = 1;
            if (index > count) index = count;
            
            currentFrame = index;
            
            if (images[index]) {
                imgEl.src = images[index];
            } else {
                imgEl.src = `${path}${filename}${index}${ext}`;
            }
            
            slider.value = index;
            counter.textContent = `${index} / ${count}`;
        };

        stage.addEventListener('mousemove', (e) => {
            if (isPlaying) return; 

            const rect = stage.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const width = rect.width;
            
            const percent = Math.max(0, Math.min(1, x / width));
            const frameIndex = Math.floor(percent * count) + 1;
            
            updateFrame(frameIndex);
        });

        slider.addEventListener('input', (e) => {
            stopAutoPlay();
            updateFrame(parseInt(e.target.value));
        });

        const startAutoPlay = () => {
            isPlaying = true;
            playBtn.classList.add('playing');
            
            interval = setInterval(() => {
                let next = currentFrame + 1;
                if (next > count) next = 1; 
                updateFrame(next);
            }, speed);
        };

        const stopAutoPlay = () => {
            isPlaying = false;
            playBtn.classList.remove('playing');
            clearInterval(interval);
        };

        playBtn.addEventListener('click', () => {
            if (isPlaying) {
                stopAutoPlay();
            } else {
                startAutoPlay();
            }
        });

        preloadImages();
    });

});