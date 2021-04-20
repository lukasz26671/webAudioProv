document.addEventListener("DOMContentLoaded", ()=> {
    var convertBtn = document.querySelector('.convert-button');
    var URLinput = document.querySelector('.URL-input');

    convertBtn.addEventListener('click', () => {
        sendURL(URLinput.value);
    });
})

function sendURL(URL) {
    fetch(`http://localhost:3000/download?URL=${URL}`, {
        method:'GET'
    }).then(res => res.json());
}