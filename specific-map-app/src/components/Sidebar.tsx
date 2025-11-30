import React, { useState } from 'react';
import { 
  Search, ChevronLeft, Trash2, Eye, MoreVertical, 
  Plus, ChevronDown, ChevronRight, User, Home, LayoutGrid, Map as MapIcon 
} from 'lucide-react';

interface SidebarProps {
  onSearch: (query: string) => void;
  areas: any[];
  onDeleteArea: (index: number) => void;
  onConfirm: () => void;
  viewMode: 'search' | 'scope';
  showLabels: boolean;     // Defined here
  toggleLabels: () => void; // Defined here
}

// FIX IS HERE: Added 'showLabels' and 'toggleLabels' to the destructuring below
const Sidebar: React.FC<SidebarProps> = ({ 
  onSearch, 
  areas, 
  onDeleteArea, 
  onConfirm, 
  viewMode, 
  showLabels, 
  toggleLabels 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Suggestions for search
  const suggestions = [
    { main: "Cologne", sub: "City Proper" },
    { main: "Cologne", sub: "Inner City / Downtown" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(e.target.value.length > 0);
  };

  const selectSuggestion = (val: string) => {
    setSearchQuery(val);
    setShowDropdown(false);
    onSearch(val);
  };

  return (
    <div className="h-full flex flex-row shadow-2xl font-sans pointer-events-auto relative z-[2000]">
      
      {/* 1. LEFT RAIL: Dull Black Less Opaque */}
      <div className="w-16 h-full bg-black/10 backdrop-blur-md flex flex-col items-center py-6 gap-8 shrink-0 border-r border-white/10">
        
        {/* Logo Icon (Top) */}
        <div className="mb-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="#E6B985" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" fill="#E6B985" stroke="#E6B985" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </div>

        {/* Middle Nav Icons */}
        <div className="flex flex-col gap-8 w-full items-center">
           <Home size={28} className="text-[#E6B985] cursor-pointer hover:opacity-80" strokeWidth={2.5} />
           <LayoutGrid size={28} className="text-[#E6B985] cursor-pointer hover:opacity-80" strokeWidth={2.5} fill="#E6B985" fillOpacity={0.2} />
        </div>

        {/* Bottom User Icon */}
        <div className="mt-auto mb-2">
            <div className="w-10 h-10 rounded-full border-2 border-[#E6B985] flex items-center justify-center text-[#E6B985]">
                <User size={20} strokeWidth={2.5} />
            </div>
        </div>
      </div>

      {/* 2. MAIN WHITE PANEL */}
      <div className="w-[380px] h-full bg-white flex flex-col relative shadow-xl">
        
        {/* Header Section */}
        <div className="p-6 pb-4">
            <div className="flex items-center gap-3 text-slate-400 font-light mb-6 cursor-pointer hover:text-slate-600 transition">
                <ChevronLeft size={22} strokeWidth={1} />
                <div className="h-6 w-[1px] bg-slate-200"></div>
                <h1 className="text-xl text-[#C0773E] font-normal">
                    {viewMode === 'search' ? "Define Area of Interest" : "Define Project Scope"}
                </h1>
            </div>
        </div>

        {/* --- CONTENT: SCOPE VIEW --- */}
        {viewMode === 'scope' && (
            <div className="flex-1 overflow-y-auto flex flex-col">
                
                {/* Accordion 1: Select Base Image (Layer Toggle) */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-2 text-slate-500 font-light text-lg">
                          <ChevronRight size={18} />
                          <span>Base Layers</span>
                      </div>
                      
                      {/* Layer Toggle Switch */}
                      <div className="flex items-center gap-2 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs text-slate-400 font-medium">Labels</span>
                          <button 
                              onClick={toggleLabels}
                              className={`w-10 h-5 rounded-full p-1 transition-colors ${showLabels ? 'bg-[#C0773E]' : 'bg-slate-300'}`}
                          >
                              <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${showLabels ? 'translate-x-5' : 'translate-x-0'}`} />
                          </button>
                      </div>
                </div>

                {/* Accordion 2: Define Area of Interest (ACTIVE) */}
                <div className="border-b border-slate-100 pb-4">
                    <div className="px-6 py-4 flex items-center justify-between text-slate-600 cursor-pointer">
                        <div className="flex items-center gap-2 font-normal text-lg">
                            <ChevronDown size={18} />
                            <span>Define Area of Interest</span>
                        </div>
                        <Plus size={20} className="text-slate-400" />
                    </div>
                    
                    {/* The List of Areas */}
                    <div className="px-6 space-y-1">
                        {areas.map((_, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 px-2 hover:bg-slate-50 rounded group">
                                <div className="flex items-center gap-4 pl-4">
                                    <ChevronRight size={14} className="text-slate-400" />
                                    <div className="w-5 h-5 bg-[#F2D7B8] rounded-sm"></div>
                                    <span className="text-slate-600 font-light text-lg">Area {idx + 1}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Trash2 size={18} className="cursor-pointer hover:text-red-500" onClick={() => onDeleteArea(idx)} />
                                    <Eye size={18} className="cursor-pointer hover:text-slate-800" />
                                    <MoreVertical size={18} className="cursor-pointer hover:text-slate-800" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Accordion 3: Define Objects */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between text-slate-500 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center gap-2 font-light text-lg">
                        <ChevronRight size={18} />
                        <span>Define Objects</span>
                    </div>
                    <Plus size={20} className="text-slate-400" />
                </div>

                {/* BOTTOM FLOATING CARD */}
                <div className="mt-auto mx-6 mb-6">
                    <div className="border border-slate-300 rounded-sm p-5 bg-white shadow-sm text-center">
                        <h3 className="font-normal text-slate-800 text-lg mb-4">Scope Definition Finished</h3>
                        <button className="w-full py-3 bg-[#D6Cebf] text-white font-medium rounded-sm cursor-not-allowed text-sm uppercase tracking-wide">
                            Continue to object(s)
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* --- CONTENT: SEARCH VIEW --- */}
        {viewMode === 'search' && (
             <div className="flex-1 px-6 py-2">
                <p className="text-slate-500 text-sm mb-6 font-light">
                    Search or use vector tool to create your region.
                </p>
                <div className="relative mb-6">
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Search Area</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Cologne City Proper"
                            className="w-full pl-10 pr-4 py-3 bg-[#FAF9F6] border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#C0773E]"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    {showDropdown && (
                        <div className="absolute top-full left-0 w-full bg-white border border-slate-100 shadow-xl rounded-lg mt-1 z-50">
                            {suggestions.map((s, i) => (
                                <div key={i} onClick={() => selectSuggestion(s.main)} className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50">
                                    <div className="font-medium text-slate-700">{s.main}</div>
                                    <div className="text-xs text-slate-400">{s.sub}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                <button 
                    className="w-full py-3 bg-[#C0773E] hover:bg-[#A66330] text-white rounded-md font-medium text-sm shadow-sm transition mb-2"
                >
                    Apply outline as base image
                </button>
                <p className="text-xs text-center text-slate-400 mb-8">
                    You can always edit the shape of the area later
                </p>

                <div className="mt-auto border-t border-slate-100 pt-4">
                     <button 
                        onClick={onConfirm}
                        disabled={areas.length === 0}
                        className={`w-full py-4 text-white rounded-lg font-semibold shadow-lg ${areas.length > 0 ? 'bg-[#C0773E]' : 'bg-slate-300'}`}
                    >
                        Confirm Area of Interest
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;