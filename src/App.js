import React, { useState, useEffect, useRef } from "react";
import Map from "./Map";

function App() {
  const [topPlace, setTopPlace] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
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
          // Default to Portland, OR if geolocation fails
          setCurrentLocation({ lat: 45.5152, lng: -122.6784 });
        }
      );
    }
  }, []);

  const fetchNearbyPlaces = async (type) => {
    if (!currentLocation) return;

    if (clearMarkersRef.current) {
      clearMarkersRef.current();
    }

    const { lat, lng } = currentLocation;
    const url = `http://localhost:5001/api/nearbysearch?location=${lat},${lng}&radius=1500&type=${type}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log('Fetched data for See/Do:', data); // Log the fetched data


      if (data.results && data.results.length > 0) {
        const place = data.results[0];
        setTopPlace({
          name: place.name,
          vicinity: place.vicinity,
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
        });
      } else {
        setTopPlace(null);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Usersaurus Rex</h1>
      </header>
      <main>
        <p>What do you want?</p>
        <button onClick={() => fetchNearbyPlaces("restaurant")}>Eat</button>
        <button onClick={() => fetchNearbyPlaces("bar")}>Drink</button>
        <button onClick={() => fetchNearbyPlaces("park")}>See/Do</button>
        <div>
          {topPlace ? (
            <>
              <h2>Right here right now: {topPlace.name}</h2>
              <p>{topPlace.vicinity}</p>
              <Map
                currentLocation={currentLocation}
                topPlaceLocation={topPlace.location}
                clearMarkers={clearMarkersRef}
              />
            </>
          ) : (
            <p>No results found. Try another option!</p>
          )}
        </div>
      </main>
    </div>
  );
}


export default App;
 