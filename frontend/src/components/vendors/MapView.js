'use client';

import { useEffect, useRef } from 'react';

export default function MapView({ longitude, latitude, zoom = 13 }) {
  const mapContainerRef = useRef(null);
  
  useEffect(() => {
    if (!longitude || !latitude || !window.mapboxgl) return;
    
    const initializeMap = async () => {
      
      console.log(`Map would show location at: ${latitude}, ${longitude} with zoom level ${zoom}`);
      
      const container = mapContainerRef.current;
      if (container) {
        container.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gray-100 text-gray-700">
            <div class="text-center">
              <p>Map would display here</p>
              <p>Coordinates: ${latitude}, ${longitude}</p>
            </div>
          </div>
        `;
      }
    };
    
    initializeMap();
  }, [longitude, latitude, zoom]);
  
  return (
    <div ref={mapContainerRef} className="h-64 w-full rounded-lg border border-gray-300"></div>
  );
}
