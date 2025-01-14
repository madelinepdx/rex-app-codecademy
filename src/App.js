import React, { useState, useEffect, useRef } from "react";
import Map from "./Map";
import "./App.css";

function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [topPlace, setTopPlace] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const clearMarkersRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          console.log("Geolocation fetched:", { lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          setCurrentLocation({ lat: 45.5152, lng: -122.6784 }); // Default location
        }
      );
    }
  }, []);

  const fetchNearbyPlaces = async (type) => {
    if (!currentLocation) {
      console.warn("Current location is not set yet.");
      return;
    }

    if (clearMarkersRef.current) {
      clearMarkersRef.current(); // Clear previous markers
    }

    const { lat, lng } = currentLocation;
    const url = `http://localhost:5001/api/nearbysearch?location=${lat},${lng}&radius=1500&type=${type}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(`Fetched places data for ${type}:`, data);

      if (data.results && data.results.length > 0) {
        const place = data.results[0];
        console.log(`Top place for ${type}:`, place);
        setTopPlace({
          name: place.name,
          address: place.vicinity,
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
          place_id: place.place_id,
          opening_hours: place.opening_hours?.weekday_text || null,
        });
      } else {
        console.warn(`No results found for ${type}`);
        setTopPlace(null);
      }
    } catch (error) {
      console.error(`Error fetching places for ${type}:`, error);
    }
  };

  const handleButtonClick = (type) => {
    setShowMap(true);
    setActiveButton(type);
    fetchNearbyPlaces(type);
  };

  const resetApp = () => {
    // Reset to initial state
    setShowMap(false);
    setActiveButton(null);
    setTopPlace(null);
  };

  return (
    <div className={`App ${showMap ? "map-visible" : ""}`}>
      <nav>
        <div className="logo" onClick={resetApp}>
          {/* Make the icon clickable */}
          <img src="/images/noun-dinosaur.png" alt="T-Rex Icon" />
          <span>r e x</span>
        </div>
      </nav>

      <div className="container">
        {!showMap && <h1>What do you want?</h1>}
        <div className="content">
          <div className="buttons">
            <button
              onClick={() => handleButtonClick("restaurant")}
              className={activeButton === "restaurant" ? "active eat" : ""}
            >
              eat
            </button>
            <button
              onClick={() => handleButtonClick("bar")}
              className={activeButton === "bar" ? "active drink" : ""}
            >
              drink
            </button>
            <button
              onClick={() => handleButtonClick("park")}
              className={activeButton === "park" ? "active explore" : ""}
            >
              explore
            </button>
          </div>
          {!showMap && (
            <img
              className="rex"
              src="/images/noun-dinosaur.png"
              alt="T-Rex Icon"
            />
          )}
        </div>
      </div>

      {showMap && currentLocation && (
        <div className="map-container">
          <Map
            currentLocation={currentLocation}
            topPlaceLocation={topPlace}
            clearMarkers={clearMarkersRef}
          />
        </div>
      )}
    </div>
  );
}

export default App;
