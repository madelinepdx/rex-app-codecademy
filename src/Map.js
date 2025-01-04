import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = { lat: 40.730610, lng: -73.935242 }; // Default to NYC

const Map = ({ location }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={location || center} zoom={14}>
      {location && <Marker position={location} />}
    </GoogleMap>
  );
};

export default Map;
