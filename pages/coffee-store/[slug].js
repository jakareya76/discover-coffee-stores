import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { StoreContext } from "@/context/storeContext";
import { isEmpty } from "@/utils";

export const getStaticProps = async (context) => {
  const params = context.params;
  const coffeeStores = await fetchCoffeeStores();

  const findCoffeeStoreById = coffeeStores.find((coffeStore) => {
    return coffeStore.id === params.slug;
  });

  return {
    props: {
      coffeeStores: findCoffeeStoreById ? findCoffeeStoreById : {},
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

const slug = (initialProps) => {
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStores);

  const router = useRouter();
  const slug = router.query.slug;

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStores)) {
      if (coffeeStores.length > 0) {
        const findCoffeeStoreById = coffeeStores.find((coffeStore) => {
          return coffeStore.id === slug;
        });
        setCoffeeStore(findCoffeeStoreById);
      }
    }
  }, [slug]);

  const handleUpVote = () => {
    console.log("Up Vote");
  };

  const { name, address, imgUrl, locality } = coffeeStore;

  if (router.isFallback) {
    return <h1 className="text-white text-xl">Loading...</h1>;
  }

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
              src={
                imgUrl ||
                "https://images.unsplash.com/photo-1493857671505-72967e2e2760?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
              }
              alt="img"
              width={420}
              height={260}
              className="max-h-[360px] w-full object-cover rounded md:w-[500px]"
            />
            <div className="w-full md:w-1/2">
              <div className="flex space-x-2 py-2">
                <Image
                  src="/location.svg"
                  alt="img"
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
                  src="/near.svg"
                  alt="img"
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
                  src="/star.svg"
                  alt="img"
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
