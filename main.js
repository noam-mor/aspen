document.addEventListener('DOMContentLoaded', function() {

    const quotes = document.querySelectorAll('.interactive-quote, .quote-wrapper');
    
    quotes.forEach(quoteWrapper => {
        const btn = quoteWrapper.querySelector('.toggle-btn');
        if (btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                quoteWrapper.classList.toggle('open');
            });
        }
    });

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