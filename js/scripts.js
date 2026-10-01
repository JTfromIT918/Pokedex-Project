console.log("Pokedéx Javscript Loaded!");

const pokemonSearchForm = document.querySelector("#pokemonSearchForm");

const pokemonSearchInput = document.querySelector("#pokemonSearchInput");

const searchResult = document.querySelector("#searchResult");

const pokemonModalLabel = document.querySelector("#pokemonModalLabel");

const overviewPane = document.querySelector("#overview-pane");

const statsPane = document.querySelector("#stats-pane");

const abilitiesPane = document.querySelector("#abilities-pane");


pokemonSearchForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const searchValue = pokemonSearchInput.value.trim().toLowerCase();

    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchValue}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {

        searchResult.innerHTML = `

                <div class="alert alert-danger" role="alert">
                      Pokémon not found. Try another search.
                </div>
        
        `;

        return;
    }

    const pokemonData = await response.json();

    console.log(pokemonData.abilities);

    console.log(pokemonData.sprites.other["official-artwork"].front_default);

    const pokemonName = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);

    pokemonModalLabel.textContent = `${pokemonName} Details`;

    const pokemonTypes = pokemonData.types.map(function(typeInfo) {

        return typeInfo.type.name;

    });

    const pokemonTypeText = pokemonTypes.join(" / ");

    const pokemonImage = pokemonData.sprites.other["official-artwork"].front_default;

    const pokemonHeight = pokemonData.height / 10;

    const pokemonWeight = pokemonData.weight / 10;

    const pokemonStats = pokemonData.stats.map(function(statInfo) {

        return `

            <p>${statInfo.stat.name}: ${statInfo.base_stat}</p>

            `;


    });

    const pokemonAbilities = pokemonData.abilities.map(function(abilityInfo) {

            return `

            <p>${abilityInfo.ability.name}</p>

            `;
    }); 

    const pokemonAbilitiesHtml = pokemonAbilities.join("");

    const pokemonStatsHtml = pokemonStats.join("");

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


overviewPane.innerHTML = `
        <img src="${pokemonImage}"
             class="img-fluid"
             alt="${pokemonName}">

        <p>Pokédex #: ${pokemonData.id}</p>

        <p>Type: ${pokemonTypeText}</p>

        <p>Height: ${pokemonHeight} m</p>

        <p>Weight: ${pokemonWeight} kg</p>

        

`;

statsPane.innerHTML = pokemonStatsHtml; 

abilitiesPane.innerHTML = pokemonAbilitiesHtml;











});


