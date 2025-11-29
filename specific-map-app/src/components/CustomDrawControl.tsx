import React from 'react';
import { Activity, Hexagon, MousePointer2, Move, Spline, SquareDashedBottom } from 'lucide-react';

const CustomDrawControl = () => {
  
  // Helper to trigger the real hidden Leaflet buttons
  const triggerLeafletDraw = (actionClass: string) => {
    const btn = document.querySelector(actionClass) as HTMLElement;
    if (btn) btn.click();
  };

  return (
    <div className="absolute top-1/2 right-6 transform -translate-y-1/2 z-[1000] bg-white rounded-2xl shadow-2xl p-2 flex flex-col gap-3 w-14 items-center border border-slate-100/50">
      
      {/* 1. Polyline (Zigzag) */}
      <button 
        onClick={() => triggerLeafletDraw('.leaflet-draw-draw-polyline')}
        className="p-2 rounded-xl hover:bg-[#FFF8F3] text-[#C0773E] transition-colors group relative"
        title="Draw Line"
      >
        <Activity size={24} strokeWidth={1.5} />
      </button>

      {/* 2. Polygon (Curved/Shape) */}
      <button 
        onClick={() => triggerLeafletDraw('.leaflet-draw-draw-polygon')}
        className="p-2 rounded-xl hover:bg-[#FFF8F3] text-[#C0773E] transition-colors"
        title="Draw Shape"
      >
        <Spline size={24} strokeWidth={1.5} />
      </button>

      {/* 3. Rectangle (Dotted Box) */}
      <button 
        onClick={() => triggerLeafletDraw('.leaflet-draw-draw-rectangle')}
        className="p-2 rounded-xl hover:bg-[#FFF8F3] text-[#C0773E] transition-colors"
        title="Draw Box"
      >
        <SquareDashedBottom size={24} strokeWidth={1.5} />
      </button>

      {/* --- DIVIDER LINE --- */}
      <div className="w-8 h-[1.5px] bg-[#C0773E]/30 rounded-full my-1"></div>

      {/* 4. Edit Mode (Arrow) */}
      <button 
        onClick={() => triggerLeafletDraw('.leaflet-draw-edit-edit')}
        className="p-2 rounded-xl hover:bg-[#FFF8F3] text-[#C0773E] transition-colors"
        title="Edit Shapes"
      >
        <MousePointer2 size={24} strokeWidth={1.5} />
      </button>

      {/* 5. Delete Mode (Selection Box) */}
      <button 
        onClick={() => triggerLeafletDraw('.leaflet-draw-edit-remove')}
        className="p-2 rounded-xl hover:bg-[#FFF8F3] text-[#C0773E] transition-colors"
        title="Delete Shapes"
      >
        {/* Using a distinct icon for delete/select mode */}
        <Move size={24} strokeWidth={1.5} />
      </button>

    </div>
  );
};

export default CustomDrawControl;