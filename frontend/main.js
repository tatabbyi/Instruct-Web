function fetchHello() {
  fetch('http://localhost:8081/api/hello')
    .then(response => response.text())
    .then(data => {
      const el = document.getElementById('backend-message');
      if (el) el.textContent = data;
    })
    .catch(error => console.error('Error:', error));
}

window.addEventListener('load', fetchHello);