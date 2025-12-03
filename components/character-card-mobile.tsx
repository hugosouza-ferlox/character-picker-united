"use client";

import Image from "next/image";
import { Character } from "@/types/character";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface CharacterCardMobileProps {
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

export function CharacterCardMobile({ character, isSelected, onSelect }: CharacterCardMobileProps) {
  const nameRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState('1.5rem');

  useEffect(() => {
    const adjustFontSize = () => {
      if (!nameRef.current) return;
      
      const element = nameRef.current;
      const parent = element.parentElement;
      if (!parent) return;

      // Reset to base size to measure
      element.style.fontSize = '1.5rem';
      
      // Check if text overflows (height check for 2 lines, width check)
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight) || 1.1 * 24; // 1.1 * 1.5rem
      const maxHeight = lineHeight * 2; // 2 lines
      const maxWidth = parent.offsetWidth - 16; // Account for padding
      
      // If text overflows, reduce font size
      if (element.scrollHeight > maxHeight || element.scrollWidth > maxWidth) {
        // Try smaller sizes
        let testSize = 1.25;
        while (testSize >= 1) {
          element.style.fontSize = `${testSize}rem`;
          if (element.scrollHeight <= maxHeight && element.scrollWidth <= maxWidth) {
            setFontSize(`${testSize}rem`);
            return;
          }
          testSize -= 0.125; // Reduce by 0.125rem increments
        }
        // If still overflowing at minimum, use minimum
        setFontSize('1rem');
      } else {
        setFontSize('1.5rem');
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
        "relative w-[80%] max-w-sm mx-auto aspect-square border-4 border-black cursor-pointer transition-all duration-300 active:scale-[0.98] overflow-visible group/card character-card-wrapper",
        isSelected && "border-yellow-500"
      )}
      style={isSelected ? {
        boxShadow: "0 0 20px rgba(234, 179, 8, 0.6), 0 0 40px rgba(234, 179, 8, 0.4), 0 0 60px rgba(234, 179, 8, 0.3), inset 0 0 15px rgba(234, 179, 8, 0.15)",
        transform: "scale(1.02)",
      } : {
        boxShadow: "0 0 15px rgba(255, 255, 255, 0.15), 0 0 30px rgba(255, 255, 255, 0.1)",
      }}
      onTouchStart={(e) => {
        if (isSelected) {
          e.currentTarget.style.boxShadow = "0 0 20px rgba(234, 179, 8, 0.4), 0 0 40px rgba(234, 179, 8, 0.3), 0 0 60px rgba(234, 179, 8, 0.2)";
        } else {
          if (character.type === 'Dual Mode/Anti-Hero') {
            e.currentTarget.style.boxShadow = "0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.3), 0 0 60px rgba(168, 85, 247, 0.2)";
          } else {
            e.currentTarget.style.boxShadow = "0 0 20px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.2)";
          }
        }
      }}
      onTouchEnd={(e) => {
        if (isSelected) {
          e.currentTarget.style.boxShadow = "0 0 20px rgba(234, 179, 8, 0.6), 0 0 40px rgba(234, 179, 8, 0.4), 0 0 60px rgba(234, 179, 8, 0.3), inset 0 0 15px rgba(234, 179, 8, 0.15)";
        } else {
          e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 255, 255, 0.15), 0 0 30px rgba(255, 255, 255, 0.1)";
        }
      }}
    >
      {/* Main Card Container */}
      <div className="relative w-full h-full bg-white overflow-visible">
        {/* Group Icons - Top Right Corner - Smaller on mobile */}
        {character.groups && character.groups.length > 0 && (
          <div className="absolute top-0 right-0 z-30 flex flex-col gap-1" style={{ transform: "translate(50%, -50%)" }}>
            {character.groups.map((group, index) => {
              const iconPath = getGroupIcon(group);
              if (!iconPath) return null;
              return (
                <img
                  key={index}
                  src={iconPath}
                  alt={group}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                  style={{
                    filter: 'drop-shadow(1px 0 0 black) drop-shadow(-1px 0 0 black) drop-shadow(0 1px 0 black) drop-shadow(0 -1px 0 black)',
                  }}
                />
              );
            })}
          </div>
        )}
        
        {/* Character Image Section - Smaller on mobile */}
        <div className="relative w-full h-[75%] bg-gradient-to-b from-blue-100 via-blue-50 to-white overflow-hidden">
          {/* Halftone Pattern Background */}
          <div className="absolute inset-0 opacity-15">
            <div className="w-full h-full" style={{
              backgroundImage: `radial-gradient(circle, #000 1.5px, transparent 1.5px)`,
              backgroundSize: '24px 24px',
            }} />
          </div>
          
          {/* Diagonal Line */}
          <div className="absolute top-0 left-0 w-[200%] h-1.5 bg-white transform rotate-[-45deg] origin-top-left shadow-sm" />
          
          {/* Character Image */}
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

        {/* Name Banner - Smaller on mobile */}
        <div className={cn(
          "absolute h-[25%] border-4 relative overflow-hidden transition-all duration-300",
          isSelected ? "border-yellow-500" : "border-black",
          isSelected ? "bg-yellow-800" : (character.type === 'Dual Mode/Anti-Hero' ? "bg-purple-900" : "bg-blue-900")
        )} style={{ 
          bottom: '0px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: 'calc(100% + 20px)',
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
            "absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2",
            isSelected ? "border-yellow-200" : "border-blue-200"
          )} />
          <div className={cn(
            "absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2",
            isSelected ? "border-yellow-200" : "border-blue-200"
          )} />
          <div className={cn(
            "absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2",
            isSelected ? "border-yellow-200" : "border-blue-200"
          )} />
          <div className={cn(
            "absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2",
            isSelected ? "border-yellow-200" : "border-blue-200"
          )} />
          
          {/* Text */}
          <div className="relative h-full flex items-center justify-center px-2 z-10">
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
                maxWidth: 'calc(100% - 1rem)',
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
            "absolute left-1 top-1/2 transform -translate-y-1/2 w-1 h-6 opacity-60",
            isSelected ? "bg-yellow-200" : "bg-blue-200"
          )} />
          <div className={cn(
            "absolute right-1 top-1/2 transform -translate-y-1/2 w-1 h-6 opacity-60",
            isSelected ? "bg-yellow-200" : "bg-blue-200"
          )} />
        </div>

        {/* Stats Section - Smaller icons on mobile */}
        <div className="absolute right-0 top-1/2 flex flex-col items-center justify-center gap-0.5 z-30" style={{ transform: 'translateY(-50%)' }}>
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
                      width={60}
                      height={60}
                      className="w-[60px] h-[60px] object-contain"
                      unoptimized
                    />
                    {/* Number overlaid on top of icon - Smaller on mobile */}
                    <span
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-black leading-none z-10"
                      style={{ 
                        fontFamily: "'American Captain', sans-serif",
                        fontSize: '2.5rem',
                        fontWeight: 'normal',
                        WebkitTextStroke: "4px black", 
                        paintOrder: "stroke fill",
                        textShadow: "3px 3px 0px black"
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

