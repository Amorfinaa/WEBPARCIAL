import { setupGallery } from './galeria.js';

document.addEventListener('DOMContentLoaded', async () => {
    const gameDetailContainer = document.getElementById('game-detail');
    const gameTemplate = document.getElementById('game-template');
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = urlParams.get('id');

    if (gameId) {
        try {
            showLoader();
            const gameDetails = await fetchGameDetae(gameId);
            renderGame(gameDetails);
        } catch (error) {
            console.error('Error al cargar los detalles del juego:', error);
            gameDetailContainer.innerHTML = '<p style="color: #FDF500; text-align: center; margin-top: 20px;">ERROR AL CARGAR DETALLES</p>';
        } finally {
            hideLoader();
        }
    } else {
        gameDetailContainer.innerHTML = '<p style="color: #FDF500; text-align: center; margin-top: 20px;">NO SE ENCONTRÓ ID</p>';
    }

    function renderGame(game) {
        const clone = gameTemplate.content.cloneNode(true);
        clone.querySelector('.game-thumbnail').src = game.thumbnail;
        clone.querySelector('.game-thumbnail').alt = game.title;
        clone.querySelector('.game-title').textContent = game.title;
        clone.querySelector('.genre').textContent = game.genre;
        clone.querySelector('.platform').textContent = game.platform;
        clone.querySelector('.developer').textContent = game.developer;
        clone.querySelector('.publisher').textContent = game.publisher;
        clone.querySelector('.release-date').textContent = new Date(game.release_date).toLocaleDateString();
        clone.querySelector('.description').textContent = game.description;

        clone.querySelector('.developer').style.marginLeft = '50px';
        clone.querySelector('.publisher').style.marginLeft = '50px';
        clone.querySelector('.release-date').style.marginLeft = '50px';

        const requirementsContainer = clone.querySelector('.requirements');
        if (game.minimum_system_requirements) {
            for (const [key, value] of Object.entries(game.minimum_system_requirements)) {
                const requirement = document.createElement('div');
                requirement.innerHTML = `<strong>${key}:</strong> ${value}`;
                requirementsContainer.appendChild(requirement);
            }
        } else {
            requirementsContainer.innerHTML = '<p>No hay información de requisitos mínimos.</p>';
        }

        setupGallery(clone, game);
        gameDetailContainer.appendChild(clone);
    }

async function fetchGameDetae(gameId) {
    const apiUrl = `https://www.freetogame.com/api/game?id=${gameId}`;
    const encodedUrl = encodeURIComponent(apiUrl);
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodedUrl}`;

    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error('ERROR DETALLEJUEGO');
    return await response.json();
}

});

function showLoader() {
    if (!document.querySelector('.loader-container')) {
        const loaderContainer = document.createElement('div');
        loaderContainer.className = 'loader-container';
        const loader = document.createElement('div');
        loader.className = 'loader';
        loaderContainer.appendChild(loader);
        document.body.appendChild(loaderContainer);
    } else {
        document.querySelector('.loader-container').style.display = 'flex';
    }
}

function hideLoader() {
    const loader = document.querySelector('.loader-container');
    if (loader) {
        loader.style.display = 'none';
    }
}
