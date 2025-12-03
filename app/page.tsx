"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FlickeringGrid } from "@/components/ui/shadcn-io/flickering-grid";

export default function Home() {
  const [showContent, setShowContent] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [screenOn, setScreenOn] = useState(false);
  const timeoutRefs = useRef<NodeJS.Timeout[]>([]);

  const bootSequence = [
    { text: "$ ./united_hero_system", delay: 20 },
    { text: "Initializing system...", delay: 15 },
    { text: "[OK] Loading core modules...", delay: 15 },
    { text: "[OK] Establishing database connections...", delay: 15 },
    { text: "[OK] Loading character data...", delay: 15 },
    { text: "[OK] Initializing UI framework...", delay: 15 },
    { text: "[OK] Compiling assets...", delay: 15 },
    { text: "[OK] Starting web server...", delay: 15 },
    { text: "[OK] Loading configuration files...", delay: 15 },
    { text: "[OK] Verifying system integrity...", delay: 15 },
    { text: "[OK] Establishing secure connections...", delay: 15 },
    { text: "[OK] Loading hero database...", delay: 15 },
    { text: "[OK] Initializing filter systems...", delay: 15 },
    { text: "[OK] Compiling UI components...", delay: 15 },
    { text: "[OK] System ready.", delay: 30 },
    { text: "Launching interface...", delay: 50 },
  ];

  useEffect(() => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined') return;

    // Check if we should skip animation (only if coming from menu with a flag)
    const skipParam = new URLSearchParams(window.location.search).get('skip');
    if (skipParam === 'true') {
      window.location.href = '/menu';
      return;
    }

    // Screen turning on animation
    const screenTimer = setTimeout(() => {
      setScreenOn(true);
    }, 50);

    // Start boot sequence after screen is on
    const bootTimer = setTimeout(() => {
      let lineIndex = 0;
      let charIndex = 0;
      let currentText = "";

      const typeNextChar = () => {
        if (lineIndex < bootSequence.length) {
          const line = bootSequence[lineIndex];
          if (charIndex < line.text.length) {
            // Type multiple characters at once for speed
            const charsToType = Math.min(3, line.text.length - charIndex);
            currentText += line.text.substring(charIndex, charIndex + charsToType);
            setDisplayedText(currentText);
            charIndex += charsToType;
            const id = setTimeout(typeNextChar, 1); // Very fast typing
            timeoutRefs.current.push(id);
          } else {
            // Move to next line
            currentText += "\n";
            setDisplayedText(currentText);
            lineIndex++;
            charIndex = 0;
            const id = setTimeout(typeNextChar, line.delay);
            timeoutRefs.current.push(id);
          }
        } else {
          // Boot sequence complete, redirect to menu
          const id = setTimeout(() => {
            window.location.href = '/menu';
          }, 100);
          timeoutRefs.current.push(id);
        }
      };

      typeNextChar();
    }, 100);
    
    timeoutRefs.current.push(bootTimer);
    timeoutRefs.current.push(screenTimer);

    return () => {
      timeoutRefs.current.forEach(id => clearTimeout(id));
      timeoutRefs.current = [];
    };
  }, []);

  return (
    <main className="relative min-h-screen flex items-center justify-center" style={{ backgroundColor: '#083d4d' }}>
      {/* Flickering Grid Background */}
      <FlickeringGrid
        className="fixed inset-0 z-0"
        squareSize={4}
        gridGap={6}
        flickerChance={0.3}
        color="rgb(120, 180, 200)"
        maxOpacity={0.35}
      />
      
      {/* Boot Sequence */}
      {!showContent && (
        <div 
          className={`fixed inset-0 z-50 bg-black transition-opacity duration-1000 ${
            screenOn ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            pointerEvents: screenOn ? 'none' : 'auto'
          }}
        />
      )}

      {!showContent && screenOn && (
        <div className="fixed inset-0 z-40 bg-black flex items-center justify-center p-4">
          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-black border-2 border-cyan-500/50 rounded-lg p-4 md:p-8 font-mono text-sm md:text-base text-cyan-400 h-[70vh] md:h-[500px] overflow-hidden flex flex-col">
              <div className="whitespace-pre-wrap break-words overflow-y-auto flex-1">
                {displayedText}
                <span className="animate-pulse">_</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
