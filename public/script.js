document.getElementById('nameForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = document.getElementById('nameInput').value;
  
    const response = await fetch('/api/save-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    });
  
    const result = await response.json();
    document.getElementById('responseMessage').textContent = result.message;
  });
  