import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../home-page';
import WeatherPage from '../weather-page';

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/weather/:city" element={<WeatherPage />} />
            </Routes>
        </div>
    );
}

export default App;