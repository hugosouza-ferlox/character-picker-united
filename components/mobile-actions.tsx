"use client";

import { Character } from "@/types/character";
import { useState } from "react";
import Link from "next/link";

interface MobileActionsProps {
  selectedCharacterIds: string[];
  characters: Character[];
  onRemoveAll: () => void;
  showConfirmRemoveAll: boolean;
  setShowConfirmRemoveAll: (show: boolean) => void;
}

export function MobileActions({ 
  selectedCharacterIds, 
  characters,
  onRemoveAll,
  showConfirmRemoveAll,
  setShowConfirmRemoveAll
}: MobileActionsProps) {
  if (selectedCharacterIds.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden border-t-2 border-cyan-800/50 bg-cyan-950/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3 gap-4">
          {/* Remove All Button - Left (Icon Only) */}
          <button
            onClick={() => setShowConfirmRemoveAll(true)}
            className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-red-500 bg-red-950/50 text-red-200 hover:bg-red-900/50 transition-colors"
            style={{
              boxShadow: "0 0 10px rgba(239, 68, 68, 0.3)"
            }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>

          {/* Assemble Button - Right with Counter (More Width) */}
          <Link
            href={`/assemble?ids=${selectedCharacterIds.join(',')}`}
            className="flex items-center justify-center gap-3 flex-1 px-6 py-3 rounded-lg border-2 border-cyan-500 bg-cyan-600 text-white font-semibold hover:bg-cyan-500 transition-colors relative"
            style={{
              boxShadow: "0 0 15px rgba(6, 182, 212, 0.5)",
              fontFamily: "'American Captain', sans-serif",
              fontSize: '1.5rem',
              fontWeight: 300,
              textShadow: "2px 2px 0 #000"
            }}
          >
            <span>ASSEMBLE</span>
            <div className="flex items-center justify-center min-w-[28px] h-7 px-2 rounded-full bg-yellow-500 text-black font-bold text-sm" style={{
              fontFamily: "'American Captain', sans-serif",
              textShadow: "1px 1px 0 rgba(255, 255, 255, 0.5)"
            }}>
              {selectedCharacterIds.length}
            </div>
          </Link>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmRemoveAll && (
        <>
          {/* Dimmed Background */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden"
            onClick={() => setShowConfirmRemoveAll(false)}
          />
          
          {/* Confirmation Card */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none md:hidden">
            <div 
              className="bg-cyan-950/80 backdrop-blur-xl border-2 border-cyan-800 rounded-lg p-6 max-w-md w-full pointer-events-auto shadow-2xl"
              style={{
                boxShadow: "0 0 30px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)"
              }}
            >
              {/* Terminal-style header */}
              <div className="mb-4 pb-4 border-b border-cyan-700/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-cyan-500 font-mono text-sm">$</span>
                  <h2 className="text-xl font-bold text-cyan-100 uppercase font-mono tracking-wider">
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
              <div className="mb-4">
                <p className="text-cyan-200 font-mono text-sm mb-2">
                  <span className="text-cyan-500">[QUERY]</span> Are you sure you want to remove all selected heroes?
                </p>
                <p className="text-cyan-400 font-mono text-xs">
                  <span className="text-cyan-500">[COUNT]</span> {selectedCharacterIds.length} {selectedCharacterIds.length === 1 ? 'HERO' : 'HEROES'} will be deselected.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmRemoveAll(false)}
                  className="px-4 py-2 border-2 border-cyan-700 bg-cyan-950/50 text-cyan-200 font-mono text-sm hover:bg-cyan-900/50 transition-colors rounded"
                >
                  [CANCEL]
                </button>
                <button
                  onClick={() => {
                    onRemoveAll();
                    setShowConfirmRemoveAll(false);
                  }}
                  className="px-4 py-2 border-2 border-red-600 bg-red-950/50 text-red-200 font-mono text-sm hover:bg-red-900/50 transition-colors rounded"
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
  );
}

