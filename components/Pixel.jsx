import { gridPath } from "@/lib/pixel";

// Pixel-art icons drawn from text grids ("#" = a filled pixel), rendered in currentColor
const ICONS = {
  arrowUpRight: [
    "..#####",
    ".....##",
    "....#.#",
    "...#..#",
    "..#...#",
    ".#.....",
    "#......",
  ],
  arrowRight: [
    "...#...",
    "....#..",
    ".....#.",
    "#######",
    ".....#.",
    "....#..",
    "...#...",
  ],
  arrowLeft: [
    "...#...",
    "..#....",
    ".#.....",
    "#######",
    ".#.....",
    "..#....",
    "...#...",
  ],
  arrowUp: [
    "...#...",
    "..###..",
    ".#.#.#.",
    "#..#..#",
    "...#...",
    "...#...",
    "...#...",
  ],
  download: [
    "...#...",
    "...#...",
    ".#.#.#.",
    "..###..",
    "...#...",
    "#.....#",
    "#######",
  ],
  pin: [
    ".#####.",
    "##...##",
    "#..#..#",
    "##...##",
    ".##.##.",
    "..###..",
    "...#...",
  ],
  mail: [
    "#########",
    "##.....##",
    "#.#...#.#",
    "#..#.#..#",
    "#...#...#",
    "#.......#",
    "#########",
  ],
  phone: [
    ".#####.",
    ".#...#.",
    ".#...#.",
    ".#...#.",
    ".#...#.",
    ".##.##.",
    ".#####.",
  ],
  star: [
    "...#...",
    "..###..",
    "#######",
    ".#####.",
    "..###..",
    ".##.##.",
    "##...##",
  ],
  chat: [
    "#######",
    "#.....#",
    "#.#.#.#",
    "#.....#",
    "#######",
    ".##....",
    ".#.....",
  ],
  lock: [
    "..###..",
    ".#...#.",
    ".#...#.",
    "#######",
    "###.###",
    "###.###",
    "#######",
  ],
  gamepad: [
    ".#########.",
    "##.#####.##",
    "#...###.#.#",
    "##.#####.##",
    "###########",
    "###.....###",
    ".##.....##.",
  ],
  menu: [
    ".......",
    "#######",
    ".......",
    "#######",
    ".......",
    "#######",
    ".......",
  ],
  close: [
    "#.....#",
    ".#...#.",
    "..#.#..",
    "...#...",
    "..#.#..",
    ".#...#.",
    "#.....#",
  ],
  sun: [
    "....#....",
    ".#.....#.",
    "...###...",
    "..#####..",
    "#.#####.#",
    "..#####..",
    "...###...",
    ".#.....#.",
    "....#....",
  ],
  moon: [
    "...###...",
    "..##.....",
    ".##......",
    ".##......",
    ".##......",
    ".###...#.",
    "..######.",
    "...###...",
    ".........",
  ],
  heart: [
    ".##.##.",
    "#######",
    "#######",
    ".#####.",
    "..###..",
    "...#...",
    ".......",
  ],
  play: [
    "#...",
    "##..",
    "###.",
    "####",
    "###.",
    "##..",
    "#...",
  ],
};

const PATHS = Object.fromEntries(
  Object.entries(ICONS).map(([name, rows]) => [name, { w: rows[0].length, h: rows.length, d: gridPath(rows) }])
);

export const PxIcon = ({ name, className = "" }) => {
  const icon = PATHS[name];
  const size = Math.max(icon.w, icon.h);
  return (
    <svg
      className={`px-icon ${className}`}
      viewBox={`0 0 ${icon.w} ${icon.h}`}
      width={`${icon.w / size}em`}
      height={`${icon.h / size}em`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path d={icon.d} fill="currentColor" />
    </svg>
  );
};

// Multi-colour sprite: each letter in the grid maps to a colour in `palette`, "." is transparent
export const Sprite = ({ rows, palette, className = "" }) => (
  <svg
    className={className}
    viewBox={`0 0 ${rows[0].length} ${rows.length}`}
    shapeRendering="crispEdges"
    aria-hidden="true"
    focusable="false"
  >
    {Object.entries(palette).map(([ch, color]) => (
      <path key={ch} d={gridPath(rows, ch)} fill={color} />
    ))}
  </svg>
);

// 16×16 player portrait: blocky head, dark hair, blue shirt (used in the nav, HUD and About card)
const AVATAR = [
  "................",
  "....kkkkkkkk....",
  "...khhkkkkkkk...",
  "..kkkkkkkkkkkk..",
  "..kksssskssssk..",
  "..kssssssssssk..",
  "..ksseesseessk..",
  "..ksseesseessk..",
  "..kssssssssssk..",
  "..kssmssssmssk..",
  "..ksssmmmmsssk..",
  "..kssssssssssk..",
  "...kkkkkkkkkk...",
  "..bbbbbddbbbbb..",
  ".bbbbbbddbbbbbb.",
  ".bbbbbbddbbbbbb.",
];
const AVATAR_PALETTE = {
  k: "#1d1a2e",
  h: "#3d3463",
  s: "#ffc94d",
  e: "#1d1a2e",
  m: "#1d1a2e",
  b: "#4cc9f0",
  d: "#2a6fb0",
};

export const Avatar = ({ className }) => <Sprite rows={AVATAR} palette={AVATAR_PALETTE} className={className} />;
