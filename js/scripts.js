console.log("Pokédex JavaScript Loaded!");


// ========================================
// DOM ELEMENTS
// ========================================

const pokemonSearchForm = document.querySelector("#pokemonSearchForm");

const pokemonSearchInput = document.querySelector("#pokemonSearchInput");

const searchResult = document.querySelector("#searchResult");

const pokemonModalLabel = document.querySelector("#pokemonModalLabel");

const overviewPane = document.querySelector("#overview-pane");

const statsPane = document.querySelector("#stats-pane");

const abilitiesPane = document.querySelector("#abilities-pane");

const pokemonGrid = document.querySelector("#pokemonGrid");


// ========================================
// SEARCH PAGE
// ========================================

if (pokemonSearchForm) {


    // ========================================
    // SEARCH FORM SUBMISSION
    // ========================================

    pokemonSearchForm.addEventListener("submit", async function(event) {

        event.preventDefault();


        // ========================================
        // GET SEARCH VALUE
        // ========================================

        const searchValue = pokemonSearchInput.value.trim().toLowerCase();


        // ========================================
        // EMPTY SEARCH VALIDATION
        // ========================================

        if (searchValue === "") {

            searchResult.innerHTML = `

                <div class="alert alert-warning" role="alert">

                    Please enter a Pokémon name or Pokédex number.

                </div>

            `;

            return;

        }


        // ========================================
        // FETCH POKÉMON FROM POKÉAPI
        // ========================================

        const apiUrl = `https://pokeapi.co/api/v2/pokemon/${searchValue}`;


        const response = await fetch(apiUrl);


        // ========================================
        // POKÉMON NOT FOUND
        // ========================================

        if (!response.ok) {

            searchResult.innerHTML = `

                <div class="alert alert-danger" role="alert">

                    Pokémon not found. Try another search.

                </div>

            `;

            return;

        }


        // ========================================
        // CONVERT API RESPONSE TO JAVASCRIPT DATA
        // ========================================

        const pokemonData = await response.json();


        // ========================================
        // PREPARE POKÉMON DISPLAY DATA
        // ========================================

        const pokemonName =
            pokemonData.name.charAt(0).toUpperCase() +
            pokemonData.name.slice(1);


        const pokemonTypes = pokemonData.types.map(function(typeInfo) {

            return typeInfo.type.name;

        });


        const pokemonTypeText = pokemonTypes.join(" / ");


        const pokemonImage =
            pokemonData.sprites.other["official-artwork"].front_default;


        const pokemonHeight = pokemonData.height / 10;

        const pokemonWeight = pokemonData.weight / 10;


        // ========================================
        // PREPARE SEARCH MODAL STATS
        // ========================================

        const pokemonStats = pokemonData.stats.map(function(statInfo) {

            return `

                <p>${statInfo.stat.name}: ${statInfo.base_stat}</p>

            `;

        });


        const pokemonStatsHtml = pokemonStats.join("");


        // ========================================
        // PREPARE SEARCH MODAL ABILITIES
        // ========================================

        const pokemonAbilities = pokemonData.abilities.map(function(abilityInfo) {

            return `

                <p>${abilityInfo.ability.name}</p>

            `;

        });


        const pokemonAbilitiesHtml = pokemonAbilities.join("");


        // ========================================
        // UPDATE SEARCH MODAL TITLE
        // ========================================

        pokemonModalLabel.textContent = `${pokemonName} Details`;


        // ========================================
        // BUILD SEARCH RESULT CARD
        // ========================================

        searchResult.innerHTML = `

            <div class="col-12 col-md-6 col-lg-4">

                <div class="card h-100">

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


        // ========================================
        // SEARCH MODAL - OVERVIEW TAB
        // ========================================

        overviewPane.innerHTML = `

            <img src="${pokemonImage}"
                 class="img-fluid"
                 alt="${pokemonName}">

            <p>Pokédex #: ${pokemonData.id}</p>

            <p>Type: ${pokemonTypeText}</p>

            <p>Height: ${pokemonHeight} m</p>

            <p>Weight: ${pokemonWeight} kg</p>

        `;


        // ========================================
        // SEARCH MODAL - STATS TAB
        // ========================================

        statsPane.innerHTML = pokemonStatsHtml;


        // ========================================
        // SEARCH MODAL - ABILITIES TAB
        // ========================================

        abilitiesPane.innerHTML = pokemonAbilitiesHtml;

    });

}


// ========================================
// DATABASE PAGE
// ========================================

if (pokemonGrid) {


    // ========================================
    // DATABASE STATE
    // ========================================

    let databasePokemon = [];


    const databaseApiUrl =
        "https://pokeapi.co/api/v2/pokemon?limit=25&offset=0";


    // ========================================
    // LOAD DATABASE POKÉMON
    // ========================================

    async function loadPokemonDatabase() {


        // ========================================
        // FETCH LIST OF 25 POKÉMON
        // ========================================

        const response = await fetch(databaseApiUrl);


        const pokemonListData = await response.json();


        // ========================================
        // FETCH FULL DETAILS FOR EACH POKÉMON
        // ========================================

        const pokemonDetailListPromises =
            pokemonListData.results.map(async function(pokemon) {


                const detailResponse = await fetch(pokemon.url);


                const pokemonDetails = await detailResponse.json();


                return pokemonDetails;

            });


        // ========================================
        // WAIT FOR ALL DETAIL REQUESTS
        // ========================================

        const pokemonDetails =
            await Promise.all(pokemonDetailListPromises);


        // ========================================
        // STORE POKÉMON FOR MODAL LOOKUP
        // ========================================

        databasePokemon = pokemonDetails;


        // ========================================
        // BUILD DATABASE CARDS
        // ========================================

        const pokemonCards = pokemonDetails.map(function(pokemon) {


            // ========================================
            // PREPARE CARD DATA
            // ========================================

            const pokemonName =
                pokemon.name.charAt(0).toUpperCase() +
                pokemon.name.slice(1);


            const pokemonId = pokemon.id;


            const pokemonImage =
                pokemon.sprites.other["official-artwork"].front_default;


            const pokemonTypes = pokemon.types.map(function(typeInfo) {

                return typeInfo.type.name;

            });


            const pokemonTypeText = pokemonTypes.join(" / ");


            // ========================================
            // RETURN DATABASE CARD HTML
            // ========================================

            return `

                <div class="col-12 col-md-6 col-lg-4">

                    <div class="card h-100">

                        <img src="${pokemonImage}"
                             class="card-img-top"
                             alt="${pokemonName}">

                        <div class="card-body">

                            <p>#${pokemonId}</p>

                            <h3 class="card-title">

                                ${pokemonName}

                            </h3>

                            <p class="card-text">

                                ${pokemonTypeText}

                            </p>

                            <button class="btn btn-primary pokemon-details-button"
                                    type="button"
                                    data-pokemon-id="${pokemonId}"
                                    data-bs-toggle="modal"
                                    data-bs-target="#pokemonModal">

                                View Details

                            </button>

                        </div>

                    </div>

                </div>

            `;

        });


        // ========================================
        // DISPLAY DATABASE CARDS
        // ========================================

        const pokemonCardsHtml = pokemonCards.join("");


        pokemonGrid.innerHTML = pokemonCardsHtml;

    }


    // ========================================
    // START DATABASE LOAD
    // ========================================

    loadPokemonDatabase();


    // ========================================
    // DATABASE DETAILS MODAL
    // ========================================

    pokemonGrid.addEventListener("click", function(event) {


        // ========================================
        // IDENTIFY DETAILS BUTTON
        // ========================================

        const detailsButton =
            event.target.closest(".pokemon-details-button");


        if (!detailsButton) {

            return;

        }


        // ========================================
        // GET CLICKED POKÉMON ID
        // ========================================

        const pokemonId = detailsButton.dataset.pokemonId;


        // ========================================
        // FIND SELECTED POKÉMON
        // ========================================

        const selectedPokemon =
            databasePokemon.find(function(pokemon) {

                return pokemon.id === Number(pokemonId);

            });


        // ========================================
        // PREPARE SELECTED POKÉMON DATA
        // ========================================

        const pokemonName =
            selectedPokemon.name.charAt(0).toUpperCase() +
            selectedPokemon.name.slice(1);


        const pokemonTypes =
            selectedPokemon.types.map(function(typeInfo) {

                return typeInfo.type.name;

            });


        const pokemonTypeText = pokemonTypes.join(" / ");


        const pokemonImage =
            selectedPokemon.sprites.other["official-artwork"].front_default;


        const pokemonHeight = selectedPokemon.height / 10;

        const pokemonWeight = selectedPokemon.weight / 10;


        // ========================================
        // DATABASE MODAL - TITLE
        // ========================================

        pokemonModalLabel.textContent = `${pokemonName} Details`;


        // ========================================
        // DATABASE MODAL - OVERVIEW TAB
        // ========================================

        overviewPane.innerHTML = `

            <img src="${pokemonImage}"
                 class="img-fluid"
                 alt="${pokemonName}">

            <p>Pokédex #: ${selectedPokemon.id}</p>

            <p>Type: ${pokemonTypeText}</p>

            <p>Height: ${pokemonHeight} m</p>

            <p>Weight: ${pokemonWeight} kg</p>

        `;


        // ========================================
        // DATABASE MODAL - STATS TAB
        // ========================================

        const pokemonStats = selectedPokemon.stats.map(function(statInfo)  {

            return `
            
                <p>${statInfo.stat.name}: ${statInfo.base_stat}</p>
                
                `;

        });


        const pokemonStatsHtml = pokemonStats.join("");

        statsPane.innerHTML = pokemonStatsHtml;


        // ========================================
        // DATABASE MODAL - ABILITIES TAB
        // ========================================

        const pokemonAbilities = selectedPokemon.abilities.map(function(abilityInfo)  {


            return `
            
                <p>${abilityInfo.ability.name}</p>
                
                
                `;
        });

        const pokemonAbilitiesHtml = pokemonAbilities.join("");

        abilitiesPane.innerHTML = pokemonAbilitiesHtml;

    });

}