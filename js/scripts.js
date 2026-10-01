console.log("Pokedéx Javscript Loaded!");

const pokemonSearchForm = document.querySelector("#pokemonSearchForm");

const pokemonSearchInput = document.querySelector("#pokemonSearchInput");

const searchResult = document.querySelector("#searchResult");

const pokemonModalLabel = document.querySelector("#pokemonModalLabel");


pokemonSearchForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const searchValue = pokemonSearchInput.value.trim().toLowerCase();

    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchValue}`;

    const response = await fetch(apiUrl);

    const pokemonData = await response.json();

    console.log(pokemonData.sprites.other["official-artwork"].front_default);

    const pokemonName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);

    pokemonModalLabel.textContent = `${pokemonName} Details`;

    const pokemonTypes = pokemonData.types.map(function(typeInfo) {

        return typeInfo.type.name;

    });

    const pokemonTypeText = pokemonTypes.join(" / ");

    const pokemonImage = pokemonData.sprites.other["official-artwork"].front_default;

    searchResult.innerHTML = `

        <div class="col-12 col-md-6 col-lg-4">

            <div class="card">

                <div class="card-body">

                    <h3 class="card-title">

                    ${pokemonName}

                    </h3>

                    <p class="card-text">

                        Pokédex #: ${pokemonData.id}

                    </p>

                    <p class="card-text">

                        Type: ${pokemonTypeText}

                    
                    </p>

                    <button class="btn btn-primary"
                            type="button"
                            data-bs-toggle="modal"
                            data-bs-target="#pokemonModal">

                            View Details

                    </button>

                    <img src="${pokemonImage}"
                         class="card-img-top"
                         alt="${pokemonName}">

                    

                        

                
                </div>
            
            </div>

        </div>

`;

    

});


