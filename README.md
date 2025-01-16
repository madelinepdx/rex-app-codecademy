# **Rex: Your Top Rec**

## **Overview**
Rex is designed to **combat decision fatigue** by helping users find the top-rated places closest to them. Whether you want to eat, drink, or explore, Rex makes the decision for you so you can spend less time scrolling and more time enjoying. With a playful T-Rex theme, Rex delivers easy, no-hassle recommendations (or "recs") tailored to your location.

---

## **Features**
- 🦖 **Decision-Free Recommendations:** Rex fetches the highest-rated place near you in seconds, removing decision fatigue.
- 🗺 **Interactive Map:** Displays your current location and the top nearby recommendation, with the map adjusting accordingly to center your geolocation and selected marker.
- 🔍 **Category Selection:** Toggle between "Eat," "Drink," and "Explore" to find the best rec for your mood.
- 🌐 **Responsive Design:** Works seamlessly on all devices (desktop, tablet, and mobile).
- **Customizable InfoWindows**: Displays detailed information, including opening hours and direct links to Google Maps.
- 🌟 **Error Handling:** Clear feedback and retry options for network issues or API errors.
  
---

## **Why Rex?**
Decision fatigue is a real problem in today’s fast-paced world. Rex simplifies your experience by:
1. Showing you **only the top-rated rec closest to you**.
2. Removing the hassle of endless scrolling and reviews.
3. Letting you focus on enjoying your outing instead of stressing over decisions.

---

## **How to Use Rex**
1. Visit the live URL: https://madelinepdx.github.io/rex-app-codecademy
2. Grant location access to let Rex fetch your geolocation.
3. Click "Eat," "Drink," or "Explore" to find nearby recs.
4. View your geolocation and Rex's top recommendation on the map.
5. Use the arrow buttons to choose the next best option (or go back!).

---

## **Getting Started**
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### **Available Scripts**
In the project directory, you can run:

- **`npm start`**  
  Runs the app in development mode.  
  Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

- **`node server.js`**  
  Starts the backend server required for fetching data from the API.  
  Ensure this is running concurrently with `npm start`.

- **`npm test`**  
  Launches the test runner in interactive watch mode.

- **`npm run build`**  
  Builds the app for production.  
  The production build is optimized for the best performance.

---

## Setup and Installation

### Prerequisites
- Node.js
- Google Maps API Key

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/madelinepdx/rex-app-codecademy.git
   ```
2. Navigate to the project directory:
   ```bash
   cd rex-app-codecademy
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and add your Google Maps API key:
   ```env
   REACT_APP_GOOGLE_API_KEY=your-google-maps-api-key
   ```
5. Start the development server:
   ```bash
   npm start
   ```
   ## How to Use
- Click on a button (eat, drink, explore) to see nearby locations.
- The map automatically adjusts to show your location and the nearest place.
- Click on a marker to see detailed information about the place.

## Technologies Used
- React.js
- Google Maps JavaScript API
- Node.js (for the backend API)
- HTML/CSS

## Future Enhancements
- Add user authentication for personalized recommendations.
- Allow users to save favorite places.
- Enhance mobile responsiveness.

## Contributions
Contributions are welcome! Feel free to fork the repository and submit a pull request.
