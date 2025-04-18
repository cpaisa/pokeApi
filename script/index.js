const getTaks = () => {
    fetch('https://pokeapi.co/api/v2/pokemon')
    .then(response => response.json())
    .then(data => {
      console.log('Datos recibidos:', data.results);

    })
    .catch(error => {
      console.error('Error en la petición:', error);
      
    });
}

getTaks()