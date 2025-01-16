import React, { useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const libraries = ["places", "marker"];

const Map = ({ currentLocation, topPlaceLocation, clearMarkers, activeButton }) => {
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
          content: createTyrannosaurusMarker(activeButton), // Use activeButton
        });

        topPlaceMarker.addListener("click", () => {
          fetchPlaceDetails(topPlaceLocation.place_id, map, topPlaceMarker, infoWindowInstance);
        });

        markersRef.current.push(topPlaceMarker);
      }

      // Center map to include all markers
      if (currentLocation && topPlaceLocation) {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(currentLocation); // Add geolocation marker to bounds
        bounds.extend({ lat: topPlaceLocation.lat, lng: topPlaceLocation.lng }); // Add T-Rex marker to bounds
        map.fitBounds(bounds); // Adjust map to fit bounds
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

  const fetchPlaceDetails = (placeId, map, marker, infoWindow) => {
    if (!placeId) {
      infoWindow.setContent("<p>No place details available</p>");
      infoWindow.open(map, marker);
      return;
    }

    const service = new window.google.maps.places.PlacesService(map);

    service.getDetails(
      {
        placeId,
        fields: ["name", "formatted_address", "opening_hours", "url"], // Specify the fields to fetch
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const content = `
            <div>
              <h3>${place.name || "No Name Available"}</h3>
              ${place.formatted_address ? `<p>${place.formatted_address}</p>` : ""}
              ${
                place.opening_hours?.weekday_text
                  ? `<p><strong>Opening Hours:</strong></p>
                     <ul>
                       ${place.opening_hours.weekday_text
                         .map((day) => `<li>${day}</li>`)
                         .join("")}
                     </ul>`
                  : "<p>No opening hours available</p>"
              }
              ${
                place.url
                  ? `<p><a href="${place.url}" target="_blank" rel="noopener noreferrer">Open in Google Maps</a></p>`
                  : ""
              }
            </div>
          `;
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        } else {
          infoWindow.setContent("<p>No place details available</p>");
          infoWindow.open(map, marker);
        }
      }
    );
  };

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

  const createTyrannosaurusMarker = (type) => {
    const markerContent = document.createElement("div");
    markerContent.style.backgroundImage = "url('/images/noun-dinosaur.png')";
    markerContent.style.backgroundSize = "contain";
    markerContent.style.backgroundRepeat = "no-repeat";
    markerContent.style.backgroundPosition = "center";
    markerContent.style.width = "30px";
    markerContent.style.height = "30px";
    markerContent.style.borderRadius = "50%";
    markerContent.style.boxShadow = `0 0 50px 30px ${
      type === "eat"
        ? "rgba(240, 98, 146, 0.5)"
        : type === "drink"
        ? "rgba(147, 112, 219, 0.5)"
        : "rgba(255, 127, 80, 0.5)"
    }`;

    return markerContent;
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return <div id="map" style={containerStyle}></div>;
};

export default Map;
