import React, { useEffect } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import CustomDrawControl from '../CustomDrawControl';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon, shadowUrl: iconShadow,
    iconSize: [25, 41], iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapFlyTo = ({ coords }: { coords: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) map.flyTo(coords, 13, { duration: 2 });
    }, [coords, map]);
    return null;
};

interface MapDisplayProps {
    searchCoords: [number, number] | null;
    onAreaCreated: (layer: any) => void;
    onAreaDeleted: (layers: any) => void;
    featureGroupRef: React.MutableRefObject<L.FeatureGroup | null>;
    showLayer: boolean;
    existingShapes: { geojson: any, visible: boolean }[];
    selectedAreaIndex: number | null; // NEW PROP
}

const MapDisplay: React.FC<MapDisplayProps> = ({ 
  searchCoords, onAreaCreated, onAreaDeleted, featureGroupRef, showLayer, existingShapes, selectedAreaIndex 
}) => {
  const position: [number, number] = [50.9375, 6.9603];

  // FIX: Re-render with Highlight Styles
  useEffect(() => {
    if (featureGroupRef.current) {
        featureGroupRef.current.clearLayers();

        existingShapes.forEach((shape, index) => {
            if (shape.visible) {
                L.geoJSON(shape.geojson, {
                    onEachFeature: (_feature, layer) => {
                        if (layer instanceof L.Path) {
                            // CHECK IF SELECTED
                            const isSelected = index === selectedAreaIndex;
                            
                            layer.setStyle({ 
                                color: isSelected ? '#FFD700' : '#C0773E', // GOLD vs BROWN
                                weight: isSelected ? 4 : 2,                // THICK vs THIN
                                fillOpacity: isSelected ? 0.6 : 0.2        // BRIGHT vs TRANSPARENT
                            });
                            
                            // Optional: Bring selected to front so it's not covered
                            if(isSelected) {
                                setTimeout(() => layer.bringToFront(), 10);
                            }
                        }
                        featureGroupRef.current?.addLayer(layer);
                    }
                });
            }
        });
    }
  }, [existingShapes, selectedAreaIndex]); // Trigger when selection changes

  return (
    <div className="h-full w-full relative">
       <CustomDrawControl />
       <MapContainer center={position} zoom={12} zoomControl={false} className="h-full w-full outline-none">
        <MapFlyTo coords={searchCoords} />
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution="Esri" />
        {showLayer && (
            <WMSTileLayer url="https://www.wms.nrw.de/geobasis/wms_nw_dop" layers="nw_dop_rgb" format="image/png" transparent={true} version="1.3.0" />
        )}
        <FeatureGroup ref={featureGroupRef}>
            <EditControl
            position="topright"
            onCreated={onAreaCreated}
            onDeleted={onAreaDeleted}
            draw={{
                rectangle: true,
                polygon: {
                    allowIntersection: true,
                    showArea: true,
                    shapeOptions: { color: '#C0773E', fillOpacity: 0.2 }
                },
                polyline: true, marker: true, circle: false, circlemarker: false
            }}
            />
        </FeatureGroup>
      </MapContainer>
      
      {/* Tooltip omitted for brevity */}
    </div>
  );
};

export default MapDisplay;