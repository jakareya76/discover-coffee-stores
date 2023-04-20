import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import { fetchCoffeeStores } from "../../lib/coffee-stores";

export const getStaticProps = async (context) => {
  const params = context.params;
  const coffeeStores = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores: coffeeStores.find((coffeStore) => {
        return coffeStore.id === params.slug;
      }),
    },
  };
};

export const getStaticPaths = async () => {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        slug: coffeeStore.id,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

const slug = ({ coffeeStores }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <h1 className="text-white text-xl">Loading...</h1>;
  }

  const handleUpVote = () => {
    console.log("Up Vote");
  };

  const { name, address, imgUrl, locality } = coffeeStores;

  return (
    <>
      <Head>
        <title>{name}</title>
      </Head>
      <main className="container mx-auto flex flex-col justify-center py-20 md:py-44">
        <div className="w-full flex">
          <Link href="/">
            <button className="bg-zinc-800 px-6 py-4 text-zinc-400 font-semibold rounded-md mx-5">
              Back To Home
            </button>
          </Link>
        </div>
        <div className="bg-zinc-800 my-10 py-12 px-8 mx-5">
          <h1 className="text-4xl text-center underline mb-8 text-zinc-400">
            {name}
          </h1>
          <div className="flex flex-col items-center justify-center gap-10 py-10 md:flex-row">
            <Image
              src={imgUrl}
              alt="img"
              width={420}
              height={260}
              className="max-h-[360px] w-full object-cover rounded md:w-[500px]"
            />
            <div className="w-full md:w-1/2">
              <div className="flex space-x-2 py-2">
                <Image
                  src="/svg/location.svg"
                  width={24}
                  height={24}
                  className="fill-zinc-400"
                />
                <p className="text-zinc-400 text-md font-semibold md:text-xl">
                  {address}
                </p>
              </div>
              <div className="flex space-x-2 py-2">
                <Image
                  src="/svg/near.svg"
                  width={24}
                  height={24}
                  className="fill-zinc-400"
                />
                <p className="text-zinc-400 text-md font-semibold md:text-xl">
                  {locality}
                </p>
              </div>
              <div className="flex space-x-2 py-2">
                <Image
                  src="/svg/star.svg"
                  width={24}
                  height={24}
                  className="fill-zinc-400"
                />
                <p className="text-zinc-400 text-md font-semibold md:text-xl">
                  1
                </p>
              </div>
              <button
                onClick={handleUpVote}
                className="px-12 py-4 bg-zinc-900 text-zinc-400 text-xl font-semibold rounded-md mt-10 duration-200 hover:bg-zinc-950"
              >
                Vote Up
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default slug;
