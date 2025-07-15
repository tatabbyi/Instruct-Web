function fetchHello() {
    fetch('http://localhost:8081/api/hello')
        .then(response => response.text())
        .then(data => {
            document.getElementById('backend-message').textContent = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.onload = fetchHello;
function LoadCopingSuggestions(emotion) {
    fetch(`http://localhost:8081/api/coping?emotion=${encodeURIComponent(emotion)}`)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('coping-suggestions');
            container.innerHTML = '';
            data.forEach(strategy => {
                const div = document.createElement.createElement('div');
                div.className = 'coping-strategy';
                div.textContent = strategy;
                container.appendChild(div);
            })
        })
        .catch(error => {
            console.error('Error fetching coping strategies:', error);
        });
}

document.querySelectorAll('.emotion-card').forEach(card => {
    card.addEventListener('click', function() {
        const emotion = this.getAttribute('data-emotion');
        LoadCopingSuggestions(emotion);
    });
});