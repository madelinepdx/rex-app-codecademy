import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const Map = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  });

  const [places, setPlaces] = useState([]);
  const center = { lat: 40.73061, lng: -73.935242 };

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(
          `/api/maps/api/place/nearbysearch/json?location=${center.lat},${center.lng}&radius=1500&type=restaurant&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
        );
        const data = await response.json();
        setPlaces(data.results || []);
      } catch (error) {
        console.error("Error fetching places:", error);
      }
    };

    fetchPlaces();
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      zoom={10}
      center={center}
      mapContainerStyle={{ width: "100%", height: "400px" }}
    >
      {places.map((place) => (
        <Marker
          key={place.place_id}
          position={place.geometry.location}
          title={place.name}
        />
      ))}
    </GoogleMap>
  );
};

export default Map;
