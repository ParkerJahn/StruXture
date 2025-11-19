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

export const MAP = [
  [8, 8, 8, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 8, 8, 8],
  [8, 8, 1, 1, 1, 0, 0, 0, 5, 5, 5, 0, 0, 1, 1, 1, 8, 8],
  [8, 1, 1, 0, 0, 0, 3, 0, 5, 2, 5, 3, 0, 0, 0, 1, 1, 8],
  [1, 1, 0, 0, 9, 9, 0, 0, 0, 4, 0, 0, 9, 9, 0, 0, 1, 1],
  [1, 0, 0, 3, 9, 9, 0, 4, 4, 4, 4, 0, 9, 9, 3, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 4, 4, 0, 0, 4, 4, 0, 0, 0, 0, 0, 1],
  [1, 0, 5, 5, 5, 4, 4, 0, 0, 0, 0, 4, 4, 5, 5, 5, 0, 1],
  [1, 0, 5, 5, 5, 4, 0, 0, 0, 0, 0, 0, 4, 5, 5, 5, 0, 1],
  [1, 0, 5, 5, 2, 4, 0, 0, 0, 0, 0, 0, 4, 2, 5, 5, 0, 1],
  [1, 0, 5, 5, 5, 4, 0, 0, 0, 0, 0, 0, 4, 5, 5, 5, 0, 1],
  [1, 0, 5, 5, 5, 4, 4, 0, 0, 0, 0, 4, 4, 5, 5, 5, 0, 1],
  [1, 0, 0, 0, 0, 0, 4, 4, 6, 0, 4, 4, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 3, 9, 9, 0, 4, 4, 4, 4, 0, 9, 9, 3, 0, 0, 1],
  [1, 1, 0, 0, 9, 9, 0, 0, 4, 4, 0, 0, 9, 9, 0, 0, 1, 1],
  [8, 1, 1, 0, 0, 0, 3, 0, 0, 0, 0, 3, 0, 0, 0, 1, 1, 8],
  [8, 8, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 8, 8],
  [8, 8, 8, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 8, 8, 8, 8],
];

export const TILE_SIZE = 48;

export const TILE_TYPES = {
  GRASS: 0,
  TREE: 1,
  DOOR: 2,
  FLOWER: 3,
  PATH: 4,
  FENCE: 5,
  SIGN: 6,
  NPC: 7,
  WATER: 8,
  TALL_GRASS: 9,
};

// Define which tiles block movement
export const BLOCKED_TILES = [
  TILE_TYPES.TREE,
  TILE_TYPES.FENCE,
  TILE_TYPES.SIGN,
  TILE_TYPES.NPC,
  TILE_TYPES.WATER,
];

// Define which tiles trigger interactions
export const INTERACTIVE_TILES = [
  TILE_TYPES.DOOR,
  TILE_TYPES.SIGN,
  TILE_TYPES.NPC,
];

