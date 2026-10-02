console.log("Pokédex JavaScript Loaded!");

// ========================================
// DOM ELEMENTS
// ========================================

const pokemonSearchForm =
    document.querySelector("#pokemonSearchForm");
const pokemonSearchInput =
    document.querySelector("#pokemonSearchInput");
const searchResult =
    document.querySelector("#searchResult");
const pokemonModalLabel =
    document.querySelector("#pokemonModalLabel");
const overviewPane =
    document.querySelector("#overview-pane");
const statsPane =
    document.querySelector("#stats-pane");
const abilitiesPane =
    document.querySelector("#abilities-pane");
const pokemonGrid =
    document.querySelector("#pokemonGrid");
const pageSizeDropdown =
    document.querySelector("#pageSizeDropdown");
const pageSizeOptions =
    document.querySelectorAll(".page-size-option");
const previousPageButton =
    document.querySelector("#previousPageButton");
const currentPageDisplay =
    document.querySelector("#currentPageDisplay");
const nextPageButton =
    document.querySelector("#nextPageButton");
const featuredPokemonSlides =
    document.querySelector("#featuredPokemonSlides");

// ========================================
// HOME PAGE
// ========================================

if (featuredPokemonSlides) {
    // ========================================
    // DAILY FEATURED POKEMON
    // ========================================

    const today = new Date();

    const dailySeed =
        today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate();

    console.log("Daily Pokémon seed:", dailySeed);

    const featuredPokemonIds = [];

    for (let i = 0; i < 3; i++) {
        const pokemonId =
            ((dailySeed * (i + 1) * 37) % 1025) + 1;

        featuredPokemonIds.push(pokemonId);
    }

    console.log(
        "Featured Pokémon IDs:",
        featuredPokemonIds
    );

    // ========================================
    // LOAD FEATURED POKEMON
    // ========================================

    async function loadFeaturedPokemon() {
        const pokemonRequests =
            featuredPokemonIds.map((pokemonId) => {
                return fetch(
                    `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
                )
                    .then((response) => response.json());
            });

        const featuredPokemon =
            await Promise.all(pokemonRequests);

        console.log(
            "Featured Pokémon Data:",
            featuredPokemon
        );

        // ========================================
        // BUILD CAROUSEL SLIDES
        // ========================================

        featuredPokemon.forEach((pokemon, index) => {
            const pokemonName =
                pokemon.name.charAt(0).toUpperCase() +
                pokemon.name.slice(1);

            const pokemonTypes =
                pokemon.types
                    .map((typeInfo) => typeInfo.type.name)
                    .join(" • ");

            const pokemonImage =
                pokemon.sprites.other["official-artwork"].front_default;

            const activeClass =
                index === 0 ? "active" : "";

            featuredPokemonSlides.innerHTML += `
                <div class="carousel-item ${activeClass}">
                    <div class="container py-4">
                        <div class="row align-items-center">
                            <div class="col-md-5 text-center">
                                <img src="${pokemonImage}"
                                     alt="${pokemonName}"
                                     class="img-fluid"
                                     style="max-height: 300px;">
                            </div>
                            <div class="col-md-7 text-center text-md-start">
                                <p class="text-uppercase fw-bold mb-1">
                                    Featured Pokémon
                                </p>
                                <h3 class="display-6 fw-bold">
                                    #${pokemon.id}
                                    ${pokemonName}
                                </h3>
                                <p class="lead">
                                    ${pokemonTypes}
                                </p>
                                <button class="btn btn-dark featured-details-button"
                                        type="button"
                                        data-pokemon-id="${pokemon.id}"
                                        data-bs-toggle="modal"
                                        data-bs-target="#pokemonModal">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        // ========================================
        // FEATURED POKEMON DETAILS
        // ========================================

        featuredPokemonSlides.addEventListener(
            "click",
            function (event) {
                const detailsButton =
                    event.target.closest(".featured-details-button");

                if (!detailsButton) {
                    return;
                }

                // Get the Pokémon ID stored on the button

                const pokemonId =
                    Number(detailsButton.dataset.pokemonId);

                // Find that Pokémon in our featured Pokémon array

                const selectedPokemon =
                    featuredPokemon.find(function (pokemon) {
                        return pokemon.id === pokemonId;
                    });

                if (!selectedPokemon) {
                    return;
                }

                // ========================================
                // PREPARE POKEMON DATA
                // ========================================

                const pokemonName =
                    selectedPokemon.name.charAt(0).toUpperCase() +
                    selectedPokemon.name.slice(1);

                const pokemonTypes =
                    selectedPokemon.types.map(function (typeInfo) {
                        return typeInfo.type.name;
                    });

                const pokemonTypeText =
                    pokemonTypes.join(" / ");

                const pokemonImage =
                    selectedPokemon.sprites.other["official-artwork"].front_default;

                const pokemonHeight =
                    selectedPokemon.height / 10;

                const pokemonWeight =
                    selectedPokemon.weight / 10;

                // ========================================
                // MODAL TITLE
                // ========================================

                pokemonModalLabel.textContent =
                    `${pokemonName} Details`;

                // ========================================
                // OVERVIEW TAB
                // ========================================

                overviewPane.innerHTML = `
                    <div class="text-center">
                        <img src="${pokemonImage}"
                             class="img-fluid"
                             alt="${pokemonName}"
                             style="max-height: 300px;">
                    </div>
                    <p>
                        Pokédex #: ${selectedPokemon.id}
                    </p>
                    <p>
                        Type: ${pokemonTypeText}
                    </p>
                    <p>
                        Height: ${pokemonHeight} m
                    </p>
                    <p>
                        Weight: ${pokemonWeight} kg
                    </p>
                `;

                // ========================================
                // STATS TAB
                // ========================================

                const pokemonStats =
                    selectedPokemon.stats.map(function (statInfo) {
                        return `
                            <p>
                                ${statInfo.stat.name}:
                                ${statInfo.base_stat}
                            </p>
                        `;
                    });

                statsPane.innerHTML =
                    pokemonStats.join("");

                // ========================================
                // ABILITIES TAB
                // ========================================

                const pokemonAbilities =
                    selectedPokemon.abilities.map(function (abilityInfo) {
                        return `
                            <p>
                                ${abilityInfo.ability.name}
                            </p>
                        `;
                    });

                abilitiesPane.innerHTML =
                    pokemonAbilities.join("");
            }
        );
    }

    loadFeaturedPokemon();
}

// ========================================
// SEARCH PAGE
// ========================================

if (pokemonSearchForm) {
    // ========================================
    // SEARCH FORM SUBMISSION
    // ========================================

    pokemonSearchForm.addEventListener(
        "submit",
        async function (event) {
            event.preventDefault();

            // ========================================
            // GET SEARCH VALUE
            // ========================================

            const searchValue =
                pokemonSearchInput.value.trim().toLowerCase();

            // ========================================
            // EMPTY SEARCH VALIDATION
            // ========================================

            if (searchValue === "") {
                searchResult.innerHTML = `
                    <div class="alert alert-warning"
                         role="alert">
                        Please enter a Pokémon name or Pokédex number.
                    </div>
                `;

                return;
            }

            // ========================================
            // FETCH POKEMON FROM POKEAPI
            // ========================================

            const apiUrl =
                `https://pokeapi.co/api/v2/pokemon/${searchValue}`;

            const response =
                await fetch(apiUrl);

            // ========================================
            // POKEMON NOT FOUND
            // ========================================

            if (!response.ok) {
                searchResult.innerHTML = `
                    <div class="alert alert-danger"
                         role="alert">
                        Pokémon not found. Try another search.
                    </div>
                `;

                return;
            }

            // ========================================
            // CONVERT API RESPONSE TO JAVASCRIPT DATA
            // ========================================

            const pokemonData =
                await response.json();

            // ========================================
            // PREPARE POKEMON DISPLAY DATA
            // ========================================

            const pokemonName =
                pokemonData.name.charAt(0).toUpperCase() +
                pokemonData.name.slice(1);

            const pokemonTypes =
                pokemonData.types.map(function (typeInfo) {
                    return typeInfo.type.name;
                });

            const pokemonTypeText =
                pokemonTypes.join(" / ");

            const pokemonImage =
                pokemonData.sprites.other["official-artwork"].front_default;

            const pokemonHeight =
                pokemonData.height / 10;

            const pokemonWeight =
                pokemonData.weight / 10;

            // ========================================
            // PREPARE SEARCH MODAL STATS
            // ========================================

            const pokemonStats =
                pokemonData.stats.map(function (statInfo) {
                    return `
                        <p>
                            ${statInfo.stat.name}:
                            ${statInfo.base_stat}
                        </p>
                    `;
                });

            const pokemonStatsHtml =
                pokemonStats.join("");

            // ========================================
            // PREPARE SEARCH MODAL ABILITIES
            // ========================================

            const pokemonAbilities =
                pokemonData.abilities.map(function (abilityInfo) {
                    return `
                        <p>
                            ${abilityInfo.ability.name}
                        </p>
                    `;
                });

            const pokemonAbilitiesHtml =
                pokemonAbilities.join("");

            // ========================================
            // UPDATE SEARCH MODAL TITLE
            // ========================================

            pokemonModalLabel.textContent =
                `${pokemonName} Details`;

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
                <p>
                    Pokédex #: ${pokemonData.id}
                </p>
                <p>
                    Type: ${pokemonTypeText}
                </p>
                <p>
                    Height: ${pokemonHeight} m
                </p>
                <p>
                    Weight: ${pokemonWeight} kg
                </p>
            `;

            // ========================================
            // SEARCH MODAL - STATS TAB
            // ========================================

            statsPane.innerHTML =
                pokemonStatsHtml;

            // ========================================
            // SEARCH MODAL - ABILITIES TAB
            // ========================================

            abilitiesPane.innerHTML =
                pokemonAbilitiesHtml;
        }
    );
}

// ========================================
// DATABASE PAGE
// ========================================

if (pokemonGrid) {
    // ========================================
    // DATABASE STATE
    // ========================================

    let databasePokemon = [];

    let pageSize = 25;

    let currentPage = 1;

    let hasNextPage = true;

    // ========================================
    // LOAD DATABASE POKEMON
    // ========================================

    async function loadPokemonDatabase() {
        try {
            // ========================================
            // START DATABASE LOAD
            // ========================================

            pokemonGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="spinner-border text-primary"
                         role="status">
                        <span class="visually-hidden">
                            Loading Pokémon...
                        </span>
                    </div>
                    <p class="mt-3">
                        Loading Pokémon...
                    </p>
                </div>
            `;

            const offset =
                (currentPage - 1) * pageSize;

            // ========================================
            // BUILD DATABASE API URL
            // ========================================

            const databaseApiUrl =
                `https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`;

            // ========================================
            // FETCH LIST OF POKEMON
            // ========================================

            const response =
                await fetch(databaseApiUrl);

            const pokemonListData =
                await response.json();

            hasNextPage =
                pokemonListData.next !== null;

            updatePaginationControls();

            // ========================================
            // FETCH FULL DETAILS FOR EACH POKEMON
            // ========================================

            const pokemonDetailListPromises =
                pokemonListData.results.map(
                    async function (pokemon) {
                        const detailResponse =
                            await fetch(pokemon.url);

                        const pokemonDetails =
                            await detailResponse.json();

                        return pokemonDetails;
                    }
                );

            // ========================================
            // WAIT FOR ALL DETAIL REQUESTS
            // ========================================

            const pokemonDetails =
                await Promise.all(
                    pokemonDetailListPromises
                );

            // ========================================
            // STORE POKEMON FOR MODAL LOOKUP
            // ========================================

            databasePokemon =
                pokemonDetails;

            // ========================================
            // BUILD DATABASE CARDS
            // ========================================

            const pokemonCards =
                pokemonDetails.map(function (pokemon) {
                    // ========================================
                    // PREPARE CARD DATA
                    // ========================================

                    const pokemonName =
                        pokemon.name.charAt(0).toUpperCase() +
                        pokemon.name.slice(1);

                    const pokemonId =
                        pokemon.id;

                    const pokemonImage =
                        pokemon.sprites.other["official-artwork"].front_default;

                    const pokemonTypes =
                        pokemon.types.map(function (typeInfo) {
                            return typeInfo.type.name;
                        });

                    const pokemonTypeText =
                        pokemonTypes.join(" / ");

                    // ========================================
                    // RETURN DATABASE CARD HTML
                    // ========================================

                    return `
                        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div class="card h-100">
                                <img src="${pokemonImage}"
                                     class="card-img-to p-3"
                                     alt="${pokemonName}"
                                     style="height: 200px; object-fit: contain;">
                                <div class="card-body pt-0">
                                    <p>
                                        #${pokemonId}
                                    </p>
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

            const pokemonCardsHtml =
                pokemonCards.join("");

            pokemonGrid.innerHTML =
                pokemonCardsHtml;
        } catch (error) {
            console.error(
                "Database loading error:",
                error
            );

            pokemonGrid.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center"
                         role="alert">
                        Unable to load the Pokémon database.
                        Please try again.
                    </div>
                </div>
            `;
        }
    }

    // ========================================
    // START DATABASE LOAD
    // ========================================

    loadPokemonDatabase();

    // ========================================
    // PAGE SIZE DROPDOWN
    // ========================================

    pageSizeOptions.forEach(function (option) {
        option.addEventListener(
            "click",
            function () {
                // Get the selected page size

                pageSize =
                    Number(option.dataset.pageSize);

                currentPage = 1;

                updatePaginationControls();

                // Update the dropdown button text

                pageSizeDropdown.textContent =
                    `Show ${pageSize} Pokémon`;

                // Reload the database with the page size

                loadPokemonDatabase();
            }
        );
    });

    // ========================================
    // UPDATE PAGINATION CONTROLS
    // ========================================

    function updatePaginationControls() {
        currentPageDisplay.textContent =
            currentPage;

        if (currentPage === 1) {
            previousPageButton.disabled =
                true;

            previousPageButton.parentElement
                .classList.add("disabled");
        } else {
            previousPageButton.disabled =
                false;

            previousPageButton.parentElement
                .classList.remove("disabled");
        }

        if (hasNextPage === false) {
            nextPageButton.disabled =
                true;

            nextPageButton.parentElement
                .classList.add("disabled");
        } else {
            nextPageButton.disabled =
                false;

            nextPageButton.parentElement
                .classList.remove("disabled");
        }
    }

    // ========================================
    // NEXT PAGE BUTTON
    // ========================================

    nextPageButton.addEventListener(
        "click",
        function () {
            currentPage =
                currentPage + 1;

            updatePaginationControls();

            loadPokemonDatabase();
        }
    );

    // ========================================
    // PREVIOUS PAGE BUTTON
    // ========================================

    previousPageButton.addEventListener(
        "click",
        function () {
            if (currentPage === 1) {
                return;
            }

            currentPage =
                currentPage - 1;

            updatePaginationControls();

            loadPokemonDatabase();
        }
    );

    // ========================================
    // INITIALIZE PAGINATION CONTROLS
    // ========================================

    updatePaginationControls();

    // ========================================
    // DATABASE DETAILS MODAL
    // ========================================

    pokemonGrid.addEventListener(
        "click",
        function (event) {
            // ========================================
            // IDENTIFY DETAILS BUTTON
            // ========================================

            const detailsButton =
                event.target.closest(
                    ".pokemon-details-button"
                );

            if (!detailsButton) {
                return;
            }

            // ========================================
            // GET CLICKED POKEMON ID
            // ========================================

            const pokemonId =
                detailsButton.dataset.pokemonId;

            // ========================================
            // FIND SELECTED POKEMON
            // ========================================

            const selectedPokemon =
                databasePokemon.find(
                    function (pokemon) {
                        return pokemon.id ===
                            Number(pokemonId);
                    }
                );

            // ========================================
            // PREPARE SELECTED POKEMON DATA
            // ========================================

            const pokemonName =
                selectedPokemon.name.charAt(0).toUpperCase() +
                selectedPokemon.name.slice(1);

            const pokemonTypes =
                selectedPokemon.types.map(
                    function (typeInfo) {
                        return typeInfo.type.name;
                    }
                );

            const pokemonTypeText =
                pokemonTypes.join(" / ");

            const pokemonImage =
                selectedPokemon.sprites.other["official-artwork"].front_default;

            const pokemonHeight =
                selectedPokemon.height / 10;

            const pokemonWeight =
                selectedPokemon.weight / 10;

            // ========================================
            // DATABASE MODAL - TITLE
            // ========================================

            pokemonModalLabel.textContent =
                `${pokemonName} Details`;

            // ========================================
            // DATABASE MODAL - OVERVIEW TAB
            // ========================================

            overviewPane.innerHTML = `
                <img src="${pokemonImage}"
                     class="img-fluid"
                     alt="${pokemonName}">
                <p>
                    Pokédex #: ${selectedPokemon.id}
                </p>
                <p>
                    Type: ${pokemonTypeText}
                </p>
                <p>
                    Height: ${pokemonHeight} m
                </p>
                <p>
                    Weight: ${pokemonWeight} kg
                </p>
            `;

            // ========================================
            // DATABASE MODAL - STATS TAB
            // ========================================

            const pokemonStats =
                selectedPokemon.stats.map(
                    function (statInfo) {
                        return `
                            <p>
                                ${statInfo.stat.name}:
                                ${statInfo.base_stat}
                            </p>
                        `;
                    }
                );

            const pokemonStatsHtml =
                pokemonStats.join("");

            statsPane.innerHTML =
                pokemonStatsHtml;

            // ========================================
            // DATABASE MODAL - ABILITIES TAB
            // ========================================

            const pokemonAbilities =
                selectedPokemon.abilities.map(
                    function (abilityInfo) {
                        return `
                            <p>
                                ${abilityInfo.ability.name}
                            </p>
                        `;
                    }
                );

            const pokemonAbilitiesHtml =
                pokemonAbilities.join("");

            abilitiesPane.innerHTML =
                pokemonAbilitiesHtml;
        }
    );
}