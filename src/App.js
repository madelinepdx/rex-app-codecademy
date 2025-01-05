import React, { useState } from "react";
import Map from "./Map";

function App() {
  const [topPlace, setTopPlace] = useState(null);

  const fetchNearbyPlaces = async (type) => {
    console.log("Fetching nearby places...");
    const location = "40.730610,-73.935242"; // Example: New York City
    const radius = 1500;
  
    const url = `http://localhost:5001/api/nearbysearch?location=${location}&radius=${radius}&type=${type}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      console.log("Top Place Data:", data.results[0] || "No places found");
  
      if (data.results && data.results.length > 0) {
        const place = data.results[0];
        const center = {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        };
  
        setTopPlace({
          name: place.name,
          vicinity: place.vicinity,
          rating: place.rating,
          center,
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
        <button onClick={() => fetchNearbyPlaces("park")}>See</button>
        <button onClick={() => fetchNearbyPlaces("activity")}>Do</button>

        <div>
          {topPlace ? (
            <>
              <h2>Right here right now: {topPlace.name}</h2>
              <Map location={topPlace?.center} title={topPlace?.name} />
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
