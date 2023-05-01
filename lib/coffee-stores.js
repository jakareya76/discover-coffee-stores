import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 30,
    orientation: "landscape",
  });

  const unsplashResults = photos.response.results;

  return unsplashResults.map((result) => {
    return result.urls["small"];
  });
};

export const fetchCoffeeStores = async (
  latLong = "43.65236315659686%2C-79.38333904423905",
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_SECRET_KEY,
    },
  };

  const res = await fetch(
    `https://api.foursquare.com/v3/places/search?query=coffee&ll=${latLong}&limit=${limit}`,
    options
  );

  const data = await res.json();

  return data.results.map((result, idx) => {
    return {
      id: result.fsq_id,
      name: result.name,
      address: result.location.address,
      locality: result.location.locality || result.location.cross_street,
      imgUrl: photos[idx],
    };
  });
};
