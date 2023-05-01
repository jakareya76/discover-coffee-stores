import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import useSWR from "swr";

import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { StoreContext } from "@/context/storeContext";
import { isEmpty, fetcher } from "@/utils";

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

const CoffeeStore = (initialProps) => {
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStores);
  const [votingCount, setVotingCount] = useState(0);

  const router = useRouter();
  const slug = router.query.slug;

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, voting, imgUrl, locality, address } = coffeeStore;

      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          locality: locality || "",
          address: address || "",
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStores)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((coffeStore) => {
          return coffeStore.id.toString() === slug;
        });

        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      // SSG
      handleCreateCoffeeStore(initialProps.coffeeStores);
    }
  }, [slug, initialProps.coffeeStores, initialProps]);

  const { name = "", address = "", locality = "", imgUrl = "" } = coffeeStore;

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${slug}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (router.isFallback) {
    return <h1 className="text-white text-xl">Loading...</h1>;
  }

  const handleUpVote = async () => {
    try {
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: slug }),
      });

      const dbCoffeeStore = await response.json();

      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        setVotingCount((preValue) => {
          return preValue + 1;
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
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
                "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
              }
              alt="img"
              width={450}
              height={450}
              className="object-cover rounded max-h-72"
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
              {locality && (
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
              )}
              <div className="flex space-x-2 py-2">
                <Image
                  src="/star.svg"
                  alt="img"
                  width={24}
                  height={24}
                  className="fill-zinc-400"
                />
                <p className="text-zinc-400 text-md font-semibold md:text-xl">
                  {votingCount}
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

export default CoffeeStore;
