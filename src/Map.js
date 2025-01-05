/* global google */
import React, { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const Map = ({ location, topPlace }) => {
  const mapRef = useRef(null);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: ["marker"], // Required for AdvancedMarkerElement
  });

  useEffect(() => {
    const loadMap = async () => {
      if (isLoaded && location) {
        const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

        const map = new google.maps.Map(mapRef.current, {
          center: location,
          zoom: 14,
          mapId: "DEMO_MAP_ID", // Replace with your actual map ID
        });

        const marker = new AdvancedMarkerElement({
          map,
          position: location,
          title: topPlace?.name || "Selected Place",
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div>
              <h3>${topPlace?.name || "No Title"}</h3>
              <p>Location: ${location.lat}, ${location.lng}</p>
            </div>
          `,
        });

        marker.addEventListener("click", () => {
          infoWindow.open({
            anchor: marker,
            map,
          });
        });
      }
    };

    loadMap();
  }, [isLoaded, location, topPlace]);

  if (!isLoaded) return <div>Loading...</div>;

  return <div ref={mapRef} style={containerStyle}></div>;
};

export default Map;
