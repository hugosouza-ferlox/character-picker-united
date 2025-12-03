"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FlickeringGrid } from "@/components/ui/shadcn-io/flickering-grid";

export default function Menu() {
  const [teamCodeInput, setTeamCodeInput] = useState("");

  const handleLoadTeamCode = () => {
    try {
      // Decode base64 team code
      const decoded = atob(teamCodeInput.trim());
      const ids = decoded.split(',').filter(id => id.trim() !== '');
      
      if (ids.length > 0) {
        // Redirect directly to assemble screen with the team code
        window.location.href = `/assemble?ids=${ids.join(',')}`;
      } else {
        alert("Invalid team code.");
      }
    } catch (error) {
      alert("Invalid team code format.");
    }
  };

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
      
      <div className="relative z-10 container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        {/* Frosted Glass Container */}
        <div 
          className="bg-cyan-950/80 backdrop-blur-xl border-2 border-cyan-800/50 rounded-lg p-8 md:p-12 max-w-4xl w-full text-center shadow-2xl"
          style={{
            boxShadow: "0 0 30px rgba(6, 182, 212, 0.3), inset 0 0 20px rgba(6, 182, 212, 0.1)"
          }}
        >
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-1 md:gap-2 mb-4 px-2 flex-wrap">
              <span className="text-cyan-500 font-mono text-xs md:text-base flex-shrink-0">$</span>
              <h1 className="text-xl sm:text-2xl md:text-6xl font-bold text-cyan-100 uppercase font-mono tracking-wider break-words text-center" style={{
                textShadow: '0 0 10px rgba(6, 182, 212, 0.5), 0 0 20px rgba(6, 182, 212, 0.3), 2px 2px 0px rgba(0, 0, 0, 0.5)'
              }}>
                UNITED_HERO_SYSTEM
              </h1>
              <span className="text-cyan-500 font-mono text-xs md:text-base animate-pulse flex-shrink-0">_</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-mono">
              <span className="text-cyan-500">[STATUS]</span>
              <span className="text-green-400">ONLINE</span>
              <span className="text-cyan-500 hidden md:inline">|</span>
              <span className="text-cyan-500">[VERSION]</span>
              <span className="text-cyan-100">1.0.0</span>
              <span className="text-cyan-500 hidden md:inline">|</span>
              <span className="text-cyan-500">[MODE]</span>
              <span className="text-yellow-400">READY</span>
            </div>
          </div>


          {/* Main Button */}
          <div className="flex flex-col items-center gap-6">
            <Link 
              href="/character-selector"
              className="cta-button group flex items-center px-6 md:px-12 py-3 md:py-4 text-white transition-all duration-500 relative"
              style={{
                fontFamily: 'var(--font-poppins), sans-serif',
                fontSize: 'clamp(1.25rem, 5vw, 2.5rem)',
                background: '#06b6d4',
                boxShadow: '8px 8px 0 black',
                transform: 'skewX(-15deg)',
              }}
            >
              <span style={{ transform: 'skewX(15deg)' }}>TEAM BUILDER</span>
              <span 
                className="ml-4 md:ml-8 relative top-[12%] transition-all duration-500"
                style={{ 
                  transform: 'skewX(15deg)',
                  width: '20px'
                }}
              >
                <svg className="w-8 h-5 md:w-[66px] md:h-[43px]" viewBox="0 0 66 43" version="1.1" xmlns="http://www.w3.org/2000/svg">
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
            </Link>
            
            {/* Load Team Code Input */}
            <div className="flex flex-col items-center gap-3 w-full max-w-md">
              <textarea
                value={teamCodeInput}
                onChange={(e) => setTeamCodeInput(e.target.value)}
                placeholder="[PASTE_TEAM_CODE]"
                className="w-full px-4 py-3 bg-cyan-950/50 border-2 border-cyan-700 text-cyan-200 font-mono rounded focus:outline-none focus:border-cyan-500 resize-none placeholder:text-cyan-500/60 placeholder:uppercase"
                rows={3}
                style={{
                  boxShadow: "0 0 10px rgba(6, 182, 212, 0.2)",
                  fontSize: '1.25rem'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    handleLoadTeamCode();
                  }
                }}
              />
              <button
                onClick={handleLoadTeamCode}
                className="px-6 py-2 border-2 border-cyan-700 bg-cyan-950/80 backdrop-blur-xl text-cyan-200 font-mono text-sm hover:bg-cyan-900/50 transition-all duration-200 rounded"
                style={{
                  boxShadow: "0 0 10px rgba(6, 182, 212, 0.3)"
                }}
              >
                [LOAD]
              </button>
            </div>
            
            <p className="text-cyan-300 font-mono text-sm md:text-base max-w-2xl mx-auto">
              <span className="text-cyan-500">[INFO]</span> Select and assemble your team of heroes from the United Game System, featuring DC and Marvel United characters.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

