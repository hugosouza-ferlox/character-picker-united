"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Character } from "@/types/character";
import Image from "next/image";
import { FlickeringGrid } from "@/components/ui/shadcn-io/flickering-grid";
import { cn } from "@/lib/utils";

function AssembleContent() {
  const searchParams = useSearchParams();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCharacters() {
      try {
        const response = await fetch('/api/characters');
        const data = await response.json();
        setCharacters(data);
      } catch (error) {
        console.error('Error fetching characters:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCharacters();
  }, []);

  const selectedIds = searchParams.get('ids')?.split(',') || [];
  const selectedCharacters = characters.filter(c => selectedIds.includes(c.id));

  // Calculate team stats
  const teamStats = {
    wild: { total: 0, count: 0 },
    heroic: { total: 0, count: 0 },
    attacks: { total: 0, count: 0 },
    movements: { total: 0, count: 0 },
  };

  selectedCharacters.forEach(character => {
    character.stats.forEach((stat, index) => {
      if (index === 0) {
        teamStats.wild.total += stat.value;
        teamStats.wild.count++;
      } else if (index === 1) {
        teamStats.heroic.total += stat.value;
        teamStats.heroic.count++;
      } else if (index === 2) {
        teamStats.attacks.total += stat.value;
        teamStats.attacks.count++;
      } else if (index === 3) {
        teamStats.movements.total += stat.value;
        teamStats.movements.count++;
      }
    });
  });

  const statLabels = {
    wild: { label: 'Wild', color: 'gray', icon: '/icons/Wild_Icon.png' },
    heroic: { label: 'Heroic', color: 'yellow', icon: '/icons/Heroic_Icon.png' },
    attacks: { label: 'Attacks', color: 'red', icon: '/icons/Attack_Icon.png' },
    movements: { label: 'Movements', color: 'green', icon: '/icons/Move_Icon.png' },
  };

  const colorToIconMap: Record<string, string> = {
    yellow: "/icons/Heroic_Icon.png",
    green: "/icons/Move_Icon.png",
    red: "/icons/Attack_Icon.png",
    gray: "/icons/Wild_Icon.png",
  };

  const groupIconMap: Record<string, string> = {
    'avengers': '/icons/groups/avengers.png',
    'bat family': '/icons/groups/bat family.png',
    'batfamily': '/icons/groups/bat family.png',
    'x men': '/icons/groups/x men.png',
    'xmen': '/icons/groups/x men.png',
    'x-men': '/icons/groups/x men.png',
    'dc': '/icons/groups/dc.png',
    'spider people': '/icons/groups/spider people.png',
    'spiderpeople': '/icons/groups/spider people.png',
    'spider-people': '/icons/groups/spider people.png',
  };

  function getGroupIcon(groupName: string): string | null {
    const normalized = groupName.toLowerCase().trim();
    return groupIconMap[normalized] || null;
  }

  if (loading) {
    return (
      <main className="relative min-h-screen" style={{ backgroundColor: '#083d4d' }}>
        <FlickeringGrid
          className="fixed inset-0 z-0"
          squareSize={4}
          gridGap={6}
          flickerChance={0.3}
          color="rgb(120, 180, 200)"
          maxOpacity={0.35}
        />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-400 border-r-transparent"></div>
            <p className="mt-4 text-cyan-300 font-mono">[LOADING] INITIALIZING_TEAM...</p>
          </div>
        </div>
      </main>
    );
  }

  if (selectedCharacters.length === 0) {
    return (
      <main className="relative min-h-screen" style={{ backgroundColor: '#083d4d' }}>
        <FlickeringGrid
          className="fixed inset-0 z-0"
          squareSize={4}
          gridGap={6}
          flickerChance={0.3}
          color="rgb(120, 180, 200)"
          maxOpacity={0.35}
        />
        <div className="relative z-10 container mx-auto px-4 py-4 md:py-8">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-cyan-500 font-mono text-xs md:text-sm">$</span>
                <h1 className="text-2xl md:text-4xl font-bold text-cyan-100 uppercase font-mono tracking-wider">
                  NO_TEAM_SELECTED
                </h1>
                <span className="text-cyan-500 font-mono text-xs md:text-sm animate-pulse">_</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs font-mono justify-center">
                <span className="text-cyan-500">[STATUS]</span>
                <span className="text-red-400">ERROR</span>
                <span className="text-cyan-500 hidden md:inline">|</span>
                <span className="text-cyan-500">[COUNT]</span>
                <span className="text-cyan-100">0</span>
                <span className="text-cyan-400">HEROES</span>
              </div>
            </div>
            <a href={`/character-selector?team=${encodeURIComponent(btoa(selectedIds.join(',')))}`} className="px-4 md:px-6 py-3 border-2 border-cyan-700 bg-cyan-950/50 text-cyan-200 font-mono text-xs md:text-sm hover:bg-cyan-900/50 transition-colors rounded">
              [RETURN_TO_SELECTOR]
            </a>
          </div>
        </div>
      </main>
    );
  }

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
      
      <div className="relative z-10 container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-8 md:mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-cyan-500 font-mono text-xs md:text-sm">$</span>
            <h1 className="text-2xl md:text-5xl font-bold text-cyan-100 uppercase font-mono tracking-wider" style={{
              textShadow: '0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3), 2px 2px 0px rgba(0, 0, 0, 0.5)'
            }}>
              TEAM_ASSEMBLED
            </h1>
            <span className="text-cyan-500 font-mono text-xs md:text-sm animate-pulse">_</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs font-mono mb-6">
            <span className="text-cyan-500">[STATUS]</span>
            <span className="text-green-400">READY</span>
            <span className="text-cyan-500 hidden md:inline">|</span>
            <span className="text-cyan-500">[COUNT]</span>
            <span className="text-cyan-100 font-semibold">{selectedCharacters.length}</span>
            <span className="text-cyan-400">{selectedCharacters.length === 1 ? 'HERO' : 'HEROES'}</span>
            <span className="text-cyan-500 hidden md:inline">|</span>
            <span className="text-cyan-500">[MODE]</span>
            <span className="text-yellow-400">ASSEMBLED</span>
          </div>
          
          {/* Copy Team Code Button */}
          <button
            onClick={() => {
              // Create team code (base64 encoded IDs)
              const teamCode = btoa(selectedIds.join(','));
              navigator.clipboard.writeText(teamCode);
              // Show feedback
              const button = document.getElementById('copy-team-code-btn');
              if (button) {
                const originalText = button.textContent;
                button.textContent = '[COPIED!]';
                setTimeout(() => {
                  if (button) button.textContent = originalText;
                }, 2000);
              }
            }}
            id="copy-team-code-btn"
            className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 border-2 border-cyan-700 bg-cyan-950/80 backdrop-blur-xl text-cyan-200 font-mono text-xs md:text-sm hover:bg-cyan-900/50 transition-all duration-200 rounded relative overflow-hidden group"
            style={{
              boxShadow: "0 0 15px rgba(6, 182, 212, 0.3)"
            }}
          >
            <span className="relative z-10">[COPY_TEAM_CODE]</span>
            <div className="absolute inset-0 bg-cyan-800/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
          </button>
        </div>

        {/* Team Stats Breakdown - Frosted Glass Cards */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-cyan-500 font-mono text-sm">$</span>
            <h2 className="text-2xl font-bold text-cyan-100 uppercase font-mono tracking-wider">TEAM_STATISTICS</h2>
            <span className="text-cyan-500 font-mono text-sm animate-pulse">_</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {Object.entries(statLabels).map(([key, label]) => {
              const stat = teamStats[key as keyof typeof teamStats];
              const average = stat.count > 0 ? (stat.total / stat.count).toFixed(1) : '0';
              
              return (
                <div 
                  key={key}
                  className="bg-cyan-950/30 backdrop-blur-md border-2 border-cyan-800/30 rounded-lg p-6 text-center relative overflow-hidden"
                  style={{
                    boxShadow: "0 0 20px rgba(6, 182, 212, 0.2), inset 0 0 20px rgba(6, 182, 212, 0.05)"
                  }}
                >
                  {/* Decorative corner */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-600/50" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-600/50" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-600/50" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-600/50" />
                  
                  <div className="relative z-10">
                    <Image 
                      src={label.icon} 
                      alt={label.label} 
                      width={80} 
                      height={80} 
                      className="mx-auto mb-4 w-20 h-20 object-contain"
                    />
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <span className="text-cyan-500 font-mono text-xs">[{label.label.toUpperCase()}]</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="text-4xl font-bold text-cyan-100 font-mono" style={{
                          fontFamily: "'American Captain', sans-serif",
                          fontSize: '2.5rem',
                          fontWeight: 'normal',
                          WebkitTextStroke: "3px black",
                          textShadow: "3px 3px 0px black"
                        }}>{stat.total}</div>
                        <div className="text-xs text-cyan-400 font-mono mt-1">TOTAL</div>
                      </div>
                      <div className="pt-2 border-t border-cyan-800/50">
                        <div className="text-2xl font-semibold text-cyan-300 font-mono" style={{
                          fontFamily: "'American Captain', sans-serif",
                          fontSize: '1.75rem',
                          fontWeight: 'normal',
                          WebkitTextStroke: "2px black",
                          textShadow: "2px 2px 0px black"
                        }}>{average}</div>
                        <div className="text-xs text-cyan-400 font-mono mt-1">AVG</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Character Grid - Using Main Page Style */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-2 mb-6 md:mb-8">
            <span className="text-cyan-500 font-mono text-xs md:text-sm">$</span>
            <h2 className="text-xl md:text-2xl font-bold text-cyan-100 uppercase font-mono tracking-wider">TEAM_ROSTER</h2>
            <span className="text-cyan-500 font-mono text-xs md:text-sm animate-pulse">_</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-20 justify-items-center max-w-[2000px] mx-auto px-4 md:px-8">
            {selectedCharacters.map((character) => (
              <div
                key={character.id}
                className="relative border-4 border-cyan-800/50 cursor-default overflow-visible bg-cyan-950/20 backdrop-blur-md w-full max-w-sm md:max-w-none md:w-fit"
                style={{
                  boxShadow: "0 0 20px rgba(6, 182, 212, 0.3), 0 0 40px rgba(6, 182, 212, 0.2)",
                }}
              >
                {/* Main Card Container */}
                <div className="relative bg-transparent overflow-visible flex flex-col">
                  {/* Group Icons - Top Right Corner */}
                  {character.groups && character.groups.length > 0 && (
                    <div className="absolute top-0 right-0 z-30 flex flex-col gap-1 md:gap-2" style={{ transform: "translate(50%, -50%)" }}>
                      {character.groups.map((group, index) => {
                        const iconPath = getGroupIcon(group);
                        if (!iconPath) return null;
                        return (
                          <img
                            key={index}
                            src={iconPath}
                            alt={group}
                            width={64}
                            height={64}
                            className="w-8 h-8 md:w-16 md:h-16 object-contain"
                            style={{
                              filter: 'drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black)',
                            }}
                          />
                        );
                      })}
                    </div>
                  )}

                  {/* Character Image Section - Full Image, Filling Container */}
                  <div className="relative bg-gradient-to-b from-blue-100 via-blue-50 to-white overflow-hidden w-full" style={{ 
                    height: 'clamp(300px, 60vw, 500px)'
                  }}>
                    {/* Halftone Pattern Background */}
                    <div className="absolute inset-0 opacity-15">
                      <div className="w-full h-full" style={{
                        backgroundImage: `radial-gradient(circle, #000 1.5px, transparent 1.5px)`,
                        backgroundSize: '24px 24px',
                      }} />
                    </div>
                    
                    {/* Diagonal Line */}
                    <div className="absolute top-0 left-0 w-[200%] h-1.5 bg-white transform rotate-[-45deg] origin-top-left shadow-sm" />
                    
                    {/* Character Image - Filling the width, cropped at bottom */}
                    <div className="relative w-full h-full">
                      <Image
                        src={character.imageUrl}
                        alt={character.name}
                        fill
                        className="relative z-0"
                        style={{
                          objectFit: 'cover',
                          objectPosition: 'top center',
                          width: '100%',
                          height: '100%'
                        }}
                        priority
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/portraits/Batman_29_Back.webp';
                        }}
                      />
                    </div>
                  </div>

                  {/* Name Bar - Matching Main Page Style */}
                  <div className={cn(
                    "relative w-full h-16 md:h-20 z-20",
                    character.type === 'Dual Mode/Anti-Hero' ? "bg-purple-900" : "bg-blue-900"
                  )}>
                    {/* Decorative Pattern Overlay */}
                    <div className="absolute inset-0 opacity-20" style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        rgba(255,255,255,0.1) 10px,
                        rgba(255,255,255,0.1) 20px
                      )`,
                    }} />
                    
                    {/* Inner Border Pattern */}
                    <div className="absolute inset-[2px] border border-blue-200 opacity-50" />
                    
                    {/* Corner Decorations */}
                    <div className="absolute top-0 left-0 w-3 md:w-4 h-3 md:h-4 border-l-2 border-t-2 border-blue-200" />
                    <div className="absolute top-0 right-0 w-3 md:w-4 h-3 md:h-4 border-r-2 border-t-2 border-blue-200" />
                    <div className="absolute bottom-0 left-0 w-3 md:w-4 h-3 md:h-4 border-l-2 border-b-2 border-blue-200" />
                    <div className="absolute bottom-0 right-0 w-3 md:w-4 h-3 md:h-4 border-r-2 border-b-2 border-blue-200" />
                    
                    {/* Text */}
                    <div className="relative h-full flex items-center justify-center px-2 md:px-4 z-10 overflow-hidden">
                      <span
                        className="text-white uppercase tracking-wider relative block text-center"
                        style={{
                          textShadow: "2px 2px 0 #000",
                          fontFamily: "'American Captain', sans-serif",
                          fontSize: 'clamp(1.3rem, 5.2vw, 2.6rem)',
                          fontWeight: 300,
                          maxWidth: 'calc(100% - 1rem)',
                          lineHeight: '1.1',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          wordBreak: 'break-word'
                        }}
                      >
                        {character.name} {character.variant && `(${character.variant})`}
                      </span>
                    </div>
                    
                    {/* Side Pattern Lines */}
                    <div className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 md:h-8 opacity-60 bg-blue-200" />
                    <div className="absolute right-1 md:right-2 top-1/2 transform -translate-y-1/2 w-1 h-6 md:h-8 opacity-60 bg-blue-200" />
                  </div>

                  {/* Stats Section - Below Name Bar */}
                  <div className="relative w-full py-3 md:py-4 px-2 flex justify-center items-center gap-1 md:gap-2 z-30 bg-cyan-950/30 backdrop-blur-md">
                    {character.stats.map((stat, index) => {
                      const iconSrc = colorToIconMap[stat.color];
                      return (
                        <div
                          key={index}
                          className="relative"
                        >
                          {iconSrc && (
                            <div className="relative">
                              <Image
                                src={iconSrc}
                                alt={stat.color}
                                width={80}
                                height={80}
                                className="w-12 h-12 md:w-20 md:h-20 object-contain"
                                unoptimized
                              />
                              {/* Number overlaid on top of icon */}
                              <span
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-black leading-none z-10"
                                style={{ 
                                  fontFamily: "'American Captain', sans-serif",
                                  fontSize: 'clamp(2.25rem, 9vw, 5.625rem)',
                                  fontWeight: 'normal',
                                  WebkitTextStroke: "clamp(4.5px, 1.5vw, 9px) black", 
                                  paintOrder: "stroke fill",
                                  textShadow: "clamp(3px, 0.75vw, 6px) clamp(3px, 0.75vw, 6px) 0px black"
                                }}
                              >
                                {stat.value}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <a 
            href={`/character-selector?team=${encodeURIComponent(btoa(selectedIds.join(',')))}`} 
            className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-8 py-3 md:py-4 border-2 border-cyan-700 bg-cyan-950/80 backdrop-blur-xl text-cyan-200 font-mono text-xs md:text-sm hover:bg-cyan-900/50 transition-all duration-200 rounded relative overflow-hidden group"
            style={{
              boxShadow: "0 0 15px rgba(6, 182, 212, 0.3)"
            }}
          >
            <span className="relative z-10">←</span>
            <span className="relative z-10">[BACK_TO_SELECTOR]</span>
            <div className="absolute inset-0 bg-cyan-800/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
          </a>
        </div>
      </div>
    </main>
  );
}

export default function AssemblePage() {
  return (
    <Suspense fallback={
      <main className="relative min-h-screen" style={{ backgroundColor: '#083d4d' }}>
        <FlickeringGrid
          className="fixed inset-0 z-0"
          squareSize={4}
          gridGap={6}
          flickerChance={0.3}
          color="rgb(120, 180, 200)"
          maxOpacity={0.35}
        />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-cyan-400 border-r-transparent"></div>
            <p className="mt-4 text-cyan-300 font-mono">[LOADING]...</p>
          </div>
        </div>
      </main>
    }>
      <AssembleContent />
    </Suspense>
  );
}
