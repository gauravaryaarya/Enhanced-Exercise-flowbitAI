import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import MapDisplay from './components/Map/MapDisplay'; 
import L from 'leaflet';

function App() {
  const [searchCoords, setSearchCoords] = useState<[number, number] | null>(null);
  const [areas, setAreas] = useState<{ geojson: any, visible: boolean }[]>(() => {
    const saved = localStorage.getItem('aoi_shapes');
    return saved ? JSON.parse(saved) : [];
  });

  const [viewMode, setViewMode] = useState<'search' | 'scope'>('search');
  const [showLayer, setShowLayer] = useState(true);
  
  // FIX 1: New State for Highlighting
  const [selectedAreaIndex, setSelectedAreaIndex] = useState<number | null>(null);
  
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  useEffect(() => {
    localStorage.setItem('aoi_shapes', JSON.stringify(areas));
  }, [areas]);

  const handleSearch = async (query: string) => {
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
        const data = await response.json();
        if (data && data.length > 0) {
            const { lat, lon } = data[0];
            setSearchCoords([parseFloat(lat), parseFloat(lon)]);
        } else {
            alert("Location not found!");
        }
    } catch (error) {
        console.error("Search failed", error);
    }
  };

  const handleAreaCreated = (e: any) => {
    const { layer } = e;
    setAreas(prev => [...prev, { geojson: layer.toGeoJSON(), visible: true }]);
  };

  const handleDeleteArea = (index: number) => {
    const newAreas = areas.filter((_, i) => i !== index);
    setAreas(newAreas);
    if (selectedAreaIndex === index) setSelectedAreaIndex(null); // Clear selection if deleted
  };

  const handleToggleAreaVisibility = (index: number) => {
    const newAreas = [...areas];
    newAreas[index].visible = !newAreas[index].visible;
    setAreas(newAreas);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <MapDisplay 
            searchCoords={searchCoords}
            onAreaCreated={handleAreaCreated}
            onAreaDeleted={() => {}} 
            featureGroupRef={featureGroupRef}
            showLayer={showLayer}
            existingShapes={areas}
            selectedAreaIndex={selectedAreaIndex} // PASS DOWN
        />
      </div>

      <div className="absolute top-0 left-0 h-full w-full z-[1000] pointer-events-none flex">
        <Sidebar 
            onSearch={handleSearch} 
            areas={areas}
            onDeleteArea={handleDeleteArea}
            onConfirm={() => setViewMode('scope')}
            onBack={() => setViewMode('search')}
            viewMode={viewMode}
            showLayer={showLayer}
            toggleLayer={() => setShowLayer(!showLayer)}
            onToggleAreaVisibility={handleToggleAreaVisibility}
            onSelectArea={setSelectedAreaIndex}   // PASS DOWN
            selectedAreaIndex={selectedAreaIndex} // PASS DOWN
        />
      </div>
    </div>
  );
}

export default App;