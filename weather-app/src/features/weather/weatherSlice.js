import { createSlice } from '@reduxjs/toolkit';

export const weatherSlice = createSlice({
    name: 'weather',
    initialState: {
        cities: [],
        currentWeather: null,
    },
    reducers: {
        setCities: (state, action) => {
            state.cities = action.payload;
        },
        setCurrentWeather: (state, action) => {
            state.currentWeather = action.payload;
        },
    },
});

export const { setCities, setCurrentWeather } = weatherSlice.actions;

export default weatherSlice.reducer;