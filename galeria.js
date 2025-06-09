export function setupGallery(clone, game) {
    const screenshotsContainer = clone.querySelector('.screenshots-container');
    const galleryDots = clone.querySelector('.gallery-dots');



    if (game.screenshots && game.screenshots.length > 0) {
        game.screenshots.forEach((screenshot, index) => {
            const img = document.createElement('img');
            img.src = screenshot.image;
            img.alt = `Screenshot ${index + 1}`;
            img.className ='screenshot';
            if (index === 0) img.classList.add('active');
            screenshotsContainer.appendChild(img);


            const dot = document.createElement('div');
            dot.className ='dot';
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                document.querySelectorAll('.screenshot').forEach((s, i) => {
                    s.classList.toggle('active', i === index);
                });
                document.querySelectorAll('.dot').forEach((d, i) => {
                    d.classList.toggle('active', i === index);
                });
            });
            galleryDots.appendChild(dot);
        });
        
    const prevBtn = clone.querySelector('#prev-btn');
    const nextBtn = clone.querySelector('#next-btn');
    let currentIndex = 0;

    function showImage(index) {
        document.querySelectorAll('.screenshot').forEach((s, i) => {
            s.classList.toggle('active', i === index);
        });
        document.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('active', i === index);
        });
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + game.screenshots.length) % game.screenshots.length;
        showImage(currentIndex);
    });
    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % game.screenshots.length;
        showImage(currentIndex);
    });
    
    }else{
        screenshotsContainer.innerHTML = '<p> SIN IMAGENES DEL JUEGO :( </p>';
    }
}