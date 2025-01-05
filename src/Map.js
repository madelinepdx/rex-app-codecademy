/* global google */
import React, { useEffect, useRef } from "react";
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const libraries = ["marker"];

const Map = ({ currentLocation, topPlaceLocation, clearMarkers }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]); // Maintain reference to markers

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (isLoaded && mapRef.current && window.google) {
      const map = mapRef.current;

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // User's current location marker
      if (currentLocation) {
        const userMarker = new google.maps.Marker({
          map,
          position: currentLocation,
          title: "Your Location",
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          },
        });
        markersRef.current.push(userMarker);
      }

      // Top place marker
      if (topPlaceLocation) {
        const topPlaceMarker = new google.maps.Marker({
          map,
          position: topPlaceLocation,
          title: "Top Place",
        });
        markersRef.current.push(topPlaceMarker);
      }

      // Expose a method to clear markers externally
      clearMarkers.current = () => {
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];
      };
    }
  }, [isLoaded, currentLocation, topPlaceLocation, clearMarkers]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentLocation || { lat: 0, lng: 0 }}
      zoom={currentLocation ? 14 : 2}
      onLoad={(map) => (mapRef.current = map)}
    />
  );
};

export default Map;
