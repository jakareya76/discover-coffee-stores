import { useRouter } from "next/router";
import Link from "next/link";

import coffeeStoresData from "../../data/coffee-stores.json";

export const getStaticProps = async (context) => {
  const params = context.params;

  return {
    props: {
      coffeeStores: coffeeStoresData.find((coffeStore) => {
        return coffeStore.id.toString() === params.slug;
      }),
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [{ params: { slug: "0" } }, { params: { slug: "1" } }],
    fallback: true,
  };
};

const slug = ({ coffeeStores }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <h1 className="text-white text-xl">Loading...</h1>;
  }

  return (
    <div className="text-white text-xl">
      <p>{coffeeStores.name}</p>
      <p>{coffeeStores.address}</p>
    </div>
  );
};

export default slug;
