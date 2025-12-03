"use client";

import { Character } from "@/types/character";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CharacterFiltersProps {
  characters: Character[];
  onFilterChange: (filtered: Character[]) => void;
}

type SortType = 'none' | 'alphabetical' | 'wild' | 'heroic' | 'attacks' | 'movements';
type SortOrder = 'asc' | 'desc';

const statLabels = {
  wild: { label: 'Wild', color: 'gray', icon: '/icons/Wild_Icon.png' },
  heroic: { label: 'Heroic', color: 'yellow', icon: '/icons/Heroic_Icon.png' },
  attacks: { label: 'Attacks', color: 'red', icon: '/icons/Attack_Icon.png' },
  movements: { label: 'Movements', color: 'green', icon: '/icons/Move_Icon.png' },
};

export function CharacterFilters({ characters, onFilterChange }: CharacterFiltersProps) {
  const [wildThreshold, setWildThreshold] = useState(0);
  const [heroicThreshold, setHeroicThreshold] = useState(0);
  const [attacksThreshold, setAttacksThreshold] = useState(0);
  const [movementsThreshold, setMovementsThreshold] = useState(0);
  const [selectedSet, setSelectedSet] = useState<string>('all');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [sortType, setSortType] = useState<SortType>('alphabetical');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Get max values for sliders
  const maxWild = Math.max(...characters.map(c => c.stats[0]?.value || 0), 0);
  const maxHeroic = Math.max(...characters.map(c => c.stats[1]?.value || 0), 0);
  const maxAttacks = Math.max(...characters.map(c => c.stats[2]?.value || 0), 0);
  const maxMovements = Math.max(...characters.map(c => c.stats[3]?.value || 0), 0);

  // Get unique sets from characters
  const uniqueSets = Array.from(new Set(characters.map(c => c.set).filter((set): set is string => Boolean(set)))).sort();

  // Get unique groups from characters
  const allGroups = new Set<string>();
  characters.forEach(c => {
    if (c.groups) {
      c.groups.forEach(g => allGroups.add(g.trim()));
    }
  });
  const uniqueGroups = Array.from(allGroups).sort();

  // Group icon mapping (same as in character-card.tsx)
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

  // Normalize group names for display
  function normalizeGroupName(group: string): string {
    const normalized = group.toLowerCase().trim();
    
    // Special cases
    if (normalized === 'x men' || normalized === 'xmen' || normalized === 'x-men') {
      return 'X-men';
    }
    if (normalized === 'bat family' || normalized === 'batfamily') {
      return 'Bat Family';
    }
    if (normalized === 'avengers') {
      return 'Avengers';
    }
    if (normalized === 'dc') {
      return 'DC';
    }
    
    // Default: capitalize first letter of each word
    return group
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Apply filters and sorting whenever any filter changes
  useEffect(() => {
    let filtered = [...characters];

    // Filter by set
    if (selectedSet !== 'all') {
      filtered = filtered.filter(character => character.set === selectedSet);
    }

    // Filter by groups
    if (selectedGroups.length > 0) {
      filtered = filtered.filter(character => {
        if (!character.groups || character.groups.length === 0) return false;
        return selectedGroups.some(selectedGroup => 
          character.groups?.some(charGroup => charGroup.trim().toLowerCase() === selectedGroup.toLowerCase())
        );
      });
    }

    // Filter by stat thresholds
    filtered = filtered.filter(character => {
      const wild = character.stats[0]?.value || 0;
      const heroic = character.stats[1]?.value || 0;
      const attacks = character.stats[2]?.value || 0;
      const movements = character.stats[3]?.value || 0;

      return (
        wild >= wildThreshold &&
        heroic >= heroicThreshold &&
        attacks >= attacksThreshold &&
        movements >= movementsThreshold
      );
    });

    // Apply sorting
    if (sortType !== 'none') {
      if (sortType === 'alphabetical') {
        filtered.sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          
          if (sortOrder === 'asc') {
            return aName.localeCompare(bName);
          } else {
            return bName.localeCompare(aName);
          }
        });
      } else {
        const statIndex = {
          'wild': 0,
          'heroic': 1,
          'attacks': 2,
          'movements': 3,
        }[sortType] ?? 0;

        filtered.sort((a, b) => {
          const aValue = a.stats[statIndex]?.value || 0;
          const bValue = b.stats[statIndex]?.value || 0;
          
          if (sortOrder === 'asc') {
            return aValue - bValue;
          } else {
            return bValue - aValue;
          }
        });
      }
    }

    onFilterChange(filtered);
  }, [wildThreshold, heroicThreshold, attacksThreshold, movementsThreshold, selectedSet, selectedGroups, sortType, sortOrder, characters, onFilterChange]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stat Threshold Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-0">
        {/* Wild Threshold Slider */}
        <div className="px-2 md:px-4 border-r border-cyan-800/50 first:border-l-0 last:border-r-0 border-b sm:border-b-0 sm:last:border-b-0 pb-4 sm:pb-0">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="flex items-center gap-2">
              <Image src={statLabels.wild.icon} alt="Wild" width={54} height={54} className="opacity-80 w-10 h-10 md:w-14 md:h-14" />
              <label className="text-xs md:text-sm font-medium text-cyan-200 font-mono">[WILD]</label>
            </div>
            <span className="text-xs md:text-sm font-semibold text-cyan-100 font-mono">{wildThreshold}</span>
          </div>
          <div className="relative h-2 bg-cyan-900/50 rounded-full">
            <div 
              className="absolute h-full bg-gray-500 rounded-full transition-all duration-150"
              style={{ width: `${maxWild > 0 ? (wildThreshold / maxWild) * 100 : 0}%` }}
            />
            <div
              className="absolute w-4 h-4 bg-gray-400 border-2 border-black rounded-full shadow-lg transition-all duration-150 z-20 pointer-events-none"
              style={{ 
                left: `${Math.max(0, Math.min(100, maxWild > 0 ? (wildThreshold / maxWild) * 100 : 0))}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
            <input
              type="range"
              min="0"
              max={maxWild}
              value={wildThreshold}
              onChange={(e) => setWildThreshold(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              data-color="gray"
            />
          </div>
        </div>

        {/* Heroic Threshold Slider */}
        <div className="px-2 md:px-4 border-r border-cyan-800/50 first:border-l-0 last:border-r-0 border-b sm:border-b-0 sm:last:border-b-0 pb-4 sm:pb-0">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="flex items-center gap-2">
              <Image src={statLabels.heroic.icon} alt="Heroic" width={54} height={54} className="opacity-80 w-10 h-10 md:w-14 md:h-14" />
              <label className="text-xs md:text-sm font-medium text-cyan-200 font-mono">[HEROIC]</label>
            </div>
            <span className="text-xs md:text-sm font-semibold text-yellow-400 font-mono">{heroicThreshold}</span>
          </div>
          <div className="relative h-2 bg-cyan-900/50 rounded-full">
            <div 
              className="absolute h-full bg-yellow-500 rounded-full transition-all duration-150"
              style={{ width: `${maxHeroic > 0 ? (heroicThreshold / maxHeroic) * 100 : 0}%` }}
            />
            <div
              className="absolute w-4 h-4 bg-yellow-400 border-2 border-black rounded-full shadow-lg transition-all duration-150 z-20 pointer-events-none"
              style={{ 
                left: `${Math.max(0, Math.min(100, maxHeroic > 0 ? (heroicThreshold / maxHeroic) * 100 : 0))}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
            <input
              type="range"
              min="0"
              max={maxHeroic}
              value={heroicThreshold}
              onChange={(e) => setHeroicThreshold(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              data-color="yellow"
            />
          </div>
        </div>

        {/* Attacks Threshold Slider */}
        <div className="px-2 md:px-4 border-r border-cyan-800/50 first:border-l-0 last:border-r-0 border-b sm:border-b-0 sm:last:border-b-0 pb-4 sm:pb-0">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="flex items-center gap-2">
              <Image src={statLabels.attacks.icon} alt="Attacks" width={54} height={54} className="opacity-80 w-10 h-10 md:w-14 md:h-14" />
              <label className="text-xs md:text-sm font-medium text-cyan-200 font-mono">[ATTACKS]</label>
            </div>
            <span className="text-xs md:text-sm font-semibold text-red-400 font-mono">{attacksThreshold}</span>
          </div>
          <div className="relative h-2 bg-cyan-900/50 rounded-full">
            <div 
              className="absolute h-full bg-red-500 rounded-full transition-all duration-150"
              style={{ width: `${maxAttacks > 0 ? (attacksThreshold / maxAttacks) * 100 : 0}%` }}
            />
            <div
              className="absolute w-4 h-4 bg-red-400 border-2 border-black rounded-full shadow-lg transition-all duration-150 z-20 pointer-events-none"
              style={{ 
                left: `${Math.max(0, Math.min(100, maxAttacks > 0 ? (attacksThreshold / maxAttacks) * 100 : 0))}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
            <input
              type="range"
              min="0"
              max={maxAttacks}
              value={attacksThreshold}
              onChange={(e) => setAttacksThreshold(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              data-color="red"
            />
          </div>
        </div>

        {/* Movements Threshold Slider */}
        <div className="px-2 md:px-4 border-r border-cyan-800/50 first:border-l-0 last:border-r-0 border-b sm:border-b-0 sm:last:border-b-0 pb-4 sm:pb-0">
          <div className="flex items-center justify-between mb-2 md:mb-3">
            <div className="flex items-center gap-2">
              <Image src={statLabels.movements.icon} alt="Movements" width={54} height={54} className="opacity-80 w-10 h-10 md:w-14 md:h-14" />
              <label className="text-xs md:text-sm font-medium text-cyan-200 font-mono">[MOVEMENTS]</label>
            </div>
            <span className="text-xs md:text-sm font-semibold text-green-400 font-mono">{movementsThreshold}</span>
          </div>
          <div className="relative h-2 bg-cyan-900/50 rounded-full">
            <div 
              className="absolute h-full bg-green-500 rounded-full transition-all duration-150"
              style={{ width: `${maxMovements > 0 ? (movementsThreshold / maxMovements) * 100 : 0}%` }}
            />
            <div
              className="absolute w-4 h-4 bg-green-400 border-2 border-black rounded-full shadow-lg transition-all duration-150 z-20 pointer-events-none"
              style={{ 
                left: `${Math.max(0, Math.min(100, maxMovements > 0 ? (movementsThreshold / maxMovements) * 100 : 0))}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
            <input
              type="range"
              min="0"
              max={maxMovements}
              value={movementsThreshold}
              onChange={(e) => setMovementsThreshold(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              data-color="green"
            />
          </div>
        </div>
      </div>

      {/* Set Filter and Sort Options */}
      <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 md:gap-4 justify-center">
        {/* Group Filter */}
        {uniqueGroups.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label className="text-xs md:text-sm font-medium text-cyan-200 font-mono">[GROUP]</label>
            <Select
              value={selectedGroups.length > 0 ? selectedGroups[0] : 'all'}
              onValueChange={(value) => {
                setSelectedGroups(value === 'all' ? [] : [value]);
              }}
            >
              <SelectTrigger className="h-9 w-[180px] border-cyan-800 bg-cyan-950/50 text-cyan-100 hover:bg-cyan-900 focus:ring-cyan-700 font-mono text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {selectedGroups.length > 0 && (() => {
                    const selectedGroup = selectedGroups[0];
                    const iconPath = getGroupIcon(selectedGroup);
                    if (iconPath) {
                      return (
                        <>
                          <img
                            src={iconPath}
                            alt={selectedGroup}
                            width={16}
                            height={16}
                            className="object-contain flex-shrink-0"
                            style={{
                              filter: 'drop-shadow(0.5px 0 0 black) drop-shadow(-0.5px 0 0 black) drop-shadow(0 0.5px 0 black) drop-shadow(0 -0.5px 0 black)',
                            }}
                          />
                          <span className="truncate font-mono">{normalizeGroupName(selectedGroup)}</span>
                        </>
                      );
                    }
                    return <SelectValue placeholder="ALL_GROUPS" />;
                  })()}
                  {selectedGroups.length === 0 && (
                    <SelectValue placeholder="ALL_GROUPS" />
                  )}
                </div>
              </SelectTrigger>
              <SelectContent className="bg-cyan-950 border-cyan-800 font-mono text-xs">
                <SelectItem value="all" className="text-cyan-100 focus:bg-cyan-900 focus:text-white font-mono">
                  ALL_GROUPS
                </SelectItem>
                {uniqueGroups.map((group) => {
                  const iconPath = getGroupIcon(group);
                  const displayName = normalizeGroupName(group);
                  return (
                    <SelectItem
                      key={group}
                      value={group}
                      className="text-cyan-100 focus:bg-cyan-900 focus:text-white font-mono"
                    >
                      <div className="flex items-center gap-2">
                        {iconPath && (
                          <img
                            src={iconPath}
                            alt={group}
                            width={16}
                            height={16}
                            className="object-contain flex-shrink-0 pointer-events-none"
                            style={{
                              filter: 'drop-shadow(0.5px 0 0 black) drop-shadow(-0.5px 0 0 black) drop-shadow(0 0.5px 0 black) drop-shadow(0 -0.5px 0 black)',
                            }}
                          />
                        )}
                        <span className="font-mono">{displayName}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Set Filter */}
        {uniqueSets.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label className="text-xs md:text-sm font-medium text-cyan-200 font-mono">[SET]</label>
            <Select
              value={selectedSet}
              onValueChange={(value) => setSelectedSet(value)}
            >
              <SelectTrigger className="h-9 w-[180px] border-cyan-800 bg-cyan-950/50 text-cyan-100 hover:bg-cyan-900 focus:ring-cyan-700 font-mono text-xs">
                <SelectValue placeholder="ALL_SETS" />
              </SelectTrigger>
              <SelectContent className="bg-cyan-950 border-cyan-800 font-mono text-xs">
                <SelectItem value="all" className="text-cyan-100 focus:bg-cyan-900 focus:text-white font-mono">
                  ALL_SETS
                </SelectItem>
                {uniqueSets.map((set) => (
                  <SelectItem
                    key={set}
                    value={set}
                    className="text-cyan-100 focus:bg-cyan-900 focus:text-white font-mono"
                  >
                    {set.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Sort Type */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <label className="text-xs md:text-sm font-medium text-cyan-200 font-mono">[SORT]</label>
          <Select
            value={sortType}
            onValueChange={(value) => setSortType(value as SortType)}
          >
            <SelectTrigger className="h-9 w-[180px] border-cyan-800 bg-cyan-950/50 text-cyan-100 hover:bg-cyan-900 focus:ring-cyan-700 font-mono text-xs">
              <SelectValue placeholder="NONE" />
            </SelectTrigger>
            <SelectContent className="bg-cyan-950 border-cyan-800 font-mono text-xs">
              <SelectItem value="none" className="text-cyan-100 focus:bg-cyan-900 focus:text-white font-mono">
                NONE
              </SelectItem>
              <SelectItem value="alphabetical" className="text-cyan-100 focus:bg-cyan-900 focus:text-white font-mono">
                ALPHABETICAL
              </SelectItem>
              <SelectItem value="wild" className="text-cyan-100 focus:bg-cyan-900 focus:text-white font-mono">
                WILD
              </SelectItem>
              <SelectItem value="heroic" className="text-cyan-100 focus:bg-cyan-900 focus:text-white font-mono">
                HEROIC
              </SelectItem>
              <SelectItem value="attacks" className="text-cyan-100 focus:bg-cyan-900 focus:text-white font-mono">
                ATTACKS
              </SelectItem>
              <SelectItem value="movements" className="text-cyan-100 focus:bg-cyan-900 focus:text-white font-mono">
                MOVEMENTS
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order */}
        {sortType !== 'none' && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
            <label className="text-xs md:text-sm font-medium text-cyan-200 font-mono">[ORDER]</label>
            <Select
              value={sortOrder}
              onValueChange={(value) => setSortOrder(value as SortOrder)}
            >
              <SelectTrigger className="h-9 w-[140px] border-cyan-800 bg-cyan-950/50 text-cyan-100 hover:bg-cyan-900 focus:ring-cyan-700 font-mono text-xs">
                <SelectValue placeholder="ASC" />
              </SelectTrigger>
              <SelectContent className="bg-cyan-950 border-cyan-800 font-mono text-xs">
                <SelectItem value="asc" className="text-cyan-100 focus:bg-cyan-900 focus:text-white font-mono">
                  ASC ↑
                </SelectItem>
                <SelectItem value="desc" className="text-cyan-100 focus:bg-cyan-900 focus:text-white font-mono">
                  DESC ↓
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  );
}
