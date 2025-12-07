import React, { useState, useMemo, useEffect, useRef } from 'react';
import { RAW_CSV_DATA } from './constants';
import { parseCSV } from './utils';
import { PortfolioItem } from './types';
import PortfolioCard from './components/PortfolioCard';
import DetailModal from './components/DetailModal';
import GeminiEditor from './components/GeminiEditor';
import { LayoutGrid, Filter, Search, User, Sparkles, XCircle, ChevronRight, Camera, Edit } from 'lucide-react';

const App: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [filterSection, setFilterSection] = useState<string>('All');
  const [filterFeatured, setFilterFeatured] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'portfolio' | 'ai'>('portfolio');
  
  // Use a more appropriate placeholder initially
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80');
  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Parse data on load
    const parsedItems = parseCSV(RAW_CSV_DATA);
    setItems(parsedItems);
  }, []);

  // Compute Sections
  const sections = useMemo(() => {
    const s = new Set(items.map(i => i.section));
    return ['All', ...Array.from(s)];
  }, [items]);

  // Filter and Sort Items
  const filteredItems = useMemo(() => {
    let result = items;

    if (filterSection !== 'All') {
      result = result.filter(i => i.section === filterSection);
    }

    if (filterFeatured) {
      result = result.filter(i => i.status === 'Featured');
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i => 
        i.title.toLowerCase().includes(q) || 
        i.content.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort: Section -> Order asc -> Date desc
    return result.sort((a, b) => {
      if (a.section !== b.section) return a.section.localeCompare(b.section);
      if (a.order !== b.order) return a.order - b.order;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  }, [items, filterSection, filterFeatured, searchQuery]);

  // Group by Section for display
  const groupedItems = useMemo(() => {
    const groups: Record<string, PortfolioItem[]> = {};
    filteredItems.forEach(item => {
      if (!groups[item.section]) groups[item.section] = [];
      groups[item.section].push(item);
    });
    return groups;
  }, [filteredItems]);

  const hasActiveFilters = filterSection !== 'All' || filterFeatured || searchQuery !== '';

  const clearAllFilters = () => {
    setFilterSection('All');
    setFilterFeatured(false);
    setSearchQuery('');
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditProfileImage = () => {
    setImageToEdit(profileImage);
    setView('ai');
  };

  return (
    <div className="min-h-screen bg-[#F0F9FF] text-slate-800 font-sans">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-brand-primary rounded flex items-center justify-center text-white font-bold text-lg shadow-sm">
                D
              </div>
              <span className="font-semibold text-lg tracking-tight text-slate-900">Dirshaye Consulting</span>
            </div>
            
            <div className="flex items-center gap-6">
               <button 
                onClick={() => setView('portfolio')}
                className={`text-sm font-medium transition-colors ${view === 'portfolio' ? 'text-brand-primary' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Portfolio
              </button>
              <button 
                onClick={() => setView('ai')}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors px-3 py-1.5 rounded-full ${view === 'ai' ? 'bg-brand-primary/10 text-brand-primary' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Playground
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-[#0A4D68] text-white overflow-hidden">
        {/* Background Gradients & Textures */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A4D68] to-[#052e40] z-0"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-0"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/5 rounded-full blur-3xl z-0"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl z-0"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
            <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16 lg:gap-24">
                
                {/* Text Content */}
                <div className="flex-1 text-center md:text-left space-y-6">
                    <div>
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-cyan-100 text-sm font-medium backdrop-blur-sm mb-4">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                            Available for Consulting
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                            MEAL Expert
                        </h1>
                        <p className="text-xl md:text-2xl text-cyan-100/90 font-light mt-2">
                             & Strategic Advisor
                        </p>
                    </div>
                    
                    <p className="text-lg text-slate-300 max-w-xl mx-auto md:mx-0 font-light leading-relaxed">
                        Specializing in Program Quality, MEAL Systems, and Governance for humanitarian and development sectors.
                    </p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                        <div className="flex flex-col px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <span className="text-2xl font-bold text-white">18+</span>
                            <span className="text-xs text-cyan-200/70 uppercase tracking-wider font-semibold">Projects</span>
                        </div>
                        <div className="flex flex-col px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <span className="text-2xl font-bold text-white">1.5k</span>
                            <span className="text-xs text-cyan-200/70 uppercase tracking-wider font-semibold">Training Hours</span>
                        </div>
                        <div className="flex flex-col px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <span className="text-2xl font-bold text-white">2025</span>
                            <span className="text-xs text-cyan-200/70 uppercase tracking-wider font-semibold">Latest Update</span>
                        </div>
                    </div>
                </div>

                {/* Profile Image */}
                <div className="flex flex-col items-center gap-4">
                  <div className="relative shrink-0 group">
                      <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl transform group-hover:scale-105 transition-transform duration-700"></div>
                      <div className="relative w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80 rounded-full border-4 border-white/20 shadow-2xl overflow-hidden bg-slate-800">
                          <img 
                              src={profileImage} 
                              alt="Dirshaye Beyene" 
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Change Photo Overlay */}
                          <div 
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                            onClick={() => profileInputRef.current?.click()}
                          >
                            <div className="text-white flex flex-col items-center gap-2">
                                <Camera className="w-8 h-8" />
                                <span className="text-sm font-medium">Change Photo</span>
                            </div>
                          </div>
                          <input 
                            type="file" 
                            ref={profileInputRef} 
                            onChange={handleProfileImageUpload} 
                            accept="image/*" 
                            className="hidden" 
                          />
                      </div>
                      
                      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-white text-brand-primary p-2.5 rounded-full shadow-lg border border-slate-100 z-20">
                          <User className="w-5 h-5" />
                      </div>
                  </div>
                  
                  <button 
                    onClick={handleEditProfileImage}
                    className="flex items-center gap-2 text-cyan-200 hover:text-white transition-colors text-sm font-medium px-4 py-2 rounded-full hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                    Edit with AI
                  </button>
                </div>

            </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {view === 'portfolio' && (
          <>
            {/* Filters */}
            <div className="mb-8 flex flex-col lg:flex-row justify-between gap-4 sticky top-16 z-30 bg-[#F0F9FF]/95 backdrop-blur py-4 -mx-4 px-4 border-b border-transparent lg:border-none lg:static lg:bg-transparent lg:p-0 transition-all">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                <Filter className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
                {sections.map(section => (
                  <button
                    key={section}
                    onClick={() => setFilterSection(section)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      filterSection === section 
                      ? 'bg-brand-primary text-white shadow-md' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-white/50'
                    }`}
                  >
                    {section}
                  </button>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                 <div className="relative group w-full sm:w-auto">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-primary" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-1.5 rounded-full border border-slate-200 text-sm focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary outline-none w-full sm:w-64 bg-white/50 focus:bg-white transition-colors"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                 </div>
                 
                 <label className="flex items-center gap-2 cursor-pointer select-none">
                   <div className="relative">
                     <input type="checkbox" checked={filterFeatured} onChange={(e) => setFilterFeatured(e.target.checked)} className="sr-only peer" />
                     <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                   </div>
                   <span className={`text-sm font-medium ${filterFeatured ? 'text-amber-600' : 'text-slate-600'}`}>Featured Only</span>
                 </label>

                 {hasActiveFilters && (
                   <button
                     onClick={clearAllFilters}
                     className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 rounded-full border border-transparent hover:border-red-100"
                   >
                     <XCircle className="w-4 h-4" />
                     Clear Filters
                   </button>
                 )}
              </div>
            </div>

            {/* Grid */}
            <div className="space-y-12">
              {Object.keys(groupedItems).length === 0 ? (
                <div className="text-center py-20 text-slate-400">
                  <p className="text-lg">No items found matching your criteria.</p>
                  <button 
                    onClick={clearAllFilters}
                    className="mt-4 text-brand-primary hover:underline font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                Object.entries(groupedItems).map(([section, sectionItems]: [string, PortfolioItem[]]) => (
                  <div key={section} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center gap-4 mb-6">
                      <h2 className="text-2xl font-bold text-slate-800">{section}</h2>
                      <div className="h-px flex-1 bg-slate-200/60"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sectionItems.map((item, idx) => (
                        <PortfolioCard 
                          key={`${item.title}-${idx}`} 
                          item={item} 
                          onClick={setSelectedItem} 
                        />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {view === 'ai' && (
          <div className="max-w-4xl mx-auto animate-in fade-in zoom-in duration-500">
             <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">Nano Banana Powered App</h2>
                <p className="text-lg text-slate-600">
                  Experience the power of <span className="font-semibold text-brand-primary">Gemini 2.5 Flash Image</span> directly in the browser.
                  Upload your project visuals or diagrams and use natural language to refine them.
                </p>
             </div>
             <GeminiEditor initialImage={imageToEdit} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} Dirshaye Consulting. All rights reserved.</p>
          <p className="mt-2 text-xs">Built with React, Tailwind, and Gemini API.</p>
        </div>
      </footer>

      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};

export default App;