function fetchHello() {
    fetch('http://localhost:8080/api/hello')
        .then(response => response.text())
        .then(data => {
            document.getElementById('backend-message').textContent = data;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

window.onload = fetchHello;