import React from 'react';
import './App.css';

function App() {
  // Define the handleClick function inside the App component
  const handleClick = (action) => {
    alert(`You clicked ${action}`);
  };

  return (
    <div className="App">
      <header>
        <h1>Welcome to the Rex App</h1>
      </header>
      <main>
        <p>Select an option to get started:</p>
        <button onClick={() => handleClick("Eat")}>Eat</button>
        <button onClick={() => handleClick("Drink")}>Drink</button>
        <button onClick={() => handleClick("See")}>See</button>
        <button onClick={() => handleClick("Do")}>Do</button>
      </main>
    </div>
  );
}

export default App;

