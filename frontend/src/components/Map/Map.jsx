import React from 'react';
import styles from './Map.module.css';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import "../../../src/index.css";

const Map = () => {
    // Correct URL for TopoJSON data
    const geoUrl = "features.json";
    
    return (
        <div className={styles.mapContainer}>
            <svg width="0" height="0">
                <defs>
                    <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#0062ff', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#da61ff', stopOpacity: 1 }} />
                    </linearGradient>

                    {/* Define the glowing effect */}
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
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography 
                                key={geo.rsmKey} 
                                geography={geo} 
                                onClick={() => alert(`Clicked on ${geo.properties.name}`)}
                                style={{
                                    default: {
                                        fill: "#003f5c",
                                        stroke: "url(#gradientStroke)", // Apply the gradient stroke
                                        strokeWidth: 0.75, // Adjust as needed
                                        outline: "none",
                                        filter: "url(#glow)", // Apply the glow filter
                                        transition: 'ease 0.05s'
                                    },
                                    hover: {
                                        fill: "#c4c9f4",
                                        stroke: "url(#gradientStroke)", // Apply the gradient stroke
                                        strokeWidth: 0.75, // Adjust as needed
                                        outline: "none",
                                        filter: "url(#glow)",
                                        cursor: "pointer",
                                        transition: 'ease 0.1s'


                                    },
                                    pressed: {
                                        fill: "#2a0d66",
                                        stroke: "url(#gradientStroke)", // Apply the gradient stroke
                                        strokeWidth: 0.75, // Adjust as needed
                                        outline: "none",

                                    }
                                }}
                            />
                        ))
                    }
                </Geographies>
            </ComposableMap>
        </div>
    );
};

export default Map;
