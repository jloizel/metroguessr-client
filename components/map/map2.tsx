"use client"

import styles from "./page.module.css";
import LyonStyles from "./Lyon.module.css"
import LondonStyles from "./London.module.css"
import ParisStyles from "./Paris.module.css"
import NewYorkCityStyles from "./NYC.module.css"
import MadridStyles from "./Madrid.module.css"
import React, { useRef, useEffect, useState } from "react";
// import mapboxgl, { LngLatLike } from "mapbox-gl";
// import "mapbox-gl/dist/mapbox-gl.css"; 
import "maplibre-gl/dist/maplibre-gl.css";
import { tubeDataConfig } from "../../api/tubeDataConfig";
// import { LngLat } from "maplibre-gl"; // Import LngLat
import ReactGA from 'react-ga4';
import { createTheme, useMediaQuery } from "@mui/material";
import maplibregl, { LngLat, LngLatLike } from 'maplibre-gl';

interface Feature {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number];
  };
  properties: {
    name: string;
    line: string;
  };
}

interface MapProps {
  randomStation: string;
  guessedStation: string | null;
  correctGuess: boolean;
  correctlyGuessedStations: string[]; //deding the string array which will contain all the correctlyGuessedStations
  gameStarted: boolean;
  selectedCity: string;
  skipClickCount: number 
  incorrectGuesses: string[]
  disableZoom: boolean;
  timeEnded: boolean;
  handleTimeEnded: () => void
  lastRandomStation: string
  revealStation: boolean
}

interface styles {
  [key: string]: string;
}

const Map: React.FC<MapProps> = ({ randomStation, guessedStation, correctGuess, correctlyGuessedStations, gameStarted, selectedCity, skipClickCount, incorrectGuesses, disableZoom, timeEnded, handleTimeEnded, lastRandomStation, revealStation }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [previousStationCoords, setPreviousStationCoords] = useState<[number, number] | null>(null);
  let mapInstance: mapboxgl.Map | null = null; // Declare a variable to hold the Map instance

  const delay = (ms:any) => new Promise(resolve => setTimeout(resolve, ms));   

  // useEffect(() => {
  //   ReactGA.send("pageview");
  // }, []);

  let mapCoords: [number, number] = [0, 0]; // Declare mapCoords with initial values
  if (selectedCity === 'Lyon') {
    mapCoords = [4.84701961, 45.75373673]
  } else if (selectedCity === 'London') {
    mapCoords = [-0.118092, 51.509865]
  } else if (selectedCity === 'Paris') {
    mapCoords = [2.3522, 48.8566]
  } else if (selectedCity === 'NewYorkCity') {
    mapCoords = [-73.935242, 40.730610]
  } else if (selectedCity === 'Madrid') {
    mapCoords = [-3.7038, 40.4168]
  }

  const boundingBoxSize: [number, number] = [0.5, 0.5]
  const maxBounds: [[number, number], [number, number]] = [
    [mapCoords[0] - boundingBoxSize[0], mapCoords[1] - boundingBoxSize[1]], // Southwest coordinates
    [mapCoords[0] + boundingBoxSize[0], mapCoords[1] + boundingBoxSize[1]], // Northeast coordinates
  ];

  // Function to add tube lines for a specific city
  function addTubeLines(map:any, city: string) {
    const cityData = tubeDataConfig[city];
    if (!cityData) {
      console.error('Tube data not available for selected city');
      return;
    }

    // Add the tube lines as line layers
    Object.keys(cityData).forEach(lineId => {
      const line = cityData[lineId];
      map.addSource(lineId, {
        type: 'geojson',
        data: line.data,
      });

      map.addLayer({
        id: lineId,
        type: 'line',
        source: lineId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': line.color,
          'line-width': 3,
        },
      });
    });
  }

  // useEffect(() => {
  //   if (!gameStarted && !timeEnded) {
  //     handleTimeEnded();
  //   }
  // }, []);

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 767,
        md: 1024,
        lg: 1200,
        xl: 1536,
      },
    },
  });

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  useEffect(() => {
    if (typeof document !== "undefined") {
      // const key = "jJezVkEIcGqQ3VYB7BCF"
      const map = new maplibregl.Map({
        container: mapContainer.current!,
        style: "https://api.maptiler.com/maps/b48e9bb0-7453-441a-b3df-e169205cbbdc/style.json?key=jJezVkEIcGqQ3VYB7BCF",
        center: (gameStarted ? previousStationCoords : mapCoords) || undefined,
        zoom: gameStarted && !timeEnded ? 13 : 11,
        minZoom: 11,
        maxZoom: 18,
        maxBounds: maxBounds,
        dragRotate: false,
      });
    

    let stations: { features: Feature[] } = { features: [] };

    try {
      if (selectedCity === 'Lyon') {
        stations = require('../../data/Lyon/LyonStations.json');
      } else if (selectedCity === 'London') {
        stations = require('../../data/London/LondonStations.json');
      } else if (selectedCity === 'Paris') {
        stations = require('../../data/Paris/ParisStations.json');
      } else if (selectedCity === 'NewYorkCity') {
        stations = require('../../data/NewYorkCity/NewYorkCityStations.json');
      } else if (selectedCity === 'Madrid') {
        stations = require('../../data/Madrid/MadridStations.json');
      }
    } catch (error) {
      console.error('Error loading station data:', error);
    }

    // Add custom markers and labels for each feature in the data i.e. each city
    stations.features.forEach((feature) => {
      const coordinates = feature.geometry.coordinates as LngLatLike;

      let stylesName = null; // Initialize with empty string
      if (selectedCity === "Lyon") {
        stylesName = LyonStyles; // Provide appropriate class name for Lyon
      } else if (selectedCity === "London") {
        stylesName = LondonStyles; // Provide appropriate class name for London
      } else if (selectedCity === "Paris") {
        stylesName = ParisStyles; // Provide appropriate class name for London
      } else if (selectedCity === "NewYorkCity") {
        stylesName = NewYorkCityStyles; // Provide appropriate class name for London
      } else if (selectedCity === "Madrid") {
        stylesName = MadridStyles; // Provide appropriate class name for London
      }
      
      // Determine the class name based on the 'tube line' property name and if tube guessed is correct or not
      const lineProperty = feature.properties.line;
      const stationName = feature.properties.name;
      let markerClassName = "";
      if (stylesName) {
        // Determine the class name based on the 'tube line' property name and if tube guessed is correct or not
        markerClassName = stylesName.markerHidden;
      
        if (gameStarted) {
          if (guessedStation === feature.properties.name && correctGuess) {
            markerClassName = stylesName[lineProperty + "correct"];
          } else if (correctlyGuessedStations.includes(feature.properties.name)) { //change styling if guessed station is guessed correctly and also stored in the correctlyGuessedStations array
            markerClassName = stylesName[lineProperty + "correct"];
          } else if (randomStation === feature.properties.name) {
            markerClassName = stylesName[lineProperty + "guess"]
          } else if (incorrectGuesses.includes(feature.properties.name)) { //change styling if guessed station is guessed correctly and also stored in the correctlyGuessedStations array
            markerClassName = stylesName[lineProperty + "skip"];
          } 
        }

        // Create a custom marker using a div element with a class
        const markerElement = document.createElement("div");
        markerElement.className = markerClassName; // Use the CSS class defined in your module
        const markerId = `marker_${feature.properties.name}`;
        markerElement.id = markerId;
        markerElement.dataset.lineProperty = lineProperty
        markerElement.dataset.stationName = stationName

        new maplibregl.Marker({
          element: markerElement,  
          // @ts-ignore
          defaultMarker: false})
          .setLngLat(coordinates)
          .addTo(map)
          .setOffset([0,0]);

          // Check if the guessed station matches the current station
        const labelElement = document.createElement("div");
        labelElement.textContent = feature.properties.name;
        const labelId = `label_${feature.properties.name}`;
        labelElement.id = labelId;
      
        // // Append the label to the marker element
        markerElement.appendChild(labelElement);
      }
    });
    
    

    map.on('load', () => {
      // Call the function to add tube lines
      addTubeLines(map, selectedCity);
    
      function toggleLayerVisibility(city: string, lineId: string, gameStarted: boolean) {
        const cityData = tubeDataConfig[city];
        if (!cityData || !cityData[lineId]) {
          console.error('Tube data not available for selected city or line');
          return;
        }
    
        const line = cityData[lineId];
        const features = line.data.features;
    
        // Find the specific feature in the GeoJSON data
        const stationFeature = features.find((feature:any) => feature.properties.name === randomStation);
        if (gameStarted) {
          if (stationFeature) {
            // If the feature is found, set the visibility to visible i.e. station is on the line in question
            map.setLayoutProperty(lineId, "visibility", "visible");
          } else {
            // If the feature is not found, set the visibility to none
            map.setLayoutProperty(lineId, "visibility", "none");
          }
        } else {
          map.setLayoutProperty(lineId, "visibility", "visible");
        }
      }
      
      // Call the function for each layer
      Object.keys(tubeDataConfig[selectedCity]).forEach(lineId => {
        toggleLayerVisibility(selectedCity, lineId, gameStarted);
      });
    });

// Update map center to the selected station
map.on("load", () => {
  if (randomStation) {
    const selectedFeature = stations.features.find((feature) =>
      feature.properties.name.includes(randomStation)
    );

    if (selectedFeature) {
      const coordinates = selectedFeature.geometry.coordinates as LngLatLike;

       // Adjust the coordinates accordingly
       let adjustedCoordinates = coordinates;

       if (isMobile) {
         const screenCoordinates = map.project(coordinates);
         screenCoordinates.y += 100;
         adjustedCoordinates = map.unproject(screenCoordinates) as LngLatLike;
       }
    
      if (Array.isArray(coordinates)) {
        setPreviousStationCoords(adjustedCoordinates as [number, number]);
      } else {
        // If coordinates is LngLat object, extract lng and lat properties
        const { lng, lat } = adjustedCoordinates as LngLat;
        setPreviousStationCoords([lng, lat]);
      }
      // map.setCenter(coordinates)
      // map.setZoom(13)
      // setTimeout(() => {
          if (!disableZoom) {
            map.setCenter(adjustedCoordinates);
          } else if (gameStarted) {{
            setTimeout(() => {
              map.easeTo({
                center: adjustedCoordinates ,
                zoom: 13,
              });
            }, 200);
          }
        }
    // }, 1000)
    }
  }
});

return () => map.remove();
    }
}, [randomStation, correctGuess, correctlyGuessedStations, skipClickCount, disableZoom]);



return <div ref={mapContainer} className={styles.map} />;
};

export default Map;
