import React, { useState, useEffect, useRef } from "react";
import Map from "./Map";
import "./App.css";

function App() {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [topPlace, setTopPlace] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [places, setPlaces] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const clearMarkersRef = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
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
      clearMarkersRef.current();
    }

    const { lat, lng } = currentLocation;
    const url = `http://localhost:5001/api/nearbysearch?location=${lat},${lng}&radius=1500&type=${type}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setPlaces(data.results);
        setCurrentIndex(0);
        const firstPlace = data.results[0];
        setTopPlace({
          name: firstPlace.name,
          address: firstPlace.vicinity,
          lat: firstPlace.geometry.location.lat,
          lng: firstPlace.geometry.location.lng,
          place_id: firstPlace.place_id,
          opening_hours: firstPlace.opening_hours?.weekday_text || null,
        });
      } else {
        setPlaces([]);
        setTopPlace(null);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  const handleButtonClick = (type) => {
    setShowMap(true);
    setActiveButton(
      type === "restaurant" ? "eat" : type === "bar" ? "drink" : "explore"
    );
    fetchNearbyPlaces(type);
  };

  const resetApp = () => {
    setShowMap(false);
    setActiveButton(null);
    setTopPlace(null);
    setPlaces([]);
    setCurrentIndex(0);
  };

  const handleNavigation = (direction) => {
    if (!places.length) return;

    let newIndex = currentIndex;
    if (direction === "next") {
      newIndex = (currentIndex + 1) % places.length;
    } else if (direction === "prev") {
      newIndex = (currentIndex - 1 + places.length) % places.length;
    }

    setCurrentIndex(newIndex);
    const place = places[newIndex];
    setTopPlace({
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      place_id: place.place_id,
      opening_hours: place.opening_hours?.weekday_text || null,
    });
  };

  return (
    <div className={`App ${showMap ? "map-visible" : ""}`}>
      <nav>
        <div className="logo" onClick={resetApp}>
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
          className={`eat ${activeButton === "eat" ? "active" : ""}`}
            >
            eat
            </button>
            <button
              onClick={() => handleButtonClick("bar")}
              className={`drink ${activeButton === "drink" ? "active" : ""}`}
            >
              drink
            </button>
            <button
              onClick={() => handleButtonClick("park")}
              className={`explore ${activeButton === "explore" ? "active" : ""}`}
            >
              explore
            </button>
          </div>


          {!showMap && (
           <img
           className={`rex ${activeButton || ""}`} // Dynamically set class
           src="/images/noun-dinosaur.png"
           alt="T-Rex Icon"
         />         
          )}
        </div>

        {activeButton && (
          <div className="arrows">
            <button
              className={`arrow-button ${activeButton}`}
              onClick={() => handleNavigation("prev")}
            >
              &lt;
            </button>
            <button
              className={`arrow-button ${activeButton}`}
              onClick={() => handleNavigation("next")}
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {showMap && currentLocation && (
        <div className="map-container">
          <Map
            currentLocation={currentLocation}
            topPlaceLocation={topPlace}
            clearMarkers={clearMarkersRef}
            activeButton={activeButton} // Pass activeButton
          />
        </div>
      )}
    </div>
  );
}

export default App;
