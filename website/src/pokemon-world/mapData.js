// Tilemap data
// 0 = grass (walkable)
// 1 = tree/wall (blocked)
// 2 = door/warp (interactive)
// 3 = flower decoration (walkable)
// 4 = path tile (walkable)
// 5 = fence (blocked)
// 6 = sign (blocked, interactive)
// 7 = NPC (blocked, interactive)
// 8 = water (blocked)
// 9 = tall grass (walkable)

// Map layout matching the Map.gif
// 18 columns × 18 rows
export const MAP = [
  // Row 0: Top buildings and structures
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // Row 1: Upper grass and paths
  [1, 1, 1, 1, 1, 0, 2, 0, 0, 0, 0, 0, 0, 6, 1, 1, 1, 1],
  // Row 2: Transition to central area
  [1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  // Row 3: Start of pond area
  [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 2, 1, 1],
  // Row 4: Pond with paths
  [1, 1, 2, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1],
  // Row 5: Central pond
  [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
  // Row 6: Middle pond area
  [1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 2, 1, 1],
  // Row 7: Central pond continues
  [1, 1, 2, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 1],
  // Row 8: Pond with paths
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 1, 1],
  // Row 9: Bottom of pond
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  // Row 10: Transition to paths
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Row 11: Path network
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  // Row 13: Fence line / transition
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // Row 14: Beach / sand area (walkable)
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Row 15: Beach continues
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Row 16: Bottom water edge
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // Row 17: Bottom water edge continues
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

export const TILE_SIZE = 48;

export const TILE_TYPES = {
  GRASS: 0,        // Walkable - grass/sand/beach
  TREE: 1,         // Blocked - tree/wall/building
  DOOR: 2,         // Interactive - building entrance
  FLOWER: 3,       // Walkable - decoration
  PATH: 4,         // Walkable - stone path
  FENCE: 5,        // Blocked - fence/barrier
  SIGN: 6,         // Interactive - sign/info
  NPC: 7,          // Interactive - character/guide
  WATER: 8,        // Blocked - pond/lake water
  TALL_GRASS: 9,   // Walkable - tall grass
  OCEAN: 10,       // Blocked - ocean/deep water
};

// Define which tiles block movement
export const BLOCKED_TILES = [
  TILE_TYPES.TREE,      // Buildings, walls, obstacles
  TILE_TYPES.FENCE,     // Fences and barriers
  TILE_TYPES.WATER,     // Pond/lake water
  TILE_TYPES.OCEAN,     // Ocean/deep water
];

// Define which tiles trigger interactions
export const INTERACTIVE_TILES = [
  TILE_TYPES.DOOR,
  TILE_TYPES.SIGN,
  TILE_TYPES.NPC,
];

// Define door locations and their actions
// You can customize what each door does by its position
export const DOOR_ACTIONS = {
  '6,1': {
    name: 'Products Page',
    description: 'Explore our product showcase',
    url: '/products/',
  },
  '15,3': {
    name: 'Get Started',
    description: 'Learn how to get started with StruXture',
    url: '/get-started/',
  },
  '2,4': {
    name: 'Team Page',
    description: 'Meet the StruXture team',
    url: '/team/',
  },
  '15,6': {
    name: 'About Us',
    description: 'Learn more about StruXture',
    url: '/about/',
  },
  '2,7': {
    name: 'Home',
    description: 'Return to the homepage',
    url: '/',
  },
};
