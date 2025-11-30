import { useState, useRef } from 'react';
import Sidebar from './components/Sidebar';
// Note: Ensure this path matches your folder structure. 
// If it's directly in components, remove the extra '/Map'
import MapDisplay from './components/Map/MapDisplay'; 
import L from 'leaflet';

function App() {
  const [showLabels, setShowLabels] = useState(true);
  const [searchCoords, setSearchCoords] = useState<[number, number] | null>(null);
  const [areas, setAreas] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'search' | 'scope'>('search');
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  const handleSearch = async (query: string) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        const data = await response.json();
        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            setSearchCoords([parseFloat(lat), parseFloat(lon)]);
        }
    } catch (error) {
        console.error("Search failed", error);
    }
  };

  const handleAreaCreated = (e: any) => {
    const { layer } = e;
    setAreas(prev => [...prev, layer.toGeoJSON()]);
  };

  const handleDeleteArea = (index: number) => {
    const newAreas = areas.filter((_, i) => i !== index);
    setAreas(newAreas);
    if (featureGroupRef.current) {
        featureGroupRef.current.clearLayers();
        L.geoJSON(newAreas as any).eachLayer((layer) => {
            // @ts-ignore
            featureGroupRef.current?.addLayer(layer);
        });
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <MapDisplay 
            searchCoords={searchCoords}
            onAreaCreated={handleAreaCreated}
            onAreaDeleted={() => {}} 
            featureGroupRef={featureGroupRef}
            showLabels={showLabels} // PASS DOWN
        />
      </div>

      <div className="absolute top-0 left-0 h-full w-full z-[1000] pointer-events-none flex">
        <Sidebar 
            onSearch={handleSearch} 
            areas={areas}
            onDeleteArea={handleDeleteArea}
            onConfirm={() => setViewMode('scope')}
            viewMode={viewMode}
            showLabels={showLabels}       // PASS DOWN
            toggleLabels={() => setShowLabels(!showLabels)} // PASS DOWN
        />
      </div>
    </div>
  );
}
export default App;