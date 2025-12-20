'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MAP, TILE_TYPES, BLOCKED_TILES, DOOR_ACTIONS } from './mapData';
import Header from '@/components/Header';
import Image from 'next/image';

interface Position {
  x: number;
  y: number;
}

const TileWorld = () => {
  const router = useRouter();
  const [playerPos, setPlayerPos] = useState<Position>({ x: 9, y: 1 });
  const [isMoving, setIsMoving] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('down');
  const [showGrid, setShowGrid] = useState(false);
  const [hoveredTile, setHoveredTile] = useState<{ x: number; y: number } | null>(null);

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
      // Create a position key to look up the specific door
      const doorKey = `${x},${y}`;
      const doorData = DOOR_ACTIONS[doorKey as keyof typeof DOOR_ACTIONS];
      
      if (doorData) {
        console.log(`Entering ${doorData.name}...`);
        // Navigate to the page
        router.push(doorData.url);
      } else {
        // Default message if door position isn't mapped
        console.log('Entered building!');
        alert('Welcome to our Product Showcase!\n\nThis house represents one of our products.');
      }
    } else if (tile === TILE_TYPES.SIGN) {
      alert('"Explore different houses to discover our amazing products!"');
    } else if (tile === TILE_TYPES.NPC) {
      alert('NPC: "Hello! Check out the houses around town to learn about our products!"');
    }
  }, [router]);

  // Handle player movement
  const movePlayer = useCallback((dx: number, dy: number, dir: 'up' | 'down' | 'left' | 'right') => {
    if (isMoving) return;

    setDirection(dir);
    const newX = playerPos.x + dx;
    const newY = playerPos.y + dy;

    // Debug logging
    console.log(`Trying to move from (${playerPos.x}, ${playerPos.y}) to (${newX}, ${newY})`);
    console.log(`Tile at destination: ${MAP[newY]?.[newX] ?? 'out of bounds'}`);
    console.log(`Is walkable: ${isWalkable(newX, newY)}`);

    if (isWalkable(newX, newY)) {
      setIsMoving(true);
      setPlayerPos({ x: newX, y: newY });
      
      handleTileInteraction(newX, newY);
      
      setTimeout(() => setIsMoving(false), 200);
    } else {
      console.log(`Blocked! Cannot move to (${newX}, ${newY})`);
    }
  }, [playerPos, isMoving, isWalkable, handleTileInteraction]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle grid with 'G' key
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setShowGrid(prev => !prev);
        return;
      }

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

  return (
    <div className="min-h-screen w-screen relative overflow-x-hidden">
      {/* Products Background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          background: 'linear-gradient(135deg, #404040 0%, #262626 50%, #1a1a1a 100%)',
        }}
      />
      {/* Subtle grid pattern overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      {/* Ambient glow effect */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(64,64,64,0.4) 0%, transparent 60%)',
        }}
      />

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

      <div className="relative z-50 flex flex-col items-center justify-start min-h-screen px-4 pb-6 overflow-x-hidden" style={{ paddingTop: '160px' }}>
        {/* Title Section */}
        <div className="mb-4 sm:mb-6 text-center bg-white rounded-xl py-4 px-6 shadow-lg border border-gray-300">
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3"
            style={{
              fontFamily: '"natom-pro", sans-serif',
              fontWeight: 700,
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            EXPLORE OUR PRODUCTS
          </h1>
          <p className="text-gray-800 text-xs sm:text-sm font-semibold" style={{ fontFamily: 'monospace' }}>
            <span className="hidden md:inline">Use arrow keys or WASD to move • </span>
            <span className="md:hidden">Use arrow buttons below to move • </span>
            Walk into houses to discover products
          </p>
          {showGrid && (
            <div className="mt-1 px-3 py-1 bg-yellow-100 border border-yellow-400 rounded text-xs text-yellow-900 font-mono inline-block">
              DEBUG MODE: Grid coordinates visible
            </div>
          )}
        </div>

        {/* CRT TV Frame Container */}
        <div className="relative w-full mx-auto flex-1 flex items-center justify-center overflow-visible px-2 sm:px-4 md:px-0" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {/* Game World Inside CRT Screen - Must render BEFORE frame for proper z-index layering */}
          <div 
            className="relative overflow-hidden mx-auto" 
            style={{ 
              aspectRatio: '4/3',
              width: '100%',
              maxWidth: '800px',
              height: 'auto',
              maxHeight: '100%',
            }}
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
                  {/* Map Background Image */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'url(/Map.gif)',
                      backgroundSize: '100% 100%',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      imageRendering: 'pixelated',
                      width: '100%',
                      height: '100%',
                    }}
                  />


                  {/* Debug Grid Overlay (Press 'G' to toggle) */}
                  {showGrid && (
                    <div 
                      className="absolute inset-0 z-40 pointer-events-none"
                      style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${MAP[0].length}, 1fr)`,
                        gridTemplateRows: `repeat(${MAP.length}, 1fr)`,
                      }}
                    >
                      {MAP.map((row, y) => (
                        row.map((tile, x) => (
                          <div
                            key={`grid-${x}-${y}`}
                            className="relative w-full h-full flex items-center justify-center border border-yellow-300/80 hover:border-yellow-400 transition-colors pointer-events-auto cursor-crosshair"
                            onMouseEnter={() => setHoveredTile({ x, y })}
                            onMouseLeave={() => setHoveredTile(null)}
                            style={{
                              borderWidth: '1px',
                              backgroundColor: 'transparent',
                            }}
                          >
                            {/* Show tile type number */}
                            <div className="text-yellow-300 font-mono text-sm sm:text-base md:text-lg font-black pointer-events-none">
                              {tile}
                            </div>
                          </div>
                        ))
                      ))}
                    </div>
                  )}

                  {/* Player Position Display (always visible when grid is on) */}
                  {showGrid && (
                    <div 
                      className="absolute top-2 left-2 bg-black/90 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-mono z-50 border-2 border-green-400"
                      style={{
                        textShadow: '0 0 2px black',
                      }}
                    >
                      <div className="font-bold text-green-300">PLAYER POSITION</div>
                      <div>X: {playerPos.x} / Y: {playerPos.y}</div>
                      <div>Tile Type: {MAP[playerPos.y][playerPos.x]}</div>
                      <div className="text-[10px] text-gray-300 mt-1">
                        {BLOCKED_TILES.includes(MAP[playerPos.y][playerPos.x]) ? 'Blocked' : 'Walkable'}
                      </div>
                    </div>
                  )}

                  {/* Hovered Tile Info Display */}
                  {showGrid && hoveredTile && (
                    <div 
                      className="absolute top-2 left-32 bg-black/80 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-mono z-50 border-2 border-yellow-400"
                      style={{
                        textShadow: '0 0 2px black',
                      }}
                    >
                      <div className="font-bold text-yellow-300">HOVERED TILE</div>
                      <div>X: {hoveredTile.x} / Y: {hoveredTile.y}</div>
                      <div>Tile Type: {MAP[hoveredTile.y][hoveredTile.x]}</div>
                      <div className="text-[10px] text-gray-300 mt-1">
                        {BLOCKED_TILES.includes(MAP[hoveredTile.y][hoveredTile.x]) ? 'Blocked' : 'Walkable'}
                      </div>
                    </div>
                  )}

                  {/* Player Character */}
                  <Image
                    src="/character.png"
                    alt="Player Character"
                    width={64}
                    height={96}
                    className="absolute z-50 transition-all duration-200 ease-linear pointer-events-none drop-shadow-lg"
                    style={{
                      left: `${((playerPos.x + 0.5) / MAP[0].length) * 100}%`,
                      top: `${((playerPos.y + 0.5) / MAP.length) * 100 * 1.35}%`,
                      width: '3.5vmin',
                      height: 'auto',
                      imageRendering: 'pixelated',
                      transform: direction === 'left' 
                        ? 'translate(-50%, -50%) scaleX(-1)' 
                        : 'translate(-50%, -50%)',
                    }}
                    priority
                  />
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

        {/* Arrow Controls - Mobile Only */}
        <div className="md:hidden mb-2 flex flex-col items-center gap-2 py-2">
          {/* Up Button */}
          <button
            onClick={() => movePlayer(0, -1, 'up')}
            className="w-20 h-20 bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl shadow-xl border-4 border-gray-200 flex items-center justify-center text-white text-5xl font-black active:scale-95 transition-all touch-none"
            aria-label="Move Up"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              boxShadow: '0 6px 16px rgba(0,0,0,0.3)'
            }}
          >
            ▲
          </button>
          
          {/* Left and Right Buttons Row */}
          <div className="flex gap-8">
            <button
              onClick={() => movePlayer(-1, 0, 'left')}
              className="w-20 h-20 bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl shadow-xl border-4 border-gray-200 flex items-center justify-center text-white text-5xl font-black active:scale-95 transition-all touch-none"
              aria-label="Move Left"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                boxShadow: '0 6px 16px rgba(0,0,0,0.3)'
              }}
            >
              ◀
            </button>
            
            <button
              onClick={() => movePlayer(1, 0, 'right')}
              className="w-20 h-20 bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl shadow-xl border-4 border-gray-200 flex items-center justify-center text-white text-5xl font-black active:scale-95 transition-all touch-none"
              aria-label="Move Right"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                boxShadow: '0 6px 16px rgba(0,0,0,0.3)'
              }}
            >
              ▶
            </button>
          </div>
          
          {/* Down Button */}
          <button
            onClick={() => movePlayer(0, 1, 'down')}
            className="w-20 h-20 bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl shadow-xl border-4 border-gray-200 flex items-center justify-center text-white text-5xl font-black active:scale-95 transition-all touch-none"
            aria-label="Move Down"
            style={{ 
              WebkitTapHighlightColor: 'transparent',
              boxShadow: '0 6px 16px rgba(0,0,0,0.3)'
            }}
          >
            ▼
          </button>
        </div>

        {/* Controls Info */}
        <div className="mt-2 sm:mt-3 bg-gradient-to-br from-gray-100 to-gray-200 p-2 sm:p-3 rounded-xl border border-gray-300 shadow-lg max-w-2xl mx-auto w-full">
          {/* Keyboard Controls Info */}
          <div className="hidden md:block text-center mb-2">
            <p className="text-gray-700 text-sm font-semibold mb-1" style={{ fontFamily: 'monospace' }}>
              Keyboard Controls
            </p>
            <div className="grid grid-cols-4 gap-2 text-gray-800 text-xs" style={{ fontFamily: 'monospace' }}>
              <div className="flex items-center justify-center gap-1 bg-blue-100 border border-blue-300 px-2 py-1.5 rounded">
                <span>W/↑</span>
              </div>
              <div className="flex items-center justify-center gap-1 bg-blue-100 border border-blue-300 px-2 py-1.5 rounded">
                <span>S/↓</span>
              </div>
              <div className="flex items-center justify-center gap-1 bg-blue-100 border border-blue-300 px-2 py-1.5 rounded">
                <span>A/←</span>
              </div>
              <div className="flex items-center justify-center gap-1 bg-blue-100 border border-blue-300 px-2 py-1.5 rounded">
                <span>D/→</span>
              </div>
            </div>
          </div>
          
          {/* Mobile Instructions */}
          <div className="md:hidden text-center text-gray-800 text-xs" style={{ fontFamily: 'monospace' }}>
            <div className="bg-blue-100 border border-blue-300 px-3 py-2 rounded">
              <span className="text-sm">Use arrow buttons above to move around</span>
            </div>
          </div>
          
          <p className="text-center mt-2 text-gray-600 text-xs">
            Products • Info • Guides
          </p>
          
          {/* Grid Toggle Indicator */}
          <div className="mt-2 pt-2 border-t border-gray-300 text-center">
            <button
              onClick={() => setShowGrid(prev => !prev)}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-all ${
                showGrid 
                  ? 'bg-yellow-400 text-black border-2 border-yellow-600 shadow-lg' 
                  : 'bg-gray-300 text-gray-700 border border-gray-400'
              }`}
            >
              {showGrid ? 'Grid: ON' : 'Grid: OFF'} (Press G)
            </button>
            {showGrid && (
              <p className="text-[10px] text-gray-500 mt-1">
                Hover over tiles to see coordinates
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TileWorld;

