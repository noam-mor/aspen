document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Audio Player Logic (נגני אודיו)
       ========================================= */
    
    // פונקציית עזר לפרמוט זמן (00:00)
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // אתחול כל הנגנים בעמוד
    document.querySelectorAll('.aspen-audio-wrapper').forEach(wrapper => {
        const audio = wrapper.querySelector('audio');
        const playBtn = wrapper.querySelector('.play-pause-btn');
        const label = playBtn.querySelector('.label');
        const slider = wrapper.querySelector('.seek-slider');
        const fill = wrapper.querySelector('.progress-fill');
        const currentTimeEl = wrapper.querySelector('.current-time');
        const durationEl = wrapper.querySelector('.duration-time');

        // טעינת אורך השיר
        audio.addEventListener('loadedmetadata', () => {
            durationEl.textContent = formatTime(audio.duration);
            slider.max = Math.floor(audio.duration);
        });

        // כפתור ניגון/השהיה
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                // עצירת כל הנגנים האחרים
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

        // עדכון הבר והזמן תוך כדי ניגון
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
       2. Interactive Toggles (ציטוטים + תובנות)
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
       3. Image Hover Effects (החשכת מסך)
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
       4. Films Gallery Logic (גלריית סרטים + Cinema Mode)
       ========================================= */
    
    const track = document.querySelector('.films-track');
    
    if (track) {
        const slides = Array.from(track.children);
        const nextBtn = document.querySelector('.next-film');
        const prevBtn = document.querySelector('.prev-film');
        const currentCounter = document.querySelector('.gallery-counter .current');
        const totalCounter = document.querySelector('.gallery-counter .total');
        
        let currentIndex = 0;

        // עדכון סך כל הסרטים
        if (totalCounter) {
            totalCounter.textContent = slides.length;
        }

        // --- הוספה חדשה: ניהול אפקט החושך (Cinema Mode) ---
        const handleCinemaMode = () => {
            slides.forEach(slide => {
                const video = slide.querySelector('video');
                if (video) {
                    // כשהסרט מתחיל לנגן -> מחשיכים
                    video.addEventListener('play', () => {
                        document.body.classList.add('cinema-mode');
                    });

                    // כשהסרט עוצר או נגמר -> מחזירים אור
                    video.addEventListener('pause', () => {
                        document.body.classList.remove('cinema-mode');
                    });
                    video.addEventListener('ended', () => {
                        document.body.classList.remove('cinema-mode');
                    });
                }
            });
        };
        // הפעלת הפונקציה
        handleCinemaMode();
        // ---------------------------------------------------

        const updateGallery = (index) => {
            const amountToMove = index * 100;
            track.style.transform = `translateX(${amountToMove}%)`;

            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');

            if (currentCounter) {
                currentCounter.textContent = index + 1;
            }

            // עצירת וידאו במעבר שקופית
            slides.forEach((slide, i) => {
                if (i !== index) {
                    const video = slide.querySelector('video');
                    if (video) {
                        video.pause(); // זה גם יבטל את ה-cinema-mode אוטומטית בגלל ה-Listener למעלה
                        video.currentTime = 0; // איפוס להתחלה (אופציונלי)
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

});