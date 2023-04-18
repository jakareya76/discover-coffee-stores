import Head from "next/head";

import Hero from "../components/Hero";
import Card from "@/components/Card";

import coffeeStoresData from "../data/coffee-stores.json";

export const getStaticProps = async () => {
  return {
    props: {
      coffeeStores: coffeeStoresData,
    },
  };
};

export default function Home({ coffeeStores }) {
  const handleOnBannerBtnClick = () => {};

  return (
    <>
      <Head>
        <title>COFFEE CONNOISSEUR</title>
      </Head>
      <main className="container mx-auto">
        <Hero
          buttonText="View stores nearby"
          handleOnClick={handleOnBannerBtnClick}
        />
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
}
