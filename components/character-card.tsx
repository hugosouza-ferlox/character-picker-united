"use client";

import Image from "next/image";
import { Character } from "@/types/character";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface CharacterCardProps {
  character: Character;
  isSelected?: boolean;
  onSelect?: () => void;
}

// Map colors to icon PNG files
const colorToIconMap: Record<string, string> = {
  yellow: "/icons/Heroic_Icon.png",
  green: "/icons/Move_Icon.png",
  red: "/icons/Attack_Icon.png",
  gray: "/icons/Wild_Icon.png",
};

const colorClasses = {
  gray: "bg-gray-400",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  green: "bg-green-500",
};

const textShadowStyle = { textShadow: "2px 2px 0 #000" };

// Map group names to icon files
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

export function CharacterCard({ character, isSelected, onSelect }: CharacterCardProps) {
  const nameRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState('2rem');

  useEffect(() => {
    const adjustFontSize = () => {
      if (!nameRef.current) return;
      
      const element = nameRef.current;
      const parent = element.parentElement;
      if (!parent) return;

      // Reset to base size to measure
      element.style.fontSize = '2rem';
      
      // Check if text overflows (height check for 2 lines, width check)
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 1.1 * 32; // 1.1 * 2rem
      const maxHeight = lineHeight * 2; // 2 lines
      const maxWidth = parent.offsetWidth - 32; // Account for padding
      
      // If text overflows, reduce font size
      if (element.scrollHeight > maxHeight || element.scrollWidth > maxWidth) {
        // Try smaller sizes
        let testSize = 1.75;
        while (testSize >= 1.25) {
          element.style.fontSize = `${testSize}rem`;
          if (element.scrollHeight <= maxHeight && element.scrollWidth <= maxWidth) {
            setFontSize(`${testSize}rem`);
            return;
          }
          testSize -= 0.125; // Reduce by 0.125rem increments
        }
        // If still overflowing at minimum, use minimum
        setFontSize('1.25rem');
      } else {
        setFontSize('2rem');
      }
    };

    adjustFontSize();
    window.addEventListener('resize', adjustFontSize);
    return () => window.removeEventListener('resize', adjustFontSize);
  }, [character.name, character.variant]);

  return (
    <div
      onClick={onSelect}
      className={cn(
        "relative w-[400px] h-[400px] border-4 border-black cursor-pointer transition-all duration-300 hover:scale-105 overflow-visible group/card character-card-wrapper",
        isSelected && "border-yellow-500"
      )}
      style={isSelected ? {
        boxShadow: "0 0 20px rgba(234, 179, 8, 0.6), 0 0 40px rgba(234, 179, 8, 0.4), 0 0 60px rgba(234, 179, 8, 0.3), inset 0 0 15px rgba(234, 179, 8, 0.15)",
        transform: "scale(1.02)",
      } : {
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.15), 0 0 30px rgba(255, 255, 255, 0.1)",
      }}
      onMouseEnter={(e) => {
        if (isSelected) {
          // Yellow glow for selected cards
          e.currentTarget.style.boxShadow = "0 0 20px rgba(234, 179, 8, 0.4), 0 0 40px rgba(234, 179, 8, 0.3), 0 0 60px rgba(234, 179, 8, 0.2)";
        } else {
          // Use purple glow for anti-heroes, blue for heroes
          if (character.type === 'Dual Mode/Anti-Hero') {
            e.currentTarget.style.boxShadow = "0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.2)";
          } else {
            e.currentTarget.style.boxShadow = "0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.2)";
          }
        }
      }}
      onMouseLeave={(e) => {
        if (isSelected) {
          // Restore yellow glow for selected cards
          e.currentTarget.style.boxShadow = "0 0 20px rgba(234, 179, 8, 0.6), 0 0 40px rgba(234, 179, 8, 0.4), 0 0 60px rgba(234, 179, 8, 0.3), inset 0 0 15px rgba(234, 179, 8, 0.15)";
        } else {
          e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 255, 255, 0.15), 0 0 30px rgba(255, 255, 255, 0.1)";
        }
      }}
    >
      {/* Main Card Container - No overflow to allow icons to extend */}
      <div className="relative w-full h-full bg-white overflow-visible">
        {/* Group Icons - Top Right Corner */}
        {character.groups && character.groups.length > 0 && (
          <div className="absolute top-0 right-0 z-30 flex flex-col gap-2" style={{ transform: "translate(50%, -50%)" }}>
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
                  className="w-16 h-16 object-contain"
                  style={{
                    filter: 'drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black)',
                  }}
                />
              );
            })}
          </div>
        )}
        {/* Character Image Section - Fills width, cropped to top */}
        <div className="relative w-full h-[320px] bg-gradient-to-b from-blue-100 via-blue-50 to-white overflow-hidden">
          {/* Halftone Pattern Background */}
          <div className="absolute inset-0 opacity-15">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle, #000 1.5px, transparent 1.5px)`,
              backgroundSize: '24px 24px',
            }} />
          </div>
          
          {/* Diagonal Line */}
          <div className="absolute top-0 left-0 w-[200%] h-1.5 bg-white transform rotate-[-45deg] origin-top-left shadow-sm" />
          
          {/* Character Image - Fills width, cropped to top */}
          <div className="relative w-full h-full overflow-hidden group/image">
            <Image
              src={character.imageUrl}
              alt={character.name}
              width={400}
              height={320}
              className={cn(
                "object-cover w-full h-full object-top relative z-0 transition-all duration-500",
                !isSelected && "grayscale group-hover/card:grayscale-0"
              )}
              priority
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = '/portraits/Batman_29_Back.webp';
              }}
            />
            {/* Holographic Sheen Effect */}
            <div 
              className="holographic-sheen absolute z-10 pointer-events-none opacity-0 group-hover/image:opacity-100 transition-all duration-500 ease-in-out"
              style={{
                background: isSelected
                  ? 'linear-gradient(0deg, transparent, transparent 30%, rgba(234, 179, 8, 0.3))'
                  : (character.type === 'Dual Mode/Anti-Hero' 
                    ? 'linear-gradient(0deg, transparent, transparent 30%, rgba(168, 85, 247, 0.3))'
                    : 'linear-gradient(0deg, transparent, transparent 30%, rgba(59, 130, 246, 0.3))'),
                transform: 'rotate(-45deg) translateY(-100%)',
                width: '200%',
                height: '200%',
                top: '-50%',
                left: '-50%',
              }}
            />
          </div>
        </div>

        {/* Name Banner with Intricate Design - Centered and wider than card */}
        <div className={cn(
          "absolute h-[80px] border-4 relative overflow-hidden transition-all duration-300",
          isSelected ? "border-yellow-500" : "border-black",
          isSelected ? "bg-yellow-800" : (character.type === 'Dual Mode/Anti-Hero' ? "bg-purple-900" : "bg-blue-900")
        )} style={{ 
          bottom: '0px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '420px',
          boxShadow: isSelected 
            ? "0 0 20px rgba(234, 179, 8, 0.6), 0 0 40px rgba(234, 179, 8, 0.4), 0 0 60px rgba(234, 179, 8, 0.3), inset 0 0 15px rgba(234, 179, 8, 0.15)"
            : undefined
        }}>
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
          <div className={cn(
            "absolute inset-[2px] border opacity-50",
            isSelected ? "border-yellow-200" : "border-blue-200"
          )} />
          
          {/* Corner Decorations */}
          <div className={cn(
            "absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2",
            isSelected ? "border-yellow-200" : "border-blue-200"
          )} />
          <div className={cn(
            "absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2",
            isSelected ? "border-yellow-200" : "border-blue-200"
          )} />
          <div className={cn(
            "absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2",
            isSelected ? "border-yellow-200" : "border-blue-200"
          )} />
          <div className={cn(
            "absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2",
            isSelected ? "border-yellow-200" : "border-blue-200"
          )} />
          
          {/* Text */}
          <div className="relative h-full flex items-center justify-center px-4 z-10">
            <span
              ref={nameRef}
              className={cn(
                "text-white uppercase tracking-wider hover-underline-name relative block text-center",
                isSelected ? 'hover-underline-yellow' : (character.type === 'Dual Mode/Anti-Hero' ? 'hover-underline-purple' : 'hover-underline-blue')
              )}
              style={{
                ...textShadowStyle,
                fontFamily: "'American Captain', sans-serif",
                fontSize: fontSize,
                fontWeight: 300,
                maxWidth: 'calc(100% - 2rem)',
                lineHeight: '1.1',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-word',
                overflow: 'visible'
              }}
            >
              {character.name} {character.variant && `(${character.variant})`}
            </span>
          </div>
          
          {/* Side Pattern Lines */}
          <div className={cn(
            "absolute left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 opacity-60",
            isSelected ? "bg-yellow-200" : "bg-blue-200"
          )} />
          <div className={cn(
            "absolute right-2 top-1/2 transform -translate-y-1/2 w-1 h-8 opacity-60",
            isSelected ? "bg-yellow-200" : "bg-blue-200"
          )} />
        </div>

        {/* Stats Section - Icons with numbers overlaid */}
        <div className="absolute right-0 top-1/2 flex flex-col items-center justify-center gap-0.2 z-30" style={{ transform: 'translateY(-50%)' }}>
          {character.stats.map((stat, index) => {
            const iconSrc = colorToIconMap[stat.color];
            return (
              <div
                key={index}
                className="relative"
                style={{
                  transform: "translateX(50%)",
                }}
              >
                {iconSrc && (
                  <div className="relative">
                    <Image
                      src={iconSrc}
                      alt={stat.color}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-contain"
                      unoptimized
                    />
                    {/* Number overlaid on top of icon */}
                    <span
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-black leading-none z-10"
                      style={{ 
                        fontFamily: "'American Captain', sans-serif",
                        fontSize: '3.75rem',
                        fontWeight: 'normal',
                        WebkitTextStroke: "6px black", 
                        paintOrder: "stroke fill",
                        textShadow: "4px 4px 0px black"
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
  );
}

