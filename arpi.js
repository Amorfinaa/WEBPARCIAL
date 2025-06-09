let allGames = []

const cardContainer = document.querySelector('.card-container')


const titleFilter =  document.getElementById('title-filter')
const platformFilter= document.getElementById('platform-filter')
const genreFilter= document.getElementById('genre-filter')
const dateFromFilter= document.getElementById('date-from')
const dateToFilter= document.getElementById('date-to')
const applyFiltersBtn= document.getElementById('apply-filters')
const resetFiltersBtn= document.getElementById('reset-filters')

document.addEventListener('DOMContentLoaded',() => {
  initializeApp()
  inicializarEven()
})


async function initializeApp(){
    showLoader();
    await cargarGenero();
try{
    allGames = await fetchGames();
    renderGames(allGames);
    hideLoader();
}catch(error){
    console.error('Error al cargar los juegos:', error);
    showError('No se pudieron cargar los juegos.');
    hideLoader();
    }
}



function showLoader(){
  if (!document.querySelector('.loader-container')){
    const loaderContainer = document.createElement('div')
    loaderContainer.className = 'loader-container'

    const loader = document.createElement('img')
    loader.src = 'https://i.gifer.com/origin/36/36527397c208b977fa3ef21f68c0f7b2.gif'
    loader.alt = 'Cargando...'
    loader.className = 'loader'

    loaderContainer.appendChild(loader)
    document.body.appendChild(loaderContainer)
  }else{
    document.querySelector('.loader-container').style.display = 'flex'
  }
}

function hideLoader(){
  const loader = document.querySelector('.loader-container')
  if (loader) loader.style.display = 'none'
}

function showError(message){
  cardContainer.innerHTML = `<div class="error-message"> <p>${message}</p> </div>`
}



//juegos API
async function fetchGames(){
  try{
    const response = await fetch('https://cors-anywhere.herokuapp.com/https://www.freetogame.com/api/games?platform=pc')
    if (!response.ok) throw new Error('API ERROR')
    return await response.json()
  } catch (error) {
    console.error('ERROR AL TOMAR JUEGOS', error)
    throw error
  }
}

/*async function detalleGame(gameId){
  try{
    const response = await fetch(`${BASE_API_URL}/game?id=${gameId}`)
    if (!response.ok) throw new Error('API ERROR')
    return await response.json()
  } catch (error) {
    console.error(`ERROR APIIIIIIII ${gameId}:`, error)
    throw error
  }
}*/

async function cargarGenero(){
  showLoader()

  try{
    const games = await fetchGames()
    const genres = [...new Set(games.map(g => g.genre))].sort()
    
    while (genreFilter.options.length > 1){ 
      genreFilter.remove(1)
    }
      genres.forEach(genre => {
      const option = document.createElement('option')
      option.value = genre
      option.textContent = genre
      genreFilter.appendChild(option)
    })
  }catch (error){
    console.error('Error al cargar generos:', error)

  }finally{
    hideLoader()
  }
}

/*cartas*/
function renderGames(games){
  if (!games.length) {
    cardContainer.innerHTML = '<div class="no-results" style="color: yellow;"><h2>NO SE ENCONTRARON JUEGOS CON ESTAS ESPECIFICACIONES</h2></div>';
    return;
  }

  cardContainer.innerHTML = '';
  games.forEach(game => {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.dataset.id = game.id;
    const releaseDate = new Date(game.release_date).toLocaleDateString();

    card.innerHTML =
      '<div class="game-thumbnail">' +
        '<img src="' + game.thumbnail + '" alt="' + game.title + '" loading="lazy">' +
      '</div>' +

      '<div class="game-info">' +
        '<h3>' + game.title + '</h3>' +
        '<p class="game-description">' + game.short_description + '</p>' +

        '<div class="game-meta">' +
          '<span class="game-genre">' + game.genre + '</span>' +
          '<span class="game-platform">' + game.platform + '</span>' +
          '<span class="game-date">Lanzamiento: ' + releaseDate + '</span>' +
        '</div>' +

        '<a href="#" class="view-details" data-id="' + game.id + '">Ver detalles</a>' +
      '</div>';

    cardContainer.appendChild(card);
    
    const viewDetailsBtn = card.querySelector('.view-details');
    viewDetailsBtn.addEventListener('click',(e) => {
      e.preventDefault();
      showGameDetails(game.id);
    });


    const thumbnail = card.querySelector('.game-thumbnail');
    thumbnail.addEventListener('click', () => {
      showGameDetails(game.id);
    });
    
  });
}



//FIltros
function inicializarEven(){
    applyFiltersBtn.addEventListener('click', applyFilters)
    resetFiltersBtn.addEventListener('click', resetFilters)
  }
function applyFilters() {
    showLoader();
setTimeout(() => {

const titleValue = titleFilter.value.toLowerCase().trim();
const platformValue = platformFilter.value;
const genreValue = genreFilter.value;

//el filtro con respecto a fechas fue complicado.
// no pude hacerlo, por lo que necesite ayuda de la IA

const dateFrom = dateFromFilter.value ? new Date(dateFromFilter.value) : null;
const dateTo = dateToFilter.value ? new Date(dateToFilter.value) : null;
    
const filteredGames = allGames.filter(game =>{
    if (titleValue && !game.title.toLowerCase().includes(titleValue)){
    return false;
  }
 if (platformValue && !game.platform.includes(platformValue)){
    return false;
  }
  if (genreValue && game.genre !== genreValue){
    return false;
  }

const gameDate = new Date(game.release_date);
if (dateFrom && gameDate < dateFrom) {
    return false;
  }
    if (dateTo && gameDate > dateTo) {
      return false;
      }
      return true;
    });


renderGames(filteredGames);
hideLoader();

    }, 500);
}

function resetFilters(){
    titleFilter.value ='';
    platformFilter.value = '';
    genreFilter.value='';
    dateFromFilter.value='';
    dateToFilter.value= '';

    showLoader();
    setTimeout(async() =>{
      try{
        allGames = await fetchGames();
        renderGames(allGames)
      } catch(error){
        showError('Error de carga')
      }finally {
        hideLoader();
      }
    }, 600);
}
//=====================
async function showGameDetails(gameId) {
  window.location.href = 'detalledejuego.html?id=' + gameId;
}