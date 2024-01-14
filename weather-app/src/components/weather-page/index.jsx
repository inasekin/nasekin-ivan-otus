import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Container, Spinner, Table} from 'react-bootstrap';
import {fetchWeatherForecast} from '../../api';
import {setCurrentWeather} from "../../features/weather/weatherSlice";

function WeatherPage() {
    const { city } = useParams();
    const dispatch = useDispatch();
    const weatherForecast = useSelector(state => state.weather.currentWeather);
    const [isLoading, setIsLoading] = useState(true);
    const [groupedForecast, setGroupedForecast] = useState({});

    // Функция для форматирования времени в необходимый формат заголовка
    const formatTime = (date) => {
        const hours = date.getHours();
        return hours === 0 ? '12:00 AM' : hours < 12 ? `${hours}:00 AM` : `${hours - 12}:00 PM`;
    };

    useEffect(() => {
        setIsLoading(true);
        fetchWeatherForecast(city).then(data => {
            dispatch(setCurrentWeather(data.list)); // Обновляем данные в Redux

            const newData = data.list.reduce((acc, curr) => {
                const date = new Date(curr.dt * 1000).toDateString();
                const time = formatTime(new Date(curr.dt * 1000));
                if (!acc[date]) {
                    acc[date] = {};
                }
                acc[date][time] = `${curr.main.temp}°C, ${curr.weather[0].description}`;
                return acc;
            }, {});

            setGroupedForecast(newData);
            setIsLoading(false);
        }).catch(error => {
            console.error("Error fetching weather:", error);
            setIsLoading(false);
        });
    }, [city, dispatch]);

    const timeSlots = ['12:00 AM', '3:00 AM', '6:00 AM', '9:00 AM', '12:00 PM', '3:00 PM', '6:00 PM', '9:00 PM'];

    if (isLoading) {
        return (
            <Container className="my-4">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="my-4">
            <h1>Weather Forecast for {city}</h1>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Date</th>
                    {timeSlots.map(slot => <th key={slot}>{slot}</th>)}
                </tr>
                </thead>
                <tbody>
                {Object.keys(groupedForecast).map(date => (
                    <tr key={date}>
                        <td>{date}</td>
                        {timeSlots.map(slot => (
                            <td key={slot}>
                                {groupedForecast[date][slot] || '-'}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default WeatherPage;