import React, { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const libraries = ["places", "marker"];

const Map = ({ currentLocation, topPlaceLocation, clearMarkers }) => {
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries,
    version: "weekly",
  });

  const fetchAddress = async (lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve("Address not available");
        }
      });
    });
  };

  useEffect(() => {
    let isMounted = true;

    if (isLoaded && window.google) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: currentLocation || { lat: 0, lng: 0 },
        zoom: currentLocation ? 14 : 2,
        mapId: "9b3a5447085a1f92",
      });

      mapRef.current = map;

      const infoWindowInstance = new window.google.maps.InfoWindow();

      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // Add geolocation marker (blue dot)
      if (currentLocation && isMounted) {
        const geolocationMarker = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: currentLocation,
          title: "You are here",
          content: createCustomMarker("blue"),
        });

        geolocationMarker.addListener("click", async () => {
          const address = await fetchAddress(currentLocation.lat, currentLocation.lng);
          infoWindowInstance.setContent(`
            <div>
              <h3>You are here</h3>
              <p>${address}</p>
            </div>
          `);
          infoWindowInstance.open(map, geolocationMarker);
        });

        markersRef.current.push(geolocationMarker);
      }

      // Add top place marker (T-Rex with color)
      if (topPlaceLocation && isMounted) {
        const topPlaceMarker = new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: topPlaceLocation.lat, lng: topPlaceLocation.lng },
          title: topPlaceLocation.name,
          content: createTyrannosaurusMarker(topPlaceLocation.type),
        });

        topPlaceMarker.addListener("click", () => {
          const content = `
            <div>
              <h3>${topPlaceLocation.name}</h3>
              <p>${topPlaceLocation.address || "No address available"}</p>
              ${
                topPlaceLocation.opening_hours
                  ? `<p><strong>Opening Hours:</strong></p>
                     <ul>
                       ${topPlaceLocation.opening_hours
                         .map((day) => `<li>${day}</li>`)
                         .join("")}
                     </ul>`
                  : "<p>No opening hours available</p>"
              }
              ${
                topPlaceLocation.place_id
                  ? `<p><a href="https://www.google.com/maps/place/?q=place_id:${topPlaceLocation.place_id}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a></p>`
                  : ""
              }
            </div>
          `;
          infoWindowInstance.setContent(content);
          infoWindowInstance.open(map, topPlaceMarker);
        });

        markersRef.current.push(topPlaceMarker);
      }

      // Cleanup markers
      clearMarkers.current = () => {
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];
      };

      return () => {
        isMounted = false;
        markersRef.current.forEach((marker) => marker.setMap(null));
      };
    }
  }, [isLoaded, currentLocation, topPlaceLocation, clearMarkers]);

  // Helper function to create custom markers
  const createCustomMarker = (type) => {
    const markerContent = document.createElement("div");
    markerContent.style.width = "20px";
    markerContent.style.height = "20px";
    markerContent.style.borderRadius = "50%";

    if (type === "blue") {
      markerContent.style.backgroundColor = "blue";
      markerContent.style.boxShadow = "0 0 6px rgba(0, 0, 255, 0.5)";
    }

    return markerContent;
  };

  // Helper function for T-Rex marker with color
  const createTyrannosaurusMarker = (type) => {
    const markerContent = document.createElement("div");
    markerContent.classList.add("trex-marker", type); // Add type-specific class
    markerContent.style.backgroundImage = "url('/images/noun-dinosaur.png')";
    markerContent.style.backgroundSize = "contain";
    markerContent.style.backgroundRepeat = "no-repeat";
    markerContent.style.backgroundPosition = "center";
    return markerContent;
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return <div id="map" style={containerStyle}></div>;
};

export default Map;
