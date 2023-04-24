import { useContext, useState } from "react";
import { ACTION_TYPE, StoreContext } from "@/context/storeContext";

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState(null);
  const [latLong, setLatLong] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    dispatch({
      type: ACTION_TYPE.SET_LAT_LONG,
      payload: { latLong: `${latitude},${longitude}` },
    });

    setLocationErrorMsg(null);
    setIsFindingLocation(false);
  };

  const error = () => {
    setLocationErrorMsg("Unable to retrieve your location");
    setIsFindingLocation(false);
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);

    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by this browser");
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    latLong,
    locationErrorMsg,
    handleTrackLocation,
    isFindingLocation,
  };
};

export default useTrackLocation;
