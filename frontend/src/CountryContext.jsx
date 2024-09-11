import React, { createContext, useState, useContext } from 'react';

// Create a Context for the country
const CountryContext = createContext();

// Create a Provider component
export const CountryProvider = ({ children }) => {
    const [country, setCountry] = useState('');

    // Function to update the country
    const updateCountry = (newCountry) => {
        setCountry(newCountry);
    };

    return (
        <CountryContext.Provider value={{ country, updateCountry }}>
            {children}
        </CountryContext.Provider>
    );
};

// Custom hook to use the Country context
export const useCountry = () => {
    const context = useContext(CountryContext);
    if (context === undefined) {
        throw new Error('useCountry must be used within a CountryProvider');
    }
    return context;
};
