let offset = 0; // desde dónde empezamos
const limit = 20; // cuántos Pokémon por página

const getTaks = () => {
  showLoader();
  fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    .then((response) => response.json())
    .then((data) => {
      const container = document.querySelector(".card");
      container.innerHTML = ""; // limpiamos el contenido anterior

      if (data.results) {
        const promises = data.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        );

        Promise.all(promises)
          .then((pokemons) => {
            pokemons.forEach(createCard);
            hideLoader();
          });
      } else {
        hideLoader();
      }
    })
    .catch((error) => {
      console.error("Error en la petición:", error);
      hideLoader();
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
const searchButton = () => {
  const buttonSearch = document.getElementById("button_nuevo");
  const valueInput = document.getElementById("search_pokemon");

  buttonSearch.addEventListener("click", async () => {
    const searchText = valueInput.value.toLowerCase().trim();
    const container = document.querySelector(".card");

    if (!searchText) {
      getTaks();
      return;
    }

    container.innerHTML = ""; // Limpiar resultados anteriores
    showLoader();

    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10000`);
      const data = await response.json();

      const filtered = data.results.filter(pokemon =>
        pokemon.name.startsWith(searchText)
      );

      if (filtered.length === 0) {
        const errorMsg = document.createElement("p");
        errorMsg.textContent = "No se encontraron Pokémon que coincidan.";
        errorMsg.style.color = "red";
        container.appendChild(errorMsg);
        hideLoader();
        return;
      }

      const promises = filtered.map(poke =>
        fetch(poke.url).then(res => res.json())
      );

      const results = await Promise.all(promises);
      results.forEach(createCard);
      hideLoader();

    } catch (error) {
      console.error("Error en la búsqueda:", error);
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Ocurrió un error al buscar Pokémon.";
      errorMsg.style.color = "red";
      container.appendChild(errorMsg);
      hideLoader();
    }
  });
};


const showLoader = () => {
  document.getElementById("loader").classList.remove("hidden");
};

const hideLoader = () => {
  document.getElementById("loader").classList.add("hidden");
};

document.addEventListener("DOMContentLoaded", () => {
  paginationNext();
  paginationBack();
  getTaks();
  searchButton();
});
