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
        const icon = playBtn.querySelector('.icon');
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
    
    // בוחר גם את הציטוטים וגם את ה-Insights (תעלומת הבס)
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

});