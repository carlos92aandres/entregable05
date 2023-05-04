import React, { useEffect, useState } from "react";
import Header from "../components/pokedex/Header";
import { useSelector } from "react-redux";
import axios from "axios";
import PokemonCard from "../components/pokedex/PokemonCard";

const Pokedex = () => {
  //Todos los pokemons
  const [pokemons, setPokemons] = useState([]);
  //String que filtra lo pokemons por nombre
  const [pokemonName, setPokemonName] = useState("");
  //Arreglo de tipos de pokemons posibles
  const [types, setTypes] = useState([]);
  //string de tipo de pokemons pero cambia según el select
  const [currentType, setCurrentType] = useState("");
  //Página áctual
  const [currentPage, setCurrentPage] = useState(1); 


  //Estado global donde se almacena el nombre del usuario
  const nameTrainer = useSelector((store) => store.nameTrainer);
  const handleSubmit = (e) => {
    e.preventDefault();
    setPokemonName(e.target.pokemonName.value);
  };
  const pokemonsByname = pokemons.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(pokemonName.toLocaleLowerCase())
  );

  const paginationLogic = () => {
    //cantidad de pokemones por página
    const POKEMONS_PER_PAGE = 12;
    //Pokemones que se van a mostrat en la página áctual
    const sliceStart = (currentPage - 1) * POKEMONS_PER_PAGE;
    const sliceEnd = sliceStart + POKEMONS_PER_PAGE;

    const PokemonInPage = pokemonsByname.slice(sliceStart, sliceEnd);

    //última página
    const lastPage = Math.ceil(pokemonsByname.length / POKEMONS_PER_PAGE) || 1;

    //bloque áctual

    const PAGES_PER_BLOCK = 5;
    const actualBlock = Math.ceil(currentPage / PAGES_PER_BLOCK);

    //Páginas que se van a mostrar en el bloque áctual
    const pagesInBlock = [];
    const minPage = (actualBlock - 1) * PAGES_PER_BLOCK + 1;
    const maxPage = actualBlock * PAGES_PER_BLOCK;
    for (let i = minPage; i <= maxPage; i++) {
      if (i <= lastPage) {
        pagesInBlock.push(i);
      }
    }
    return { PokemonInPage, lastPage, pagesInBlock };
  };

  const { lastPage, pagesInBlock, PokemonInPage } = paginationLogic();

  const handleClickPreviusPage = () => {
    const newCurrentPage = currentPage - 1;
    if (newCurrentPage >= 1) {
      setCurrentPage(newCurrentPage);
    }
  };
  const handleClickNewPage = () => {
    const newCurrentPage = currentPage + 1;
    if (newCurrentPage <= lastPage) {
      setCurrentPage(newCurrentPage);
    }
  };

  useEffect(() => {
    if (!currentType) {
      const URL = "https://pokeapi.co/api/v2/pokemon?limit=1281";
      axios

        .get(URL)
        .then((res) => setPokemons(res.data.results))
        .catch((err) => console.log(err));
    }
  }, [currentType]);
  useEffect(() => {
    const URL = "https://pokeapi.co/api/v2/type";
    axios
      .get(URL)
      .then((res) => {
        const newTypes = res.data.results.map((type) => type.name);
        setTypes(newTypes);
      })
      .catch((err) => console.log(err));
  }, []);
  useEffect(() => {
    if (currentType) {
      const URL = `https://pokeapi.co/api/v2/type/${currentType}`;

      axios

        .get(URL)
        .then((res) => {
          const pokemonsByType = res.data.pokemon.map(
            (pokemon) => pokemon.pokemon
          );
          setPokemons(pokemonsByType);
        })
        .catch((err) => console.log(err));
    }
  }, [currentType]);
  useEffect(() => {
    setCurrentPage(1)
  }, [pokemonName, currentType]);
  return (
    <section className="min-h-screen">
      <Header />
      {/* Seccion de filtro y saludo */}
      <section className="py-6 px-2">
        <h3 className="font-medium">
          Welcome <span className="text-red-500"> {nameTrainer}</span>, here you
          can find your favorite pokemons{" "}
        </h3>
        <form className="sm:flex sm:justify-around" onSubmit={handleSubmit}>
          <div className="flex gap-1 sm:mt-6">
            <input
              className="my-2 shadow-gray-500/50 p-2 shadow-md sm:w-72"
              type="text"
              id="pokemonName"
              placeholder="Search yout pokemon..."
            />
            <button className="bg-red-500 px-4 p-2 text-white font-semibold my-2 hover:tracking-wider duration-200 hover:bg-red-500/80 sm:w-32">
              Search
            </button>
          </div>
          <select
            onChange={(e) => setCurrentType(e.target.value)}
            name=""
            id=""
          >
            <option value="">All</option>
            {types.map((type) => (
              <option className="capitalize" key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </form>
      </section>
     

      {/* seccion lista de pokemons */}
      <section className="px-2 grid gap-6 grid-cols-[repeat(auto-fill,_280px)] place-content-center">
        {PokemonInPage.map((pokemon) => (
          <PokemonCard key={pokemon.url} pokemonUrl={pokemon.url} />
        ))}
      </section>
       {/* Paginación  */}

       <ul className="flex gap-2 justify-center py-4 flex-wrap px-2 ">
        {/* Página anterior */}
        <li
          onClick={() => setCurrentPage(1)}
          className="p-3 bg-red-600 font-bold text-white rounded-md cursor-pointer"
        >
          {"<<"}
        </li>
        <li
          onClick={handleClickPreviusPage}
          className="p-3 bg-red-600 font-bold text-white rounded-md cursor-pointer"
        >
          {"<"}
        </li>
        {/* lista de paginacion */}
        {pagesInBlock.map((numberPage) => (
          <li
            onClick={() => setCurrentPage(numberPage)}
            className={`p-3 bg-red-600 font-bold text-white rounded-md cursor-pointer ${
              numberPage === currentPage && "bg-red-400"
            } `}
            key={numberPage}
          >
            {numberPage}
          </li>
        ))}
        <li
          onClick={handleClickNewPage}
          className="p-3 bg-red-600 font-bold text-white rounded-md cursor-pointer"
        >
          {/* Pagina siguiente */}
          {">"}
        </li>
        {/* última página */}
        <li
          onClick={() => setCurrentPage(lastPage)}
          className="p-3 bg-red-600 font-bold text-white rounded-md cursor-pointer"
        >
          {/* Pagina siguiente */}
          {">>"}
        </li>
      </ul>
    </section>
  );
};

export default Pokedex;
