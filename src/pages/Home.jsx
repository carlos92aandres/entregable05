import React from "react";
import Footer from "../components/Footer";
import { setNameTrainer } from "../store/slices/nameTrainer.slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()
    const handleSubmit =(e) =>{
        e.preventDefault()
        setNameTrainer
        dispatch(setNameTrainer(e.target.nameTrainer.value))
        navigate("/pokedex")

    }
  return (
    <section className="min-h-screen grid grid-rows-[1fr_auto] items-center gap-">
      {/* Parte superior */}
      <section>
        <article>
          <div className="sm:flex sm:justify-center">
            <img src="/images/pokedex.png" alt="" />
          </div>
          <h2 className="text-center font-bold text-3xl text-red-500">Hi trainer!</h2>
          <p className="text-center font-semibold text-xl">Give me your name to start</p>
          <form className="flex justify-center  gap-2" onSubmit={handleSubmit}>
            <input  id="nameTrainer" placeholder="Your name..." type="text" className="my-4 shadow-md shadow-gray-200 h-10  outline-none sm:w-[350px]" />
            <button className="bg-red-500 h-10 my-4 px-3 font-semibold text-white hover:tracking-wider duration-200 hover:bg-red-500/80">lets start</button>
          </form>
        </article>
      </section>

      {/* footer */}
      <Footer />
    </section>
  );
};

export default Home;
