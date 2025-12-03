"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CharacterCard } from "@/components/character-card";
import { CharacterCardMobile } from "@/components/character-card-mobile";
import { CharacterFilters } from "@/components/character-filters";
import { CharacterFiltersMobile } from "@/components/character-filters-mobile";
import { MobileActions } from "@/components/mobile-actions";
import { Character } from "@/types/character";
import { FlickeringGrid } from "@/components/ui/shadcn-io/flickering-grid";

function CharacterSelectorContent() {
  const searchParams = useSearchParams();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmRemoveAll, setShowConfirmRemoveAll] = useState(false);

  const handleFilterChange = useCallback((filtered: Character[]) => {
    setFilteredCharacters(filtered);
  }, []);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const response = await fetch('/api/characters');
        const data = await response.json();
        setCharacters(data);
        setFilteredCharacters(data); // Initialize filtered characters
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCharacters();
  }, []);

  // Load team code from URL if present
  useEffect(() => {
    const teamCode = searchParams.get('team');
    if (teamCode && characters.length > 0) {
      try {
        const decoded = atob(teamCode);
        const ids = decoded.split(',').filter(id => id.trim() !== '');
        const validIds = ids.filter(id => characters.some(c => c.id === id));
        if (validIds.length > 0) {
          setSelectedCharacterIds(validIds);
        }
      } catch (error) {
        console.error('Error loading team code:', error);
      }
    }
  }, [searchParams, characters]);


  return (
    <main className="relative min-h-screen" style={{ backgroundColor: '#083d4d' }}>
      {/* Flickering Grid Background */}
      <FlickeringGrid
        className="fixed inset-0 z-0"
        squareSize={4}
        gridGap={6}
        flickerChance={0.3}
        color="rgb(120, 180, 200)"
        maxOpacity={0.35}
      />
      
      {/* Frosted Glass Top Bar */}
      {!loading && characters.length > 0 && (
        <div className="sticky top-0 z-50 w-full border-b-2 border-cyan-800/50 bg-cyan-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-cyan-950/60 shadow-lg">
          <div className="container mx-auto px-4 py-2 md:py-4">
            <div className="flex flex-col md:flex-row items-start md:items-start justify-between gap-4 md:gap-8">
              {/* Title Section - Left Side */}
              <div className="flex-shrink-0 w-full md:w-auto">
                <div className="flex items-center gap-1 md:gap-2 mb-1">
                  <span className="text-cyan-500 font-mono text-xs md:text-sm">$</span>
                  <h1 className="text-xl md:text-4xl font-bold tracking-wider text-cyan-100 uppercase truncate" style={{
                    fontFamily: 'monospace',
                    letterSpacing: '0.15em',
                    textShadow: '0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3), 2px 2px 0px rgba(0, 0, 0, 0.5)'
                  }}>
                    HERO_SELECTOR
                  </h1>
                  <span className="text-cyan-500 font-mono text-xs md:text-sm animate-pulse flex-shrink-0">_</span>
                </div>
                
                {/* Status line */}
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs font-mono mb-2">
                  <span className="text-cyan-500">[STATUS]</span>
                  <span className="text-cyan-300">LOADED</span>
                  <span className="text-cyan-500 hidden md:inline">|</span>
                  <span className="text-cyan-500">[COUNT]</span>
                  <span className="text-cyan-100 font-semibold">{filteredCharacters.length}</span>
                  <span className="text-cyan-400">{filteredCharacters.length === 1 ? 'UNIT' : 'UNITS'}</span>
                  <span className="text-cyan-500 hidden md:inline">|</span>
                  <span className="text-cyan-500">[MODE]</span>
                  <span className="text-green-400">ACTIVE</span>
                </div>
                
                {/* Mobile: Return to Menu and Filters on same row */}
                <div className="md:hidden flex items-center justify-between gap-2 w-full">
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-1 px-2 py-1.5 border border-cyan-700 bg-cyan-950/50 text-cyan-200 font-mono text-xs hover:bg-cyan-900/50 transition-all duration-200 rounded flex-shrink-0"
                    style={{
                      boxShadow: "0 0 8px rgba(6, 182, 212, 0.2)"
                    }}
                  >
                    <span>←</span>
                    <span className="hidden sm:inline">[RETURN_TO_MENU]</span>
                    <span className="sm:hidden">[MENU]</span>
                  </Link>
                  <div className="flex-1 flex justify-end">
                    <CharacterFiltersMobile 
                      characters={characters} 
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </div>
                
                {/* Desktop: Return to Menu Button */}
                <div className="hidden md:block">
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-cyan-700 bg-cyan-950/50 text-cyan-200 font-mono text-xs hover:bg-cyan-900/50 transition-all duration-200 rounded"
                    style={{
                      boxShadow: "0 0 8px rgba(6, 182, 212, 0.2)"
                    }}
                  >
                    <span>←</span>
                    <span>[RETURN_TO_MENU]</span>
                  </Link>
                </div>
              </div>
              
              {/* Filters Section - Desktop */}
              <div className="hidden md:block flex-1">
                <CharacterFilters 
                  characters={characters} 
                  onFilterChange={handleFilterChange}
                />
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-4 md:py-8 min-h-screen pb-24 md:pb-8">
        
        {/* Character Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-400 border-r-transparent"></div>
              <p className="mt-4 text-cyan-300 font-mono">[LOADING] INITIALIZING_SELECTOR...</p>
            </div>
          </div>
        ) : (
          <>
            {filteredCharacters.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="rounded-full bg-gray-900 p-4 mb-4">
                  <svg className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-200 mb-1">No characters found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                {/* Desktop Grid */}
                <div className="hidden md:flex flex-row gap-16 justify-center items-start flex-wrap">
                  {filteredCharacters.map((character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      isSelected={selectedCharacterIds.includes(character.id)}
                      onSelect={() => {
                        setSelectedCharacterIds(prev => 
                          prev.includes(character.id)
                            ? prev.filter(id => id !== character.id)
                            : [...prev, character.id]
                        );
                      }}
                    />
                  ))}
                </div>
                {/* Mobile Grid */}
                <div className="md:hidden grid grid-cols-1 gap-8 justify-items-center">
                  {filteredCharacters.map((character) => (
                    <CharacterCardMobile
                      key={character.id}
                      character={character}
                      isSelected={selectedCharacterIds.includes(character.id)}
                      onSelect={() => {
                        setSelectedCharacterIds(prev => 
                          prev.includes(character.id)
                            ? prev.filter(id => id !== character.id)
                            : [...prev, character.id]
                        );
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Desktop Assemble Button */}
            {selectedCharacterIds.length > 0 && (
              <div className="hidden md:block fixed bottom-6 right-6 z-40">
                <a 
                  href={`/assemble?ids=${selectedCharacterIds.join(',')}`}
                  className="cta-button group flex items-center px-12 py-3 text-white transition-all duration-500 relative"
                  style={{
                    fontFamily: 'var(--font-poppins), sans-serif',
                    fontSize: '2rem',
                    background: '#06b6d4',
                    boxShadow: '6px 6px 0 black',
                    transform: 'skewX(-15deg)',
                  }}
                >
                  <span style={{ transform: 'skewX(15deg)' }}>ASSEMBLE</span>
                  <span 
                    className="ml-8 relative top-[12%] transition-all duration-500"
                    style={{ 
                      transform: 'skewX(15deg)',
                      width: '20px'
                    }}
                  >
                    <svg width="66px" height="43px" viewBox="0 0 66 43" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <g id="arrow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <path 
                          className="arrow-one" 
                          d="M40.1543933,3.89485454 L43.9763149,0.139296592 C44.1708311,-0.0518420739 44.4826329,-0.0518571125 44.6771675,0.139262789 L65.6916134,20.7848311 C66.0855801,21.1718824 66.0911863,21.8050225 65.704135,22.1989893 C65.7000188,22.2031791 65.6958657,22.2073326 65.6916762,22.2114492 L44.677098,42.8607841 C44.4825957,43.0519059 44.1708242,43.0519358 43.9762853,42.8608513 L40.1545186,39.1069479 C39.9575152,38.9134427 39.9546793,38.5968729 40.1481845,38.3998695 C40.1502893,38.3977268 40.1524132,38.395603 40.1545562,38.3934985 L56.9937789,21.8567812 C57.1908028,21.6632968 57.193672,21.3467273 57.0001876,21.1497035 C56.9980647,21.1475418 56.9959223,21.1453995 56.9937605,21.1432767 L40.1545208,4.60825197 C39.9574869,4.41477773 39.9546013,4.09820839 40.1480756,3.90117456 C40.1501626,3.89904911 40.1522686,3.89694235 40.1543933,3.89485454 Z" 
                          fill="#FFFFFF"
                        />
                        <path 
                          className="arrow-two" 
                          d="M20.1543933,3.89485454 L23.9763149,0.139296592 C24.1708311,-0.0518420739 24.4826329,-0.0518571125 24.6771675,0.139262789 L45.6916134,20.7848311 C46.0855801,21.1718824 46.0911863,21.8050225 45.704135,22.1989893 C45.7000188,22.2031791 45.6958657,22.2073326 45.6916762,22.2114492 L24.677098,42.8607841 C24.4825957,43.0519059 24.1708242,43.0519358 23.9762853,42.8608513 L20.1545186,39.1069479 C19.9575152,38.9134427 19.9546793,38.5968729 20.1481845,38.3998695 C20.1502893,38.3977268 20.1524132,38.395603 20.1545562,38.3934985 L36.9937789,21.8567812 C37.1908028,21.6632968 37.193672,21.3467273 37.0001876,21.1497035 C36.9980647,21.1475418 36.9959223,21.1453995 36.9937605,21.1432767 L20.1545208,4.60825197 C19.9574869,4.41477773 19.9546013,4.09820839 20.1480756,3.90117456 C20.1501626,3.89904911 20.1522686,3.89694235 20.1543933,3.89485454 Z" 
                          fill="#FFFFFF"
                        />
                        <path 
                          className="arrow-three" 
                          d="M0.154393339,3.89485454 L3.97631488,0.139296592 C4.17083111,-0.0518420739 4.48263286,-0.0518571125 4.67716753,0.139262789 L25.6916134,20.7848311 C26.0855801,21.1718824 26.0911863,21.8050225 25.704135,22.1989893 C25.7000188,22.2031791 25.6958657,22.2073326 25.6916762,22.2114492 L4.67709797,42.8607841 C4.48259567,43.0519059 4.17082418,43.0519358 3.97628526,42.8608513 L0.154518591,39.1069479 C-0.0424848215,38.9134427 -0.0453206733,38.5968729 0.148184538,38.3998695 C0.150289256,38.3977268 0.152413239,38.395603 0.154556228,38.3934985 L16.9937789,21.8567812 C17.1908028,21.6632968 17.193672,21.3467273 17.0001876,21.1497035 C16.9980647,21.1475418 16.9959223,21.1453995 16.9937605,21.1432767 L0.15452076,4.60825197 C-0.0425130651,4.41477773 -0.0453986756,4.09820839 0.148075568,3.90117456 C0.150162624,3.89904911 0.152268631,3.89694235 0.154393339,3.89485454 Z" 
                          fill="#FFFFFF"
                        />
                      </g>
                    </svg>
                  </span>
                </a>
              </div>
            )}

            {/* Desktop Selected Characters Pills */}
            {selectedCharacterIds.length > 0 && (
              <div className="hidden md:block fixed bottom-6 left-6 z-40">
                <div className="flex flex-wrap items-center gap-2 justify-center max-w-4xl px-4">
                  {/* Remove All Pill */}
                  <div
                    className="group flex items-center gap-2 px-4 py-2 rounded-full border-2 border-red-500 bg-black/60 backdrop-blur-xl transition-all duration-200 cursor-pointer"
                    style={{
                      boxShadow: "0 0 15px rgba(239, 68, 68, 0.5), 0 0 30px rgba(239, 68, 68, 0.3)"
                    }}
                    onClick={() => {
                      setShowConfirmRemoveAll(true);
                    }}
                  >
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span 
                      className="text-sm font-medium text-red-200 group-hover:text-white font-mono"
                    >
                      REMOVE_ALL
                    </span>
                  </div>
                  
                  {selectedCharacterIds.map((id) => {
                    const character = characters.find((c) => c.id === id);
                    if (!character) return null;
                    return (
                      <div
                        key={id}
                        className="group flex items-center gap-2 px-4 py-2 rounded-full border-2 border-yellow-500 bg-black/60 backdrop-blur-xl transition-all duration-200 cursor-pointer"
                        style={{
                          boxShadow: "0 0 15px rgba(234, 179, 8, 0.5), 0 0 30px rgba(234, 179, 8, 0.3)"
                        }}
                        onClick={() => {
                          setSelectedCharacterIds(prev => prev.filter(selectedId => selectedId !== id));
                        }}
                      >
                        <img
                          src={character.imageUrl}
                          alt={character.name}
                          className="w-8 h-8 rounded-full object-cover border border-gray-700"
                        />
                        <span 
                          className="text-sm font-medium text-gray-200 group-hover:text-white"
                          style={{ fontFamily: "'American Captain', sans-serif" }}
                        >
                          {character.name}
                        </span>
                        <button
                          className="ml-1 text-gray-400 hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCharacterIds(prev => prev.filter(selectedId => selectedId !== id));
                          }}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mobile Actions */}
            <MobileActions
              selectedCharacterIds={selectedCharacterIds}
              characters={characters}
              onRemoveAll={() => setSelectedCharacterIds([])}
              showConfirmRemoveAll={showConfirmRemoveAll}
              setShowConfirmRemoveAll={setShowConfirmRemoveAll}
            />

            {/* Desktop Confirmation Modal */}
            {showConfirmRemoveAll && (
              <>
                {/* Dimmed Background */}
                <div 
                  className="hidden md:block fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300"
                  onClick={() => setShowConfirmRemoveAll(false)}
                />
                
                {/* Confirmation Card */}
                <div className="hidden md:flex fixed inset-0 z-50 items-center justify-center p-4 pointer-events-none">
                  <div 
                    className="bg-cyan-950/80 backdrop-blur-xl border-2 border-cyan-800 rounded-lg p-8 max-w-md w-full pointer-events-auto shadow-2xl"
                    style={{
                      boxShadow: "0 0 30px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)"
                    }}
                  >
                    {/* Terminal-style header */}
                    <div className="mb-6 pb-4 border-b border-cyan-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-cyan-500 font-mono text-sm">$</span>
                        <h2 className="text-2xl font-bold text-cyan-100 uppercase font-mono tracking-wider">
                          CONFIRM_ACTION
                        </h2>
                        <span className="text-cyan-500 font-mono text-sm animate-pulse">_</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-cyan-500">[STATUS]</span>
                        <span className="text-yellow-400">PENDING</span>
                        <span className="text-cyan-500">|</span>
                        <span className="text-cyan-500">[TYPE]</span>
                        <span className="text-red-400">DESTRUCTIVE</span>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                      <p className="text-cyan-200 font-mono text-sm mb-2">
                        <span className="text-cyan-500">[QUERY]</span> Are you sure you want to remove all selected heroes?
                      </p>
                      <p className="text-cyan-400 font-mono text-xs">
                        <span className="text-cyan-500">[COUNT]</span> {selectedCharacterIds.length} {selectedCharacterIds.length === 1 ? 'HERO' : 'HEROES'} will be deselected.
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-4 justify-end">
                      <button
                        onClick={() => setShowConfirmRemoveAll(false)}
                        className="px-6 py-2 border-2 border-cyan-700 bg-cyan-950/50 text-cyan-200 font-mono text-sm hover:bg-cyan-900/50 transition-colors rounded"
                      >
                        [CANCEL]
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCharacterIds([]);
                          setShowConfirmRemoveAll(false);
                        }}
                        className="px-6 py-2 border-2 border-red-600 bg-red-950/50 text-red-200 font-mono text-sm hover:bg-red-900/50 transition-colors rounded"
                        style={{
                          boxShadow: "0 0 10px rgba(239, 68, 68, 0.3)"
                        }}
                      >
                        [CONFIRM]
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default function CharacterSelector() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen" style={{ backgroundColor: '#083d4d' }}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-400 border-r-transparent"></div>
            <p className="mt-4 text-cyan-300 font-mono">[LOADING]...</p>
          </div>
        </div>
      </main>
    }>
      <CharacterSelectorContent />
    </Suspense>
  );
}

