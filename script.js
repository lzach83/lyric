const form = document.getElementById('form')
const search = document.getElementById('search')
const result = document.getElementById('result')
const more = document.getElementById('more')
const h1 = document.querySelector('h1');

const apiURL = 'https://api.lyrics.ovh';

//Search by song or artist
async function searchSongs(term) {
    const res = await fetch((`${apiURL}/suggest/${term}`))
    const data =await res.json();

    showData(data);
}

//get Lyrics
async function getLyrics(artist, songTitle){
    const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`)

    const data = await res.json();

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');

    result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2><span>${lyrics}</span>`;

    more.innerHTML = '';
}
//Show data in DOM
function showData(data) {
    let outPut = '';

    data.data.forEach(song =>{
        outPut += `
<li>
<span><strong>${song.artist.name}</strong>- ${song.title}</span>
<button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
</li>`
    });

    result.innerHTML =`
    <ul class="songs"> 
        ${outPut}
    </ul>
    `;

    if(data.prev || data.next) {
        more.innerHTML = `
        ${data.prev ? `<button class='btn' onClick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
        ${data.next ? `<button class='btn' onClick="getMoreSongs('${data.next}')">Next</button>` : ''}
        `;
    } else {
        more.innerHTML = '';
    }
}

//get prev and next data pagination
async function getMoreSongs(url){
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    const data =await res.json();

    showData(data);
}

//event listeners
form.addEventListener('submit', e => {
    e.preventDefault();
    const searchTerm = search.value.trim();

    if(!searchTerm) {
        alert('Please search');
    } else {
        searchSongs(searchTerm);
    }
})

//Get lyrics
result.addEventListener('click', ev => {
    const clickedEl = ev.target;

    if(clickedEl.tagName === 'BUTTON'){
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');

        getLyrics(artist, songTitle);
    }
});


