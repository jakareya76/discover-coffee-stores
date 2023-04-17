const Hero = ({ buttonText, handleOnClick }) => {
  return (
    <section className="w-full pt-48 pb-32">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl uppercase font-mono text-zinc-300 font-bold md:text-5xl">
          Coffee Connoisseur
        </h1>
        <p className="text-zinc-300 font-semibold font-mono my-2">
          Discover your local coffee shops!
        </p>
        <button
          onClick={handleOnClick}
          className="px-8 py-4 mt-2 bg-zinc-800 rounded text-zinc-200 uppercase font-mono font-bold duration-200 hover:bg-zinc-950"
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
};

export default Hero;
