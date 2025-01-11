import React, { useState } from "react";
import Map from "./Map";
import "./App.css"; 

function App() {
  const [activeButton, setActiveButton] = useState(null); // Tracks which button is active
  const [showMap, setShowMap] = useState(false); // Controls whether to display the map

  const handleButtonClick = (type) => {
    setActiveButton(type); // Highlight the clicked button
    setShowMap(true); // Show the map
    console.log(`Fetching ${type} data...`);
  };

  return (
    <div className="App">
      <nav>
        <div className="logo">
          <img src="/images/noun-dinosaur.png" alt="T-Rex Icon" />
          <span>r e x</span>
        </div>
      </nav>

      <div className="container">
        {!showMap && <h1>What do you want?</h1>}
        <div className="content">
          <div className="buttons">
            {["eat", "drink", "see", "do"].map((type) => (
              <button
                key={type}
                onClick={() => handleButtonClick(type)}
                className={activeButton === type ? "active" : ""}
              >
                {type}
              </button>
            ))}
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

      {showMap && (
        <div className="map-container">
          <Map />
        </div>
      )}
      {!showMap && (
        <div className="footer">
          Click for the top rec near you.
        </div>
      )}
    </div>
  );
}

export default App;
