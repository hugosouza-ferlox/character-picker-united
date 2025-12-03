"use client";

import { Character } from "@/types/character";
import { CharacterFilters } from "@/components/character-filters";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CharacterFiltersMobileProps {
  characters: Character[];
  onFilterChange: (filtered: Character[]) => void;
}

export function CharacterFiltersMobile({ characters, onFilterChange }: CharacterFiltersMobileProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button 
          className="inline-flex items-center gap-1 px-2 py-1.5 border border-cyan-700 bg-cyan-950/50 text-cyan-200 font-mono text-xs hover:bg-cyan-900/50 transition-all duration-200 rounded"
          style={{
            boxShadow: "0 0 8px rgba(6, 182, 212, 0.2)"
          }}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
            />
          </svg>
          <span>[FILTERS]</span>
        </button>
      </SheetTrigger>
      <SheetContent 
        side="bottom" 
        className="bg-cyan-950/95 backdrop-blur-xl border-t-2 border-cyan-800/50 h-[90vh] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-cyan-100 font-mono text-xl">
            <span className="text-cyan-500">$</span> FILTERS
            <span className="text-cyan-500 animate-pulse">_</span>
          </SheetTitle>
          <SheetDescription className="text-cyan-300 font-mono text-xs">
            Adjust filters to refine your character selection
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <CharacterFilters 
            characters={characters} 
            onFilterChange={onFilterChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

