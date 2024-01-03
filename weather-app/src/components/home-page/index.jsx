import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Button, Form, Container, Row, Col, ListGroup, InputGroup, Alert} from 'react-bootstrap';
import { fetchWeather } from '../../api';
import { useNavigate } from 'react-router-dom';
import {setCities} from "../../features/weather/weatherSlice";

function HomePage() {
    const [input, setInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cities = useSelector(state => state.weather.cities);

    useEffect(() => {
        const savedCities = JSON.parse(localStorage.getItem('cities')) || [];
        dispatch(setCities(savedCities));
    }, [dispatch]);

    const handleSearch = async () => {
        try {
            setError('');
            const weatherData = await fetchWeather(input);
            setSearchResults([weatherData]);
            dispatch(setCities([input]));
            localStorage.setItem('cities', JSON.stringify([...cities, input]));
        } catch (error) {
            setError("Error fetching weather. Please try again or check your token.");
            console.error("Error fetching weather:", error);
        }
    };

    const handleCitySelect = (city) => {
        navigate(`/weather/${city}`);
    };

    return (
        <Container className="my-4">
            <Row className="mb-3">
                <Col>
                    <h1>Welcome to Weather App</h1>
                    <p className="lead">Enter a city name to get the latest weather information.</p>
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 6 }}>
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Enter city"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                        />
                        <Button variant="primary" onClick={handleSearch}>Search</Button>
                    </InputGroup>
                    {error && <Alert variant="danger" style={{ marginTop: '15px' }}>{error}</Alert>}
                </Col>
            </Row>
            <Row>
                <Col md={{ span: 6 }}>
                    {searchResults.length > 0 && (
                        <ListGroup style={{ marginTop: '15px' }}>
                            {searchResults.map((result, index) => (
                                <ListGroup.Item key={index} action onClick={() => handleCitySelect(result.name.toLowerCase())}>
                                    {result.name}: {result.main.temp}°C
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default HomePage;