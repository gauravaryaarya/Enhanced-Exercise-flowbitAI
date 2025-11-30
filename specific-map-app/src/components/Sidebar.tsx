import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronLeft, Trash2, Eye, EyeOff, MoreVertical, 
  Plus, ChevronDown, ChevronRight, User, Home, LayoutGrid 
} from 'lucide-react';

interface SidebarProps {
  onSearch: (query: string) => void;
  areas: { geojson: any, visible: boolean }[];
  onDeleteArea: (index: number) => void;
  onConfirm: () => void;
  onBack: () => void;
  viewMode: 'search' | 'scope';
  showLayer: boolean;
  toggleLayer: () => void;
  onToggleAreaVisibility: (index: number) => void;
  onSelectArea: (index: number | null) => void; // NEW
  selectedAreaIndex: number | null;             // NEW
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onSearch, areas, onDeleteArea, onConfirm, onBack, viewMode, showLayer, toggleLayer, 
  onToggleAreaVisibility, onSelectArea, selectedAreaIndex 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<{ display_name: string }[]>([]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
        if (searchQuery.length > 2) {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}&addressdetails=1&limit=5`);
                const data = await response.json();
                setSuggestions(data);
                setShowDropdown(true);
            } catch (error) { console.error(error); }
        } else { setSuggestions([]); setShowDropdown(false); }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handlers omitted for brevity (same as before)
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => { setSearchQuery(e.target.value); };
  const handleManualSearch = (e: React.FormEvent) => { e.preventDefault(); if(searchQuery.trim()) onSearch(searchQuery); setShowDropdown(false); }
  const selectSuggestion = (val: string) => { const cleanName = val.split(',')[0]; setSearchQuery(val); setShowDropdown(false); onSearch(val); };

  return (
    <div className="h-full flex flex-row shadow-2xl font-sans pointer-events-auto relative z-[2000]">
      {/* LEFT RAIL (Keep same) */}
      <div className="w-16 h-full bg-black/40 backdrop-blur-md flex flex-col items-center py-6 gap-8 shrink-0 border-r border-white/10">
        <div className="mb-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="#E6B985" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#E6B985" stroke="#E6B985" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
        <div className="flex flex-col gap-8 w-full items-center"><Home size={28} className="text-[#E6B985]" /><LayoutGrid size={28} className="text-[#E6B985]" /></div>
        <div className="mt-auto mb-2"><div className="w-10 h-10 rounded-full border-2 border-[#E6B985] flex items-center justify-center text-[#E6B985]"><User size={20} /></div></div>
      </div>

      {/* MAIN PANEL */}
      <div className="w-[380px] h-full bg-white flex flex-col relative shadow-xl">
        <div className="p-6 pb-4">
            <div className="flex items-center gap-3 text-slate-400 font-light mb-6 cursor-pointer hover:text-slate-600 transition" onClick={onBack}>
                <ChevronLeft size={22} strokeWidth={1} />
                <div className="h-6 w-[1px] bg-slate-200"></div>
                <h1 className="text-xl text-[#C0773E] font-normal">{viewMode === 'search' ? "Define Area of Interest" : "Define Project Scope"}</h1>
            </div>
        </div>

        {viewMode === 'scope' && (
            <div className="flex-1 overflow-y-auto flex flex-col">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-2 text-slate-500 font-light text-lg"><ChevronRight size={18} /><span>Base Layers</span></div>
                      <div className="flex items-center gap-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs text-slate-400 font-medium">Satellite WMS</span>
                          <button onClick={toggleLayer} className={`w-10 h-5 rounded-full p-1 transition-colors ${showLayer ? 'bg-[#C0773E]' : 'bg-slate-300'}`}><div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${showLayer ? 'translate-x-5' : 'translate-x-0'}`} /></button>
                      </div>
                </div>

                <div className="border-b border-slate-100 pb-4">
                    <div className="px-6 py-4 flex items-center justify-between text-slate-600 cursor-pointer">
                        <div className="flex items-center gap-2 font-normal text-lg"><ChevronDown size={18} /><span>Define Area of Interest</span></div>
                        <Plus size={20} className="text-slate-400" />
                    </div>
                    <div className="px-6 space-y-1">
                        {areas.map((area, idx) => (
                            <div 
                                key={idx} 
                                // FIX: Click logic and Active Styling
                                onClick={() => onSelectArea(idx)}
                                className={`flex items-center justify-between py-2 px-2 rounded group cursor-pointer transition-colors
                                    ${selectedAreaIndex === idx ? 'bg-[#FFF3E0] border border-[#FFE0B2]' : 'hover:bg-slate-50 border border-transparent'}
                                    ${!area.visible ? 'opacity-50' : ''}`}
                            >
                                <div className="flex items-center gap-4 pl-4">
                                    <ChevronRight size={14} className={`text-slate-400 ${selectedAreaIndex === idx ? 'text-[#C0773E]' : ''}`} />
                                    <div className="w-5 h-5 bg-[#F2D7B8] rounded-sm"></div>
                                    <span className={`font-light text-lg ${selectedAreaIndex === idx ? 'text-[#C0773E] font-medium' : 'text-slate-600'}`}>Area {idx + 1}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Trash2 size={18} className="cursor-pointer hover:text-red-500" onClick={(e) => { e.stopPropagation(); onDeleteArea(idx); }} />
                                    <div className="cursor-pointer hover:text-slate-800" onClick={(e) => { e.stopPropagation(); onToggleAreaVisibility(idx); }}>
                                        {area.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )}

        {viewMode === 'search' && (
             <div className="flex-1 px-6 py-2">
                 {/* Search UI omitted for brevity, logic remains identical to previous valid version */}
                 <p className="text-slate-500 text-sm mb-6 font-light">Search or use vector tool to create your region.</p>
                <div className="relative mb-6">
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Search Area</label>
                    <form onSubmit={handleManualSearch} className="relative">
                        <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        <input type="text" placeholder="Type a city name (e.g. London)" className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#C0773E]" value={searchQuery} onChange={handleSearchChange} />
                    </form>
                    {showDropdown && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 w-full bg-white border border-slate-100 shadow-xl rounded-lg mt-1 z-50 max-h-60 overflow-y-auto">
                            {suggestions.map((s, i) => (
                                <div key={i} onClick={() => selectSuggestion(s.display_name)} className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 text-sm text-slate-700 leading-snug">{s.display_name}</div>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={() => onConfirm()} disabled={areas.length === 0} className={`w-full py-3 text-white rounded-md font-medium text-sm shadow-sm transition mb-2 ${areas.length > 0 ? 'bg-[#C0773E] hover:bg-[#A66330]' : 'bg-slate-300'}`}>Apply outline as base image</button>
                <div className="mt-auto border-t border-slate-100 pt-4">
                     <button onClick={onConfirm} disabled={areas.length === 0} className={`w-full py-4 text-white rounded-lg font-semibold shadow-lg ${areas.length > 0 ? 'bg-[#C0773E]' : 'bg-slate-300'}`}>Confirm Area of Interest</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
export default Sidebar;