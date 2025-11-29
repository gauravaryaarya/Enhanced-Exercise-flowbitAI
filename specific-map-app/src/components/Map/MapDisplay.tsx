import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import CustomDrawControl from './../CustomDrawControl';

// Fix icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon, shadowUrl: iconShadow,
    iconSize: [25, 41], iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to fly to search result
const MapFlyTo = ({ coords }: { coords: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.flyTo(coords, 13, { duration: 2 });
        }
    }, [coords, map]);
    return null;
};

interface MapDisplayProps {
    searchCoords: [number, number] | null;
    onAreaCreated: (layer: any) => void;
    onAreaDeleted: (layers: any) => void;
    featureGroupRef: React.MutableRefObject<L.FeatureGroup | null>;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ searchCoords, onAreaCreated, onAreaDeleted, featureGroupRef }) => {
  const position: [number, number] = [50.9375, 6.9603]; // Cologne (Köln) Coordinates as per screenshot

  return (
    <div className="h-full w-full relative">
       <CustomDrawControl />
       <MapContainer center={position} zoom={12} zoomControl={false} className="h-full w-full outline-none">
        
        <MapFlyTo coords={searchCoords} />

        {/* 1. Dark Satellite Layer (Matches the 'dark' look in screenshot) */}
        <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="Esri"
        />

        {/* 2. Hybrid Overlay (Roads on top of satellite) - Optional but looks like Figma */}
        <TileLayer 
             url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
              opacity={1}
        />
        
        {/* 3. The NRW WMS Layer (Required by task) */}
        <WMSTileLayer
          url="https://www.wms.nrw.de/geobasis/wms_nw_dop"
          layers="nw_dop_rgb"
          format="image/png"
          transparent={true}
          version="1.3.0"
        />

        <FeatureGroup ref={featureGroupRef}>
            <EditControl
            position="topright" // CSS will move this to the right-center
            onCreated={onAreaCreated}
            onDeleted={onAreaDeleted}
            draw={{
                rectangle: true,
                polygon: {
                    allowIntersection: true,
                    showArea: true,
                    shapeOptions: {
                        color: '#C0773E', // Match brand color
                        fillOpacity: 0.2
                    }
                },
                circle: false,
                marker: false,
                circlemarker: false,
                polyline: false
            }}
            />
        </FeatureGroup>
      </MapContainer>
      
      {/* Floating Tooltip (Matches Screenshot 3) */}
      <div className="absolute top-1/2 right-24 transform -translate-y-1/2 bg-black/80 text-white p-4 rounded-lg max-w-[200px] text-sm backdrop-blur-md z-[400] shadow-xl border border-white/10">
         Create your own vector shape. <br/>
         <span className="text-gray-400 text-xs mt-2 block">Use the tools on the right.</span>
      </div>

    </div>
  );
};

export default MapDisplay;