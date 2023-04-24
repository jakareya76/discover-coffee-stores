import Head from "next/head";
import { useEffect, useState } from "react";

import Hero from "../components/Hero";
import Card from "@/components/Card";

import { fetchCoffeeStores } from "../lib/coffee-stores";
import useTrackLocation from "@/hooks/useTrackLocation";

export const getStaticProps = async () => {
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    },
  };
};

const Home = ({ coffeeStores }) => {
  const [localCoffeeStore, setLocalCoffeeStore] = useState("");
  const [localCoffeeStoreError, setLocalCoffeeStoreError] = useState(null);

  const { handleTrackLocation, latLong, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  useEffect(() => {
    const fetchingCoffeeStores = async () => {
      if (latLong) {
        try {
          const fetchedCoffeeStores = await fetchCoffeeStores(latLong, 30);
          setLocalCoffeeStore(fetchedCoffeeStores);
        } catch (error) {
          setLocalCoffeeStoreError(error.message);
        }
      }
    };

    fetchingCoffeeStores();
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  return (
    <>
      <Head>
        <title>COFFEE CONNOISSEUR</title>
      </Head>
      {locationErrorMsg && (
        <p className="text-center text-xl text-white capitalize font-semibold bg-red-500 p-4 ">
          {locationErrorMsg}
        </p>
      )}
      {localCoffeeStoreError && (
        <p className="text-center text-xl text-white capitalize font-semibold bg-red-500 p-4 ">
          {localCoffeeStoreError}
        </p>
      )}
      <main className="container mx-auto">
        <Hero
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnBannerBtnClick}
        />

        {localCoffeeStore && (
          <div className="flex items-center flex-col py-10">
            {localCoffeeStore ? (
              <div className="w-full flex items-center justify-center">
                <h2 className="text-4xl font-mono font-bold text-zinc-300 mb-10 underline">
                  Stores Near me
                </h2>
              </div>
            ) : null}
            <div className="grid grid-cols-1 place-items-center gap-10 md:grid-cols-2 lg:grid-cols-3">
              {localCoffeeStore.map((coffeeStore) => {
                return (
                  <Card
                    name={coffeeStore.name}
                    img={coffeeStore.imgUrl}
                    url={`/coffee-store/${coffeeStore.id}`}
                    key={coffeeStore.id}
                  />
                );
              })}
            </div>
          </div>
        )}
        <div className="flex items-center flex-col py-10">
          {coffeeStores.length > 0 ? (
            <div className="w-full flex items-center justify-center">
              <h2 className="text-4xl font-mono font-bold text-zinc-300 mb-10 underline">
                Toronto Stores
              </h2>
            </div>
          ) : null}
          <div className="grid grid-cols-1 place-items-center gap-10 md:grid-cols-2 lg:grid-cols-3">
            {coffeeStores.map((coffeeStore) => {
              return (
                <Card
                  name={coffeeStore.name}
                  img={coffeeStore.imgUrl}
                  url={`/coffee-store/${coffeeStore.id}`}
                  key={coffeeStore.id}
                />
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
