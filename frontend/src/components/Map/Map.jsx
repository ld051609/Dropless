import React, { useState } from 'react';
import styles from './Map.module.css';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Map = () => {
    const geoUrl = "features.json";
    const [zoom, setZoom] = useState(1);
    const [center, setCenter] = useState([0, 0]);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const handleCountryClick = (geo) => {
        const centroid = geoCentroid(geo);
        setCenter(centroid);
        setZoom(4);
        setSelectedCountry(geo.properties);
    };

    const handleReset = () => {
        setCenter([0, 0]);
        setZoom(1);
        setSelectedCountry(null);
    };

    // Mock data for demonstration
    const mockData = {
        'Canada': [
            { year: '2021', water_resources: 3200 },
            { year: '2022', water_resources: 3100 },
            { year: '2023', water_resources: 3000 },
            { year: '2024', water_resources: 2900 },
            { year: '2025', water_resources: 2800 },
        ],
        'USA': [
            { year: '2021', water_resources: 2500 },
            { year: '2022', water_resources: 2400 },
            { year: '2023', water_resources: 2300 },
            { year: '2024', water_resources: 2200 },
            { year: '2025', water_resources: 2100 },
        ],
    };

    return (
        <div className={styles.mapContainer}>
            <svg width="0" height="0">
                <defs>
                    <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#0062ff', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#da61ff', stopOpacity: 1 }} />
                    </linearGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blurred"/>
                        <feMerge>
                            <feMergeNode in="blurred"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
            </svg>

            <ComposableMap>
                <ZoomableGroup zoom={zoom} center={center}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    onClick={() => handleCountryClick(geo)}
                                    style={{
                                        default: {
                                            fill: "#003f5c",
                                            stroke: "url(#gradientStroke)",
                                            strokeWidth: 1,
                                            outline: "none",
                                            filter: "url(#glow)",
                                            transition: 'ease 0.05s'
                                        },
                                        hover: {
                                            fill: "#e9ebfb",
                                            stroke: "url(#gradientStroke)",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                            filter: "url(#glow)",
                                            cursor: "pointer",
                                            transition: 'ease 0.1s'
                                        },
                                        pressed: {
                                            fill: "#00111a",
                                            stroke: "url(#gradientStroke)",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        }
                                    }}
                                />
                            ))
                        }
                    </Geographies>
                </ZoomableGroup>
            </ComposableMap>

            {selectedCountry && (
                <div className={styles.popup}>
                    <h2>{selectedCountry.name}</h2>
                    <LineChart width={500} height={300} data={mockData[selectedCountry.name]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="water_resources" stroke="#8884d8" />
                    </LineChart>
                    <button onClick={handleReset} className={styles.resetButton}>Reset Zoom</button>
                </div>
            )}
        </div>
    );
};

export default Map;
