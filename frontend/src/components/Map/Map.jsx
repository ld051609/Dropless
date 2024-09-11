import React, {useState} from 'react';
import styles from './Map.module.css';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { geoCentroid } from 'd3-geo';

const Map = () => {
    // Correct URL for TopoJSON data
    const geoUrl = "features.json";
    const [zoom, setZoom] = useState(1);
    const [center, setCenter] = useState([0, 0]);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const handleCountryClick = (geo) => {
        const centroid = geoCentroid(geo);
        setCenter(centroid);
        setZoom(4);
        setSelectedCountry(geo.properties);
    }
    const handleReset = () => {
        setCenter([0, 0]);
        setZoom(1);
        setSelectedCountry(null);
    }

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
                                        stroke: "url(#gradientStroke)", // Apply the gradient stroke
                                        strokeWidth: 1, // Adjust as needed
                                        outline: "none",
                                        filter: "url(#glow)", // Apply the glow filter
                                        transition: 'ease 0.05s'
                                    },
                                    hover: {
                                        fill: "#e9ebfb",
                                        stroke: "url(#gradientStroke)", // Apply the gradient stroke
                                        strokeWidth: 0.75, // Adjust as needed
                                        outline: "none",
                                        filter: "url(#glow)",
                                        cursor: "pointer",
                                        transition: 'ease 0.1s'
                                        
                                        
                                    },
                                    pressed: {
                                        fill: "#00111a",
                                        stroke: "url(#gradientStroke)", // Apply the gradient stroke
                                        strokeWidth: 0.75, // Adjust as needed
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
          <p>This is a custom description for {selectedCountry.name}.</p>
          <button onClick={handleReset}>Reset Zoom</button>
        </div>
      )}
        </div>
    );
};

export default Map;





