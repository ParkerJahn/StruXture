'use client';

import { useState, useEffect, useCallback } from 'react';
import { MAP, TILE_TYPES, BLOCKED_TILES } from './mapData';
import Header from '@/components/Header';
import Image from 'next/image';

interface Position {
  x: number;
  y: number;
}

const TileWorld = () => {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 9, y: 8 });
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);

  // Check if a tile is walkable
  const isWalkable = useCallback((x: number, y: number): boolean => {
    // Check bounds
    if (y < 0 || y >= MAP.length || x < 0 || x >= MAP[0].length) {
      return false;
    }
    
    const tile = MAP[y][x];
    return !BLOCKED_TILES.includes(tile);
  }, []);

  // Handle tile interaction (like entering a door)
  const handleTileInteraction = useCallback((x: number, y: number) => {
    const tile = MAP[y][x];
    if (tile === TILE_TYPES.DOOR) {
      console.log('🚪 Entered building!');
      alert('🏠 Welcome to our Product Showcase!\n\nThis house represents one of our products.');
    } else if (tile === TILE_TYPES.SIGN) {
      alert('📋 "Explore different houses to discover our amazing products!"');
    } else if (tile === TILE_TYPES.NPC) {
      alert('👋 NPC: "Hello! Check out the houses around town to learn about our products!"');
    }
  }, []);

  // Handle player movement
  const movePlayer = useCallback((dx: number, dy: number, dir: 'up' | 'down' | 'left' | 'right') => {
    if (isMoving) return;

    setDirection(dir);
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    if (isWalkable(newX, newY)) {
      setIsMoving(true);
      setPlayerPos({ x: newX, y: newY });
      
      handleTileInteraction(newX, newY);
      
      setTimeout(() => setIsMoving(false), 200);
    }
  }, [playerPos, isMoving, isWalkable, handleTileInteraction]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer(0, -1, 'up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer(0, 1, 'down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer(-1, 0, 'left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer(1, 0, 'right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  // Touch controls for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const minSwipeDistance = 30;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          movePlayer(1, 0, 'right');
        } else {
          movePlayer(-1, 0, 'left');
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          movePlayer(0, 1, 'down');
        } else {
          movePlayer(0, -1, 'up');
        }
      }
    }

    setTouchStart(null);
  };

  // Render tile based on type
  const renderTile = (tile: number) => {
    const baseClasses = "absolute w-full h-full";
    
    switch (tile) {
      case TILE_TYPES.GRASS:
        return (
          <div className={`${baseClasses} bg-[#4CAF50]`}>
            <div className="w-full h-full" style={{
              backgroundColor: '#4CAF50',
              backgroundImage: `radial-gradient(circle at 25% 25%, #66BB6A 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, #388E3C 2px, transparent 2px)`,
              backgroundSize: '16px 16px',
              backgroundPosition: '0 0, 8px 8px'
            }} />
          </div>
        );
      
      case TILE_TYPES.PATH:
        return (
          <div className={`${baseClasses} bg-[#D2B48C]`}>
            <div className="w-full h-full" style={{
              backgroundColor: '#D2B48C',
              backgroundImage: `radial-gradient(circle, #C19A6B 1px, transparent 1px)`,
              backgroundSize: '8px 8px'
            }} />
          </div>
        );
      
      case TILE_TYPES.TREE:
        return (
          <div className={`${baseClasses} bg-[#6B8F6B]`}>
            <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl"
            style={{
              backgroundColor: '#182c25',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            >🌲</div>
          </div>
        );
      
      case TILE_TYPES.WATER:
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-[#4A90E2] to-[#5BA3F5]`}>
            <div className="w-full h-full animate-pulse" style={{
              backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 2px, transparent 2px)`,
              backgroundSize: '20px 20px'
            }} />
          </div>
        );
      
      case TILE_TYPES.FLOWER:
        return (
          <div className={`${baseClasses} bg-[#4CAF50]`}>
            <div className="w-full h-full flex items-center justify-center text-lg sm:text-xl md:text-2xl" style={{ backgroundColor: '#4CAF50' }}>🌸</div>
          </div>
        );
      
      case TILE_TYPES.TALL_GRASS:
        return (
          <div className={`${baseClasses} bg-[#388E3C]`}>
            <div className="w-full h-full flex items-center justify-center text-base sm:text-lg md:text-xl opacity-70" style={{ backgroundColor: '#388E3C' }}>🌾</div>
          </div>
        );
      
      case TILE_TYPES.FENCE:
        return (
          <div className={`${baseClasses} bg-[#8B6F47] flex items-center justify-center`}>
            <div className="w-full h-full border-2 border-[#5C4A2F]" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #6B5437 0px, #6B5437 8px, transparent 8px, transparent 16px)',
            }} />
          </div>
        );
      
      case TILE_TYPES.DOOR:
        return (
          <div className={`${baseClasses} bg-[#4CAF50]`}>
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#4CAF50' }}>
              <div className="text-xl sm:text-2xl md:text-3xl animate-bounce">🚪</div>
            </div>
          </div>
        );
      
      case TILE_TYPES.SIGN:
        return (
          <div className={`${baseClasses} bg-[#4CAF50]`}>
            <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl" style={{ backgroundColor: '#4CAF50' }}>🪧</div>
          </div>
        );
      
      case TILE_TYPES.NPC:
        return (
          <div className={`${baseClasses} bg-[#4CAF50]`}>
            <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl md:text-3xl" style={{ backgroundColor: '#4CAF50' }}>🧑</div>
          </div>
        );
      
      default:
        return <div className={`${baseClasses} bg-gray-300`} />;
    }
  };

  // Get player sprite based on direction
  const getPlayerSprite = () => {
    const sprites = {
      up: '🚶',
      down: '🚶',
      left: '🚶',
      right: '🚶'
    };
    return sprites[direction];
  };

  return (
    <div className="min-h-screen w-screen bg-white relative overflow-x-hidden">
      <Header />
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .player-sprite {
          animation: float 1s ease-in-out infinite;
        }
      `}</style>

      <div className="relative z-50 flex flex-col items-center justify-start h-screen pt-14 sm:pt-16 px-4 pb-3 overflow-hidden">
        {/* Title Section */}
        <div className="mb-2 sm:mb-3 text-center">
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-1 sm:mb-2"
            style={{
              fontFamily: '"natom-pro", sans-serif',
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            EXPLORE OUR PRODUCTS
          </h1>
          <p className="text-gray-700 text-xs sm:text-sm" style={{ fontFamily: 'monospace' }}>
            <span className="hidden sm:inline">Use arrow keys or WASD to move • </span>
            <span className="sm:hidden">Swipe to move • </span>
            Walk into houses to discover products
          </p>
        </div>

        {/* CRT TV Frame Container */}
        <div className="relative w-full max-w-[2000px] mx-auto flex-1 flex items-center justify-center overflow-visible px-2 sm:px-4 md:px-0" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {/* Game World Inside CRT Screen - Must render BEFORE frame for proper z-index layering */}
          <div 
            className="relative w-full overflow-hidden" 
            style={{ 
              aspectRatio: '4/3', 
              maxHeight: '100%',
              maxWidth: '100%'
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="absolute overflow-hidden"
              style={{
                top: '16.7%',
                left: '13.5%',
                width: '62%',
                height: '62%',
                zIndex: 1,
                clipPath: 'inset(0)',
              }}
            >
              {/* CRT Screen Effects */}
              <div className="absolute inset-0 bg-black overflow-hidden" style={{ borderRadius: '3px', clipPath: 'inset(0)' }}>
                {/* Game Content */}
                <div className="relative w-full h-full overflow-hidden">
                  <div 
                    className="absolute overflow-hidden"
                    style={{
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'grid',
                      gridTemplateColumns: `repeat(${MAP[0].length}, 1fr)`,
                      gridTemplateRows: `repeat(${MAP.length}, 1fr)`,
                      imageRendering: 'pixelated',
                      alignItems: 'stretch',
                      justifyItems: 'stretch',
                      gap: 0
                    }}
                  >
                    {MAP.map((row, y) => (
                      row.map((tile, x) => (
                        <div
                          key={`${x}-${y}`}
                          className="relative w-full h-full"
                          style={{ minWidth: 0, minHeight: 0 }}
                        >
                          {renderTile(tile)}
                        </div>
                      ))
                    ))}
                  </div>

                  {/* Player Character */}
                  <div
                    className="absolute z-50 flex items-center justify-center transition-all duration-200 ease-linear player-sprite pointer-events-none"
                    style={{
                      left: `${(playerPos.x / MAP[0].length) * 100}%`,
                      top: `${(playerPos.y / MAP.length) * 100}%`,
                      width: `${(1 / MAP[0].length) * 100}%`,
                      height: `${(1 / MAP.length) * 100}%`,
                      transform: direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
                    }}
                  >
                    <div className="text-base xs:text-lg sm:text-xl md:text-2xl filter drop-shadow-lg">
                      {getPlayerSprite()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CRT Frame Image - Renders on TOP to mask overflow */}
            <Image
              src="/CRTframe.png"
              alt="CRT TV Frame"
              fill
              className="pointer-events-none"
              style={{ zIndex: 10, objectFit: 'fill', width: '100%', height: '100%' }}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 2000px"
            />
          </div>
        </div>

        {/* Controls Info */}
        <div className="mt-2 sm:mt-3 bg-gradient-to-br from-gray-100 to-gray-200 p-2 sm:p-3 rounded-xl border border-gray-300 shadow-lg max-w-2xl mx-auto w-full">
          {/* Desktop Controls */}
          <div className="hidden sm:grid grid-cols-4 gap-2 text-gray-800 text-xs" style={{ fontFamily: 'monospace' }}>
            <div className="flex items-center justify-center gap-1 bg-purple-100 border border-purple-300 px-2 py-1.5 rounded">
              <span className="text-sm">⬆️</span>
              <span>W/↑</span>
            </div>
            <div className="flex items-center justify-center gap-1 bg-purple-100 border border-purple-300 px-2 py-1.5 rounded">
              <span className="text-sm">⬇️</span>
              <span>S/↓</span>
            </div>
            <div className="flex items-center justify-center gap-1 bg-purple-100 border border-purple-300 px-2 py-1.5 rounded">
              <span className="text-sm">⬅️</span>
              <span>A/←</span>
            </div>
            <div className="flex items-center justify-center gap-1 bg-purple-100 border border-purple-300 px-2 py-1.5 rounded">
              <span className="text-sm">➡️</span>
              <span>D/→</span>
            </div>
          </div>
          
          {/* Mobile Touch Instructions */}
          <div className="sm:hidden text-center text-gray-800 text-xs" style={{ fontFamily: 'monospace' }}>
            <div className="bg-purple-100 border border-purple-300 px-3 py-2 rounded">
              <span className="text-sm">👆 Swipe on the CRT screen to move</span>
            </div>
          </div>
          
          <p className="text-center mt-2 text-gray-600 text-xs">
            🏠 Products • 🪧 Info • 🧑 Guides
          </p>
        </div>
      </div>
    </div>
  );
};

export default TileWorld;

