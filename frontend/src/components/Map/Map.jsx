import React, { useState } from 'react';
import styles from './Map.module.css';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import MockData from './data.json'; // Import JSON data

const Map = () => {
    const geoUrl = "features.json";
    const [zoom, setZoom] = useState(1);
    const [center, setCenter] = useState([0, 0]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [hoveredCountry, setHoveredCountry] = useState(null);

    const handleCountryClick = (geo) => {
        const centroid = geoCentroid(geo);
        setCenter(centroid);
        setZoom(4);
        setSelectedCountry(geo.properties);
        setHoveredCountry(null); // Clear hover state when selecting a country
    };

    const handleReset = () => {
        setCenter([0, 0]);
        setZoom(1);
        setSelectedCountry(null);
        setHoveredCountry(null); // Clear hover state on reset
    };

    return (
        <div>
            <div className={styles.mapContainer}>
                <svg width="0" height="0">
                    <defs>
                        <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#0062ff', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#da61ff', stopOpacity: 1 }} />
                        </linearGradient>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blurred" />
                            <feMerge>
                                <feMergeNode in="blurred" />
                                <feMergeNode in="SourceGraphic" />
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
                                        onMouseEnter={() => setHoveredCountry(geo.properties)}
                                        onMouseLeave={() => setHoveredCountry(null)}
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

                {selectedCountry && MockData[selectedCountry.name] && (
                    <div className={styles.popup}>
                        <h2>{selectedCountry.name}</h2>
                        <LineChart width={500} height={300} data={MockData[selectedCountry.name]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="Year" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Water_resources" stroke="#8884d8" />
                        </LineChart>
                        <button onClick={handleReset} className={styles.resetButton}>Reset Zoom</button>
                    </div>
                )}

                {hoveredCountry && (
                    <div className={styles.tooltip} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                        <h3>{hoveredCountry.name}</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Map;
