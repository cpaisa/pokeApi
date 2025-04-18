let offset = 0; // desde dónde empezamos
const limit = 20; // cuántos Pokémon por página

const getTaks = () => {
  fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    .then((response) => response.json())
    .then((data) => {
      const container = document.querySelector(".card");
      container.innerHTML = ""; // limpiamos el contenido anterior

      if (data.results) {
        data.results.forEach((pokemon) => {
          fetch(pokemon.url)
            .then((res) => res.json())
            .then((pokeData) => {
              createCard(pokeData);
            });
        });
      }
    })
    .catch((error) => {
      console.error("Error en la petición:", error);
    });
};

const createCard = (pokemon) => {
  const container = document.querySelector(".card");

  const cardSection = document.createElement("section");
  cardSection.classList.add("card-section");

  const cardImg = document.createElement("div");
  cardImg.classList.add("card-img");
  const img = document.createElement("img");
  img.src = pokemon.sprites.front_default;
  img.alt = pokemon.name;
  cardImg.appendChild(img);

  const cardFooter = document.createElement("div");
  cardFooter.classList.add("card-footer");
  const h3 = document.createElement("h3");
  h3.textContent = pokemon.name;
  const h5 = document.createElement("h5");
  h5.textContent = `ID: ${pokemon.id}`;
  cardFooter.appendChild(h3);
  cardFooter.appendChild(h5);

  cardSection.appendChild(cardImg);
  cardSection.appendChild(cardFooter);

  container.appendChild(cardSection);
};

const paginationNext = () => {
  const buttonNext = document.getElementById("button_next");
  buttonNext.addEventListener("click", () => {
    offset += limit; // siguiente página
    getTaks(); // cargamos los nuevos Pokémon
  });
};

const paginationBack = () => {
  const buttonBack = document.getElementById("button_back");
  buttonBack.addEventListener("click", () => {
    if (offset >= limit) {
      offset -= limit; // página anterior
      getTaks(); // cargamos los nuevos Pokémon
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  paginationNext();
  paginationBack();
  getTaks();
});
