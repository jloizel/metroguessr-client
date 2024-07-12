"use client"

import React, { useRef, useEffect, useState } from 'react';
import maplibregl, { LngLatLike, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import styles from './page.module.css';
import mapboxgl from 'mapbox-gl';
import LyonStyles from "./Lyon.module.css"
import LondonStyles from "./London.module.css"
import ParisStyles from "./Paris.module.css"
import NewYorkCityStyles from "./NYC.module.css"
import MadridStyles from "./Madrid.module.css"
import BarcelonaStyles from "./Madrid.module.css"
import { tubeDataConfig } from '../../api/tubeDataConfig';

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
  selectedCity: string
  gameStarted: boolean
  randomStation: string
  disableZoom: boolean
  guessedStation: string | null;
  correctlyGuessedStations: string[]
  correctGuess: boolean
  incorrectGuesses: string[]
  handleLineIDs: (lineIDs: string[]) => void
  resetMap: boolean
}



const Map: React.FC<MapProps> = ({selectedCity, gameStarted, randomStation, disableZoom, guessedStation, correctGuess, correctlyGuessedStations, incorrectGuesses, handleLineIDs, resetMap}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [lineIDs, setLineIDs] = useState<string[]>([]);

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
  
    var layers = map?.getStyle().layers;
  
    // Filter layers to get IDs of layers that exist in cityData (lineId keys)
    var lineLayerIds = layers?.reduce(function (acc:any, layer:any) {
      // Check if layer id exists in cityData
      if (cityData.hasOwnProperty(layer.id) && layer.type === 'line') {
        acc.push(layer.id);
      }
      return acc;
    }, []);
  
    handleLineIDs(lineLayerIds)
  }

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
  } else if (selectedCity === 'Berlin') {
    mapCoords = [13.4050, 52.5200]
  } else if (selectedCity === 'Barcelona') {
    mapCoords = [2.1494, 41.3763]
  } else if (selectedCity === 'Rome') {
    mapCoords = [12.496366, 41.902782]
  }

  const mapBounds: [[number, number], [number, number]] = [
    [mapCoords[0] - 0.5, mapCoords[1] - 0.5],
    [mapCoords[0] + 0.5, mapCoords[1] + 0.5]
  ];

  useEffect(() => {
    if (!map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current!,
        style: `https://api.maptiler.com/maps/b48e9bb0-7453-441a-b3df-e169205cbbdc/style.json?key=jJezVkEIcGqQ3VYB7BCF`,
        center: mapCoords,
        minZoom: 11,
        maxZoom: 18,
        dragRotate: false,
        maxBounds: mapBounds,
      });
    }
    setMapInstance(map.current);
  }, []);

  useEffect(() => {
    if (mapInstance && resetMap) {
      mapInstance.setCenter(mapCoords);
      const mapZoom = 11;
      mapInstance.setZoom(mapZoom);
    }
  }, [mapInstance, resetMap]);
  
  let stations: { features: Feature[] } = { features: [] };
  try {
    if (selectedCity === 'Lyon') {
      stations = require('../../data/Lyon/LyonStations.json');
    } else if (selectedCity === 'London') {
      stations = require('../../data/London/LondonStations.json');
  }  else if (selectedCity === 'Madrid') {
      stations = require('../../data/Madrid/MadridStations.json');
    } else if (selectedCity === 'Paris') {
      stations = require('../../data/Paris/ParisStations.json');
    } else if (selectedCity === 'NewYorkCity') {
      stations = require('../../data/NewYorkCity/NewYorkCityStations.json');
    } else if (selectedCity === 'Berlin') {
      stations = require('../../data/Berlin/BerlinStations.json');
    } else if (selectedCity === 'Barcelona') {
      stations = require('../../data/Barcelona/BarcelonaStations.json');
    } else if (selectedCity === 'Rome') {
      stations = require('../../data/Rome/RomeStations.json');
    }
  } catch (error) {
    console.error('Error loading station data:', error);
  }

  useEffect(() => {
    if (mapInstance) {
      mapInstance.on('style.load', () => {
    
      stations.features.forEach((feature) => {
        const coordinates = feature.geometry.coordinates as LngLatLike
        const markerElement = document.createElement("div")
        const markerId = `marker_${feature.properties.name}`;
        markerElement.id = markerId;
        // markerElement.className = styles.markerHidden

        const lineProperty = feature.properties.line;
        markerElement.dataset.lineProperty = lineProperty
        const stationName = feature.properties.name
        markerElement.dataset.stationName = stationName

        const marker = new maplibregl.Marker({
          element: markerElement,  
          // @ts-ignore
          defaultMarker: false
        })
          .setLngLat(coordinates)
          .setOffset([0,0]);
        marker.addTo(mapInstance);

        const labelElement = document.createElement("div")
        labelElement.textContent = feature.properties.name
        const labelId = `label_${feature.properties.name}`
        labelElement.id = labelId
        labelElement.className = styles.labelHidden
        markerElement.appendChild(labelElement)

      })

      addTubeLines(mapInstance, selectedCity)
    })
    }
  }, [mapInstance, selectedCity, gameStarted]);

  function toggleLayerVisibility(city: string, randomStation: string, gameStarted: boolean) {
    const cityData = tubeDataConfig[city];
    if (!cityData) {
      console.error('Tube data not available for selected city');
      return;
    }
  
    // Get all line IDs from cityData
    const lineIds = Object.keys(cityData);
  
    if (gameStarted) {
      // Check each line to determine visibility based on randomStation
      lineIds.forEach((lineId) => {
        const line = cityData[lineId];
        const features = line.data.features;
        
        // Check if randomStation is part of this line
        const stationOnLine = features.some((feature:any) => feature.properties.name === randomStation);
  
        if (stationOnLine) {
          // Show the line if randomStation is on it
          mapInstance?.setLayoutProperty(lineId, 'visibility', 'visible');
        } else {
          // Hide the line if randomStation is not on it
          mapInstance?.setLayoutProperty(lineId, 'visibility', 'none');
        }
      });
    } else {
      // If game is not started, show all lines
      lineIds.forEach((lineId) => {
        mapInstance?.setLayoutProperty(lineId, 'visibility', 'visible');
      });
    }
  }

  useEffect(() => {
    if (mapInstance && randomStation && gameStarted) {
      toggleLayerVisibility(selectedCity, randomStation, gameStarted);
    }
  }, [mapInstance, selectedCity, randomStation, gameStarted]);

  function showAllLines(city: string) {
    const cityData = tubeDataConfig[city];
    if (!cityData) {
      console.error('Tube data not available for selected city');
      return;
    }
  
    // Get all line IDs from cityData
    const lineIds = Object.keys(cityData);
  
    // Show all lines
    lineIds.forEach((lineId) => {
      mapInstance?.setLayoutProperty(lineId, 'visibility', 'visible');
    });
  }

  useEffect(() => {
    if (!gameStarted && mapInstance) {
      // User is trying again, so show all lines
      showAllLines(selectedCity);
    }
  }, [gameStarted, selectedCity]);
  
  useEffect(() => {
    if (mapInstance) {
      if (randomStation) {
        const selectedFeature = stations.features.find((feature) =>
        feature.properties.name.includes(randomStation)
      )

        if (selectedFeature) {
          const coordinates = selectedFeature.geometry.coordinates as LngLatLike
          
          if (gameStarted) {
            setTimeout(() => {
              mapInstance.easeTo({
                center: coordinates,
                zoom: 13
              })
            }, 200)
          } 
        }
      }
    }
  })



  return (
    <div className="map-wrap">
      <div ref={mapContainer} className={styles.map} />
    </div>
  );
}

export default Map